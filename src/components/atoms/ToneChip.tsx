import Chip from '@mui/material/Chip';
import type { SignalTone } from './tone';

export interface ToneChipProps {
  label: string;
  tone: SignalTone;
  size?: 'small' | 'medium';
  /** Filled reads as "currently true"; outlined reads as "informational". */
  variant?: 'filled' | 'outlined';
}

/** Atom: a compact state tag coloured by meaning. */
export function ToneChip({ label, tone, size = 'small', variant = 'filled' }: ToneChipProps) {
  return (
    <Chip
      label={label}
      size={size}
      sx={(theme) => ({
        color: variant === 'filled' ? theme.palette.signal[tone] : theme.palette.text.secondary,
        backgroundColor: variant === 'filled' ? `${theme.palette.signal[tone]}22` : 'transparent',
        border: `1px solid ${
          variant === 'filled' ? 'transparent' : theme.palette.surfaces.border
        }`,
      })}
    />
  );
}
