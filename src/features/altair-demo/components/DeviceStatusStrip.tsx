import Box from '@mui/material/Box';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import InputIcon from '@mui/icons-material/Input';
import LightModeIcon from '@mui/icons-material/LightMode';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { StatCard } from '../../../components/molecules/StatCard';
import type { DeviceState } from '../../../services/presenter';
import { describePower, describeShutter, describeSource } from '../model/presentation';

export interface DeviceStatusStripProps {
  device: DeviceState;
}

/** Feature section: the four live readouts pulled from the presenter's snapshot. */
export function DeviceStatusStrip({ device }: DeviceStatusStripProps) {
  const power = describePower(device.power);
  const shutter = describeShutter(device.shutter);
  const sourceName = describeSource(device.source);

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 1.5,
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
      }}
    >
      <StatCard
        icon={<PowerSettingsNewIcon />}
        label="Power"
        value={power.label}
        tone={power.tone}
      />
      <StatCard
        icon={<InputIcon />}
        label="Source"
        value={device.source}
        tone={device.source === null ? 'offline' : 'active'}
        caption={sourceName ?? 'not reported'}
      />
      <StatCard
        icon={<LightModeIcon />}
        label="Light output"
        value={device.lightOutput}
        unit="%"
        tone={device.lightOutput === null ? 'offline' : 'active'}
      />
      <StatCard
        icon={<VisibilityOffIcon />}
        label="Shutter"
        value={device.shutter === null ? null : device.shutter ? 'Closed' : 'Open'}
        tone={shutter.tone}
      />
    </Box>
  );
}
