import Box from '@mui/material/Box';
import type { SignalTone } from './tone';

export interface StatusDotProps {
  tone: SignalTone;
  /** Diameter in px. */
  size?: number;
  /** Adds a soft pulsing halo — use for transitional states. */
  pulse?: boolean;
}

/** Atom: a coloured state indicator. */
export function StatusDot({ tone, size = 10, pulse = false }: StatusDotProps) {
  return (
    <Box
      component="span"
      aria-hidden
      sx={(theme) => ({
        flex: '0 0 auto',
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: theme.palette.signal[tone],
        boxShadow: pulse ? `0 0 0 0 ${theme.palette.signal[tone]}` : 'none',
        animation: pulse ? 'status-dot-pulse 1.6s ease-out infinite' : 'none',
        '@keyframes status-dot-pulse': {
          '0%': { boxShadow: `0 0 0 0 ${theme.palette.signal[tone]}80` },
          '70%': { boxShadow: `0 0 0 ${size * 0.9}px ${theme.palette.signal[tone]}00` },
          '100%': { boxShadow: `0 0 0 0 ${theme.palette.signal[tone]}00` },
        },
      })}
    />
  );
}
