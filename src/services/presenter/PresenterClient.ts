import {
  EMPTY_DEVICE_STATE,
  isEventMessage,
  normalizeSnapshot,
} from './protocol';
import type {
  CommandMessage,
  DeviceState,
  InboundMessage,
  PresenterCommand,
  PresenterEventName,
} from './protocol';

/** State of the browser <-> presenter WebSocket link (not the projector link). */
export type LinkStatus = 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed';

export interface SyncInfo {
  source: number;
  status: number;
}

export interface PresenterStoreState {
  link: LinkStatus;
  device: DeviceState;
  /** Number of commands awaiting a response. */
  pending: number;
  /** Last error reported by the presenter or the transport. */
  lastError: string | null;
  /** Name + timestamp of the most recent driver event, for the activity log. */
  lastEvent: { name: PresenterEventName; at: number } | null;
  /** Payload of the most recent undocumented `!SYNC` event. */
  lastSync: SyncInfo | null;
}

export interface SendOptions {
  intValue?: number;
  boolValue?: boolean;
  ip?: string;
  port?: number;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;
/** `connect` awaits `AltairDriver.ConnectAsync`, which retries until it succeeds. */
const CONNECT_TIMEOUT_MS = 25_000;
const RECONNECT_MIN_MS = 1_000;
const RECONNECT_MAX_MS = 15_000;
/** Grace period before tearing down the socket, so React StrictMode remounts reuse it. */
const RELEASE_GRACE_MS = 300;

interface PendingRequest {
  resolve: (snapshot: DeviceState) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * Single WebSocket connection to `AltairPresenter`, exposed as an external store.
 *
 * Responsibilities: framing commands, correlating responses by `requestId`,
 * folding driver events into a `DeviceState`, and reconnecting with backoff.
 * It knows nothing about React or about how the state is rendered.
 */
export class PresenterClient {
  private readonly url: string;
  private readonly listeners = new Set<() => void>();
  private readonly pendingRequests = new Map<string, PendingRequest>();

  private socket: WebSocket | null = null;
  private refCount = 0;
  private requestCounter = 0;
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private releaseTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  private state: PresenterStoreState = {
    link: 'idle',
    device: EMPTY_DEVICE_STATE,
    pending: 0,
    lastError: null,
    lastEvent: null,
    lastSync: null,
  };

  constructor(url: string) {
    this.url = url;
  }

  // ---------------------------------------------------------------- store API

  getState = (): PresenterStoreState => this.state;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  /** Opens the socket on the first consumer; the returned callback releases it. */
  acquire(): () => void {
    this.refCount += 1;
    if (this.releaseTimer !== null) {
      clearTimeout(this.releaseTimer);
      this.releaseTimer = null;
    }
    if (this.socket === null) {
      this.open();
    }

    let released = false;
    return () => {
      if (released) return;
      released = true;
      this.refCount -= 1;
      if (this.refCount <= 0) {
        this.releaseTimer = setTimeout(() => {
          this.releaseTimer = null;
          if (this.refCount <= 0) this.close();
        }, RELEASE_GRACE_MS);
      }
    };
  }

  // -------------------------------------------------------------- command API

  /**
   * Sends a command and resolves with the state snapshot the presenter returns.
   * Always rejects on timeout — a dropped or unanswered command never leaves a
   * dangling promise.
   */
  send(command: PresenterCommand, options: SendOptions = {}): Promise<DeviceState> {
    const socket = this.socket;
    if (socket === null || socket.readyState !== WebSocket.OPEN) {
      return Promise.reject(new Error('Presenter is not connected'));
    }

    this.requestCounter += 1;
    const requestId = `req-${this.requestCounter}`;
    const message: CommandMessage = { command, requestId };
    if (options.intValue !== undefined) message.intValue = options.intValue;
    if (options.boolValue !== undefined) message.boolValue = options.boolValue;
    if (options.ip !== undefined) message.ip = options.ip;
    if (options.port !== undefined) message.port = options.port;

    const timeoutMs =
      options.timeoutMs ?? (command === 'connect' ? CONNECT_TIMEOUT_MS : DEFAULT_TIMEOUT_MS);

    return new Promise<DeviceState>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        this.patch({ pending: Math.max(0, this.state.pending - 1) });
        reject(new Error(`Command '${command}' timed out after ${timeoutMs} ms`));
      }, timeoutMs);

      this.pendingRequests.set(requestId, { resolve, reject, timer });
      this.patch({ pending: this.state.pending + 1 });

      try {
        socket.send(JSON.stringify(message));
      } catch (error) {
        clearTimeout(timer);
        this.pendingRequests.delete(requestId);
        this.patch({ pending: Math.max(0, this.state.pending - 1) });
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  clearError(): void {
    if (this.state.lastError !== null) this.patch({ lastError: null });
  }

  // ------------------------------------------------------------------ socket

  private open(): void {
    if (this.disposed) return;

    this.patch({ link: this.reconnectAttempt === 0 ? 'connecting' : 'reconnecting' });

    let socket: WebSocket;
    try {
      socket = new WebSocket(this.url);
    } catch (error) {
      this.patch({ lastError: error instanceof Error ? error.message : String(error) });
      this.scheduleReconnect();
      return;
    }
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.patch({ link: 'open', lastError: null });
      // The presenter pushes a StateSnapshot on accept; ask the driver to refresh
      // from the device as well. Fails harmlessly when the projector is offline.
      void this.send('queryall').catch(() => undefined);
    };

    socket.onmessage = (event) => {
      if (typeof event.data !== 'string') return;
      this.handleMessage(event.data);
    };

    socket.onerror = () => {
      this.patch({ lastError: `Cannot reach the presenter at ${this.url}` });
    };

    socket.onclose = () => {
      this.socket = null;
      this.rejectAllPending(new Error('Presenter connection closed'));
      this.patch({
        link: 'closed',
        device: { ...this.state.device, isConnected: false, deviceIsReady: false },
      });
      if (this.refCount > 0) this.scheduleReconnect();
    };
  }

  private close(): void {
    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.rejectAllPending(new Error('Presenter connection closed'));

    const socket = this.socket;
    this.socket = null;
    if (socket !== null) {
      socket.onopen = null;
      socket.onmessage = null;
      socket.onerror = null;
      socket.onclose = null;
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
        socket.close();
      }
    }
    this.reconnectAttempt = 0;
    this.patch({ link: 'idle' });
  }

  private scheduleReconnect(): void {
    if (this.disposed || this.reconnectTimer !== null) return;

    const delay = Math.min(RECONNECT_MAX_MS, RECONNECT_MIN_MS * 2 ** this.reconnectAttempt);
    this.reconnectAttempt += 1;
    this.patch({ link: 'reconnecting' });
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.refCount > 0) this.open();
    }, delay);
  }

  // ---------------------------------------------------------------- messaging

  private handleMessage(raw: string): void {
    let message: InboundMessage;
    try {
      message = JSON.parse(raw) as InboundMessage;
    } catch {
      this.patch({ lastError: 'Received malformed JSON from the presenter' });
      return;
    }

    if (isEventMessage(message)) {
      this.applyEvent(message.event, message.data);
      return;
    }

    const { requestId, data, error } = message;
    const pending = requestId !== undefined ? this.pendingRequests.get(requestId) : undefined;

    if (pending !== undefined && requestId !== undefined) {
      clearTimeout(pending.timer);
      this.pendingRequests.delete(requestId);
      this.patch({ pending: Math.max(0, this.state.pending - 1) });
    }

    if (message.type === 'error') {
      const reason = error ?? 'Unknown presenter error';
      this.patch({ lastError: reason });
      pending?.reject(new Error(reason));
      return;
    }

    // Every successful command replies with a fresh snapshot.
    const snapshot = normalizeSnapshot(data);
    if (data !== undefined) {
      this.patch({ device: snapshot, lastError: null });
    }
    pending?.resolve(snapshot);
  }

  /**
   * Folds a driver event into the device state.
   *
   * Single-field events carry exactly one property, and a `null` value is omitted
   * from the JSON entirely — so for those events "absent" is read as `null` instead
   * of being merged away, which would otherwise preserve a stale value forever.
   */
  private applyEvent(event: PresenterEventName, data: Record<string, unknown> | undefined): void {
    const device = this.state.device;
    let next: DeviceState = device;

    switch (event) {
      case 'StateSnapshot':
        next = normalizeSnapshot(data as Parameters<typeof normalizeSnapshot>[0]);
        break;
      case 'PowerStateChanged':
        next = { ...device, power: asPowerState(data?.power) };
        break;
      case 'SourceStateChanged':
        next = { ...device, source: asNumber(data?.source) };
        break;
      case 'LightOutputStateChanged':
        next = { ...device, lightOutput: asNumber(data?.lightOutput) };
        break;
      case 'ShutterStateChanged':
        next = { ...device, shutter: asBoolean(data?.shutter) };
        break;
      case 'DeviceIsReadyChanged':
        next = { ...device, deviceIsReady: asBoolean(data?.deviceIsReady) ?? false };
        break;
      case 'Connected':
        next = { ...device, isConnected: true };
        break;
      case 'Disconnected':
        next = { ...device, isConnected: false, deviceIsReady: false };
        break;
      case 'Ready':
        next = { ...device, deviceIsReady: true };
        break;
      case 'Standby':
        next = { ...device, deviceIsReady: false };
        break;
      case 'SyncEvent': {
        const source = asNumber(data?.source);
        const status = asNumber(data?.status);
        this.patch({
          lastEvent: { name: event, at: Date.now() },
          lastSync: source !== null && status !== null ? { source, status } : null,
        });
        return;
      }
    }

    this.patch({ device: next, lastEvent: { name: event, at: Date.now() } });
  }

  private rejectAllPending(error: Error): void {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timer);
      pending.reject(error);
    }
    this.pendingRequests.clear();
    if (this.state.pending !== 0) this.patch({ pending: 0 });
  }

  // ---------------------------------------------------------------- internals

  private patch(partial: Partial<PresenterStoreState>): void {
    this.state = { ...this.state, ...partial };
    for (const listener of this.listeners) listener();
  }
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function asBoolean(value: unknown): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function asPowerState(value: unknown): DeviceState['power'] {
  return value === 'Off' || value === 'On' || value === 'SwitchingOn' || value === 'SwitchingOff'
    ? value
    : null;
}
