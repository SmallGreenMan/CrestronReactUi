import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { monoStack } from '../../theme/tokens';
import type { SignalTone } from './tone';

export interface MetricValueProps {
  /** `null` / `undefined` renders the "unknown" placeholder. */
  value: string | number | null | undefined;
  unit?: string;
  tone?: SignalTone;
  size?: 'sm' | 'md' | 'lg';
  /** Shown when `value` is nullish. */
  placeholder?: string;
}

const SIZES = {
  sm: { value: '1rem', unit: '0.75rem' },
  md: { value: '1.5rem', unit: '0.8125rem' },
  lg: { value: '2.25rem', unit: '1rem' },
} as const;

/** Atom: a monospaced readout, tolerant of unknown values. */
export function MetricValue({
  value,
  unit,
  tone,
  size = 'md',
  placeholder = '—',
}: MetricValueProps) {
  const isUnknown = value === null || value === undefined || value === '';
  const scale = SIZES[size];

  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, minWidth: 0 }}>
      <Typography
        component="span"
        sx={(theme) => ({
          fontFamily: monoStack,
          fontSize: scale.value,
          fontWeight: 600,
          lineHeight: 1.2,
          color: isUnknown
            ? theme.palette.text.disabled
            : tone
              ? theme.palette.signal[tone]
              : theme.palette.text.primary,
        })}
      >
        {isUnknown ? placeholder : value}
      </Typography>
      {unit && !isUnknown && (
        <Typography
          component="span"
          sx={{ fontSize: scale.unit, color: 'text.secondary', fontWeight: 500 }}
        >
          {unit}
        </Typography>
      )}
    </Box>
  );
}
