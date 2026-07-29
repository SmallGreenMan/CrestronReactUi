import type { SignalTone } from '../../../components/atoms/tone';
import type { DeviceState, LinkStatus, PowerStateName } from '../../../services/presenter';

/**
 * Maps raw driver state onto labels and tones. Kept out of the components so the
 * presentational layer stays free of Altair-specific vocabulary.
 */

export interface Descriptor {
  label: string;
  tone: SignalTone;
  /** Pulse the indicator — the state is transitional. */
  pulse?: boolean;
}

const POWER_DESCRIPTORS: Record<PowerStateName, Descriptor> = {
  On: { label: 'On', tone: 'online' },
  Off: { label: 'Off / standby', tone: 'idle' },
  SwitchingOn: { label: 'Warming up', tone: 'warning', pulse: true },
  SwitchingOff: { label: 'Cooling down', tone: 'warning', pulse: true },
};

export function describePower(power: PowerStateName | null): Descriptor {
  return power === null ? { label: 'Unknown', tone: 'offline' } : POWER_DESCRIPTORS[power];
}

export function isPowerTransitioning(power: PowerStateName | null): boolean {
  return power === 'SwitchingOn' || power === 'SwitchingOff';
}

/**
 * `shutter === true` means the shutter is CLOSED — the driver signature is
 * `SetShutterAsync(bool closed)` and it emits `SHT:1` for the closed state.
 * Everything user-facing spells this out rather than showing a bare boolean.
 */
export function describeShutter(shutter: boolean | null): Descriptor {
  if (shutter === null) return { label: 'Unknown', tone: 'offline' };
  return shutter
    ? { label: 'Closed — no image', tone: 'warning' }
    : { label: 'Open — image visible', tone: 'online' };
}

export function describeDeviceLink(device: DeviceState): Descriptor {
  if (!device.isConnected) return { label: 'Projector offline', tone: 'danger' };
  if (!device.deviceIsReady) return { label: 'Connected — standby', tone: 'warning' };
  return { label: 'Connected — ready', tone: 'online' };
}

const LINK_DESCRIPTORS: Record<LinkStatus, Descriptor> = {
  idle: { label: 'Presenter idle', tone: 'offline' },
  connecting: { label: 'Connecting to presenter', tone: 'warning', pulse: true },
  open: { label: 'Presenter connected', tone: 'online' },
  reconnecting: { label: 'Reconnecting to presenter', tone: 'warning', pulse: true },
  closed: { label: 'Presenter unavailable', tone: 'danger' },
};

export function describeLink(link: LinkStatus): Descriptor {
  return LINK_DESCRIPTORS[link];
}

/** Human-readable name for an input source number, per the AP-3000 input plate. */
const SOURCE_NAMES: Record<number, string> = {
  1: 'HDMI 1',
  2: 'HDMI 2',
  3: 'DisplayPort',
  4: 'HDBaseT',
};

export function describeSource(source: number | null): string | null {
  if (source === null) return null;
  return SOURCE_NAMES[source] ?? `Input ${source}`;
}
