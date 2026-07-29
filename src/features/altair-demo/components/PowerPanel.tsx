import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PowerOffIcon from '@mui/icons-material/PowerOff';
import { Panel } from '../../../components/organisms/Panel';
import { ActionButton } from '../../../components/molecules/ActionButton';
import { ConnectionIndicator } from '../../../components/molecules/ConnectionIndicator';
import type { PowerStateName } from '../../../services/presenter';
import { describePower, isPowerTransitioning } from '../model/presentation';

export interface PowerPanelProps {
  power: PowerStateName | null;
  disabled: boolean;
  busy: boolean;
  onPowerOn: () => void;
  onPowerOff: () => void;
}

/** Feature section: lamp power, mapped to the `poweron` / `poweroff` commands. */
export function PowerPanel({ power, disabled, busy, onPowerOn, onPowerOff }: PowerPanelProps) {
  const descriptor = describePower(power);
  const transitioning = isPowerTransitioning(power);

  return (
    <Panel
      title="Power"
      subtitle="AltairDriver.PowerOnAsync / PowerOffAsync"
      icon={<PowerSettingsNewIcon />}
      tone={descriptor.tone}
      action={
        <ConnectionIndicator
          tone={descriptor.tone}
          label={descriptor.label}
          pulse={descriptor.pulse}
        />
      }
    >
      <Stack spacing={2}>
        {transitioning && (
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              The projector is changing state — commands are held until it settles.
            </Typography>
            <LinearProgress color="warning" sx={{ mt: 0.75 }} />
          </Box>
        )}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <ActionButton
            label="Power on"
            icon={<PowerSettingsNewIcon />}
            onClick={onPowerOn}
            disabled={disabled || power === 'On' || transitioning}
            busy={busy && power !== 'On'}
            size="large"
            fullWidth
          />
          <ActionButton
            label="Power off"
            icon={<PowerOffIcon />}
            onClick={onPowerOff}
            disabled={disabled || power === 'Off' || transitioning}
            color="inherit"
            variant="outlined"
            size="large"
            fullWidth
          />
        </Stack>
      </Stack>
    </Panel>
  );
}
