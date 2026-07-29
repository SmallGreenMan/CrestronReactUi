import { ConnectionIndicator } from '../../../components/molecules/ConnectionIndicator';
import { useAltairDevice } from '../hooks/useAltairDevice';
import { describeLink } from '../model/presentation';

/**
 * Global presenter-link indicator for the top bar.
 *
 * Mounting it app-wide also holds the shared WebSocket open while the user is on
 * another fragment, so returning to Altair.Demo shows current state immediately
 * instead of re-handshaking.
 */
export function PresenterLinkBadge() {
  const { link } = useAltairDevice();
  const descriptor = describeLink(link);

  return (
    <ConnectionIndicator tone={descriptor.tone} label={descriptor.label} pulse={descriptor.pulse} />
  );
}
