import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { IconBadge } from '../atoms/IconBadge';
import { ToneChip } from '../atoms/ToneChip';
import type { SignalTone } from '../atoms/tone';

export interface ToggleRowProps {
  /** Describes what the switch does when it is ON. */
  label: string;
  description?: string;
  icon?: ReactNode;
  /** `null` = unknown; the switch renders off but the state text says so. */
  checked: boolean | null;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  /** Explicit text for each state, so ambiguous booleans stay readable. */
  stateText?: { on: string; off: string; unknown?: string };
  tone?: { on: SignalTone; off: SignalTone };
}

/** Molecule: a labelled switch with an explicit textual state readout. */
export function ToggleRow({
  label,
  description,
  icon,
  checked,
  onChange,
  disabled = false,
  stateText = { on: 'On', off: 'Off', unknown: 'Unknown' },
  tone = { on: 'online', off: 'idle' },
}: ToggleRowProps) {
  const isUnknown = checked === null;
  const currentTone: SignalTone = isUnknown ? 'offline' : checked ? tone.on : tone.off;
  const currentText = isUnknown ? (stateText.unknown ?? 'Unknown') : checked ? stateText.on : stateText.off;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {icon && <IconBadge tone={currentTone}>{icon}</IconBadge>}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1">{label}</Typography>
        {description && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {description}
          </Typography>
        )}
      </Box>
      <ToneChip label={currentText} tone={currentTone} />
      <Switch
        checked={checked === true}
        onChange={(event) => onChange(event.target.checked)}
        disabled={disabled}
        slotProps={{ input: { 'aria-label': label } }}
      />
    </Box>
  );
}
