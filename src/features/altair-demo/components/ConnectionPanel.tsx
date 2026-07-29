import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LanIcon from '@mui/icons-material/LanOutlined';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Panel } from '../../../components/organisms/Panel';
import { ActionButton } from '../../../components/molecules/ActionButton';
import { ConnectionIndicator } from '../../../components/molecules/ConnectionIndicator';
import { InfoRow } from '../../../components/molecules/InfoRow';
import type { DeviceState, LinkStatus } from '../../../services/presenter';
import { PRESENTER_URL } from '../../../services/presenter';
import { describeDeviceLink, describeLink } from '../model/presentation';

export interface ConnectionPanelProps {
  device: DeviceState;
  link: LinkStatus;
  busy: boolean;
  lastEventName: string | null;
  lastSync: { source: number; status: number } | null;
  onConnect: () => void;
  onDisconnect: () => void;
  onRefresh: () => void;
}

/**
 * Feature section: both links in the chain — browser to presenter (WebSocket) and
 * presenter to projector (TCP, owned by `AltairDriver`) — plus device identity.
 */
export function ConnectionPanel({
  device,
  link,
  busy,
  lastEventName,
  lastSync,
  onConnect,
  onDisconnect,
  onRefresh,
}: ConnectionPanelProps) {
  const linkDescriptor = describeLink(link);
  const deviceDescriptor = describeDeviceLink(device);
  const presenterOnline = link === 'open';

  return (
    <Panel
      title="Connection"
      subtitle="AltairPresenter WebSocket bridge"
      icon={<LanIcon />}
      tone={linkDescriptor.tone}
      action={
        <ConnectionIndicator
          tone={linkDescriptor.tone}
          label={linkDescriptor.label}
          pulse={linkDescriptor.pulse}
        />
      }
    >
      <Stack spacing={1}>
        <InfoRow label="Presenter endpoint" value={PRESENTER_URL} mono />
        <InfoRow
          label="Projector"
          value={`${device.ipAddress || '—'}${device.port !== null ? `:${device.port}` : ''}`}
          mono
        />
        <InfoRow label="Projector link" value={deviceDescriptor.label} />
        <InfoRow label="Firmware" value={device.firmwareVersion} mono />
        <InfoRow label="Last driver event" value={lastEventName} mono />
        {lastSync && (
          <InfoRow
            label="Last sync event"
            value={`source ${lastSync.source} / status ${lastSync.status}`}
            mono
          />
        )}

        <Divider sx={{ my: 1 }} />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <ActionButton
            label="Connect projector"
            icon={<LinkIcon />}
            onClick={onConnect}
            disabled={!presenterOnline || device.isConnected}
            variant="outlined"
            fullWidth
          />
          <ActionButton
            label="Disconnect"
            icon={<LinkOffIcon />}
            onClick={onDisconnect}
            disabled={!presenterOnline || !device.isConnected}
            variant="outlined"
            color="inherit"
            fullWidth
          />
          <ActionButton
            label="Refresh state"
            icon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={!presenterOnline}
            busy={busy}
            variant="outlined"
            fullWidth
          />
        </Stack>
      </Stack>
    </Panel>
  );
}
