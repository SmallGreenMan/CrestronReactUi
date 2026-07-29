import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { presenterClient } from '../../../services/presenter';
import type { DeviceState, LinkStatus, PresenterCommand, SendOptions } from '../../../services/presenter';
import { isPowerTransitioning } from '../model/presentation';

export interface AltairActions {
  powerOn: () => void;
  powerOff: () => void;
  setSource: (source: number) => void;
  setLightOutput: (percent: number) => void;
  /** `closed = true` closes the shutter and blanks the image. */
  setShutterClosed: (closed: boolean) => void;
  /** Re-queries every state from the projector. */
  refresh: () => void;
  /** Asks the driver to (re)connect to the projector. */
  connectDevice: () => void;
  disconnectDevice: () => void;
  dismissError: () => void;
}

export interface AltairDeviceModel {
  device: DeviceState;
  /** Browser <-> presenter WebSocket. */
  link: LinkStatus;
  /** A command is in flight. */
  busy: boolean;
  lastError: string | null;
  lastEventName: string | null;
  lastSync: { source: number; status: number } | null;
  /** Presenter reachable and projector connected — controls can be enabled. */
  isControllable: boolean;
  isPoweredOn: boolean;
  isTransitioning: boolean;
  actions: AltairActions;
}

/**
 * Connects the Altair.Demo fragment to `AltairPresenter`.
 *
 * On mount it acquires the shared WebSocket; the presenter answers with a
 * `StateSnapshot` immediately, and the client additionally issues `queryall` so
 * the very first render reflects the real device rather than defaults. All user
 * interaction is funnelled through `actions`, which send presenter commands.
 */
export function useAltairDevice(): AltairDeviceModel {
  const state = useSyncExternalStore(presenterClient.subscribe, presenterClient.getState);

  useEffect(() => presenterClient.acquire(), []);

  const dispatch = useCallback((command: PresenterCommand, options?: SendOptions) => {
    // Failures surface through `state.lastError`; nothing here should throw
    // into React's event handling.
    void presenterClient.send(command, options).catch(() => undefined);
  }, []);

  const actions = useMemo<AltairActions>(
    () => ({
      powerOn: () => dispatch('poweron'),
      powerOff: () => dispatch('poweroff'),
      setSource: (source) => dispatch('setsource', { intValue: source }),
      setLightOutput: (percent) => dispatch('setlightoutput', { intValue: Math.round(percent) }),
      setShutterClosed: (closed) => dispatch('setshutter', { boolValue: closed }),
      refresh: () => dispatch('queryall'),
      connectDevice: () => dispatch('connect'),
      disconnectDevice: () => dispatch('disconnect'),
      dismissError: () => presenterClient.clearError(),
    }),
    [dispatch],
  );

  return {
    device: state.device,
    link: state.link,
    busy: state.pending > 0,
    lastError: state.lastError,
    lastEventName: state.lastEvent?.name ?? null,
    lastSync: state.lastSync,
    isControllable: state.link === 'open' && state.device.isConnected,
    isPoweredOn: state.device.power === 'On',
    isTransitioning: isPowerTransitioning(state.device.power),
    actions,
  };
}
