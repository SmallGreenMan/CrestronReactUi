import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import { FragmentLayout } from '../../components/templates/FragmentLayout';
import { ConnectionIndicator } from '../../components/molecules/ConnectionIndicator';
import { useAltairDevice } from './hooks/useAltairDevice';
import { DeviceStatusStrip } from './components/DeviceStatusStrip';
import { PowerPanel } from './components/PowerPanel';
import { SourcePanel } from './components/SourcePanel';
import { ImagePanel } from './components/ImagePanel';
import { ConnectionPanel } from './components/ConnectionPanel';
import { describeDeviceLink } from './model/presentation';

/**
 * Fragment: live control of the Altair AP-3000 through `AltairPresenter`.
 *
 * State arrives from the presenter (snapshot on connect, then driver events) and
 * every control sends a presenter command back. This component only wires the
 * hook to the sections — no transport details, no styling constants.
 */
export function AltairDemoFragment() {
  const {
    device,
    link,
    busy,
    lastError,
    lastEventName,
    lastSync,
    isControllable,
    actions,
  } = useAltairDevice();

  const deviceDescriptor = describeDeviceLink(device);
  const controlsDisabled = !isControllable;

  return (
    <FragmentLayout
      title="Altair.Demo"
      subtitle="AP-3000 projector — live state and control via AltairPresenter"
      headerAction={
        <ConnectionIndicator
          tone={deviceDescriptor.tone}
          label={deviceDescriptor.label}
          detail={device.ipAddress ? `${device.ipAddress}:${device.port ?? '—'}` : undefined}
          pulse={link === 'connecting' || link === 'reconnecting'}
        />
      }
    >
      <Collapse in={lastError !== null} unmountOnExit>
        <Alert severity="warning" onClose={actions.dismissError}>
          {lastError}
        </Alert>
      </Collapse>

      <Collapse in={link !== 'open'} unmountOnExit>
        <Alert severity="info">
          Waiting for the presenter. Start the host application (<code>dotnet run</code> in{' '}
          <code>Altair.Demo</code>) — it serves the WebSocket bridge this page controls.
        </Alert>
      </Collapse>

      <DeviceStatusStrip device={device} />

      <Stack spacing={{ xs: 2, sm: 2.5 }}>
        <PowerPanel
          power={device.power}
          disabled={controlsDisabled}
          busy={busy}
          onPowerOn={actions.powerOn}
          onPowerOff={actions.powerOff}
        />
        <SourcePanel
          source={device.source}
          disabled={controlsDisabled}
          onSelect={actions.setSource}
        />
        <ImagePanel
          lightOutput={device.lightOutput}
          shutter={device.shutter}
          disabled={controlsDisabled}
          onLightOutputCommit={actions.setLightOutput}
          onShutterChange={actions.setShutterClosed}
        />
        <ConnectionPanel
          device={device}
          link={link}
          busy={busy}
          lastEventName={lastEventName}
          lastSync={lastSync}
          onConnect={actions.connectDevice}
          onDisconnect={actions.disconnectDevice}
          onRefresh={actions.refresh}
        />
      </Stack>
    </FragmentLayout>
  );
}
