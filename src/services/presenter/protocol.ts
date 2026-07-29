/**
 * TypeScript mirror of the wire protocol implemented by `Altair.Demo/AltairPresenter.cs`.
 *
 * Important detail carried over from the C# side: the presenter serialises with
 * `DefaultIgnoreCondition = WhenWritingNull`, so every nullable field is *omitted*
 * from the JSON rather than sent as `null`. Everything nullable is therefore optional
 * here, and `normalizeSnapshot` turns "absent" back into an explicit `null`.
 */

/** `PowerState` enum from `AltairAp300.Driver`, serialised via `ToString()`. */
export const POWER_STATES = ['Off', 'On', 'SwitchingOn', 'SwitchingOff'] as const;
export type PowerStateName = (typeof POWER_STATES)[number];

/** Commands accepted by `AltairPresenter.HandleCommandAsync`. */
export const PRESENTER_COMMANDS = [
  'connect',
  'disconnect',
  'poweron',
  'poweroff',
  'setsource',
  'setlightoutput',
  'setshutter',
  'querypower',
  'querysource',
  'querylightoutput',
  'queryshutter',
  'queryall',
  'getstate',
] as const;
export type PresenterCommand = (typeof PRESENTER_COMMANDS)[number];

/** Shape of `AltairPresenter.CommandMessage` (web JSON defaults => camelCase). */
export interface CommandMessage {
  command: PresenterCommand;
  ip?: string;
  port?: number;
  intValue?: number;
  boolValue?: boolean;
  requestId?: string;
}

/** Raw `BuildStateSnapshot()` payload — nullable members may be missing. */
export interface RawStateSnapshot {
  isConnected?: boolean;
  deviceIsReady?: boolean;
  power?: PowerStateName | null;
  source?: number | null;
  lightOutput?: number | null;
  shutter?: boolean | null;
  firmwareVersion?: string | null;
  ipAddress?: string | null;
  port?: number | null;
}

/** Normalised, fully-populated view of the device used throughout the UI. */
export interface DeviceState {
  /** Driver <-> projector TCP link. */
  isConnected: boolean;
  /** Projector reported `!RDY`. */
  deviceIsReady: boolean;
  power: PowerStateName | null;
  /** Input source, 1–4. */
  source: number | null;
  /** Light output, 0–100 %. */
  lightOutput: number | null;
  /** `true` means the shutter is CLOSED (driver: `SetShutterAsync(bool closed)`). */
  shutter: boolean | null;
  firmwareVersion: string;
  ipAddress: string;
  port: number | null;
}

export const EMPTY_DEVICE_STATE: DeviceState = {
  isConnected: false,
  deviceIsReady: false,
  power: null,
  source: null,
  lightOutput: null,
  shutter: null,
  firmwareVersion: '',
  ipAddress: '',
  port: null,
};

/** Event names broadcast by `SubscribeToDriverEvents` plus the initial snapshot. */
export type PresenterEventName =
  | 'StateSnapshot'
  | 'PowerStateChanged'
  | 'SourceStateChanged'
  | 'LightOutputStateChanged'
  | 'ShutterStateChanged'
  | 'Connected'
  | 'Disconnected'
  | 'Ready'
  | 'Standby'
  | 'DeviceIsReadyChanged'
  | 'SyncEvent';

export interface EventMessage {
  type: 'event';
  event: PresenterEventName;
  /** Absent for parameterless events (`Connected`, `Ready`, …). */
  data?: Record<string, unknown>;
}

export interface ResponseMessage {
  type: 'response' | 'error';
  requestId?: string;
  data?: RawStateSnapshot;
  error?: string;
}

export type InboundMessage = EventMessage | ResponseMessage;

export function isEventMessage(message: InboundMessage): message is EventMessage {
  return message.type === 'event';
}

/** Converts a raw snapshot into a `DeviceState`, mapping "omitted" back to `null`. */
export function normalizeSnapshot(raw: RawStateSnapshot | undefined): DeviceState {
  return {
    isConnected: raw?.isConnected ?? false,
    deviceIsReady: raw?.deviceIsReady ?? false,
    power: raw?.power ?? null,
    source: raw?.source ?? null,
    lightOutput: raw?.lightOutput ?? null,
    shutter: raw?.shutter ?? null,
    firmwareVersion: raw?.firmwareVersion ?? '',
    ipAddress: raw?.ipAddress ?? '',
    port: raw?.port ?? null,
  };
}

/** Valid input-source numbers, per `AltairDriver.SetSourceAsync`. */
export const SOURCE_RANGE = { min: 1, max: 4 } as const;

/** Valid light-output percentage, per `AltairDriver.SetLightOutputAsync`. */
export const LIGHT_OUTPUT_RANGE = { min: 0, max: 100 } as const;
