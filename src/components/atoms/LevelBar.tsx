import Box from '@mui/material/Box';
import { radius } from '../../theme/tokens';
import type { SignalTone } from './tone';

export interface LevelBarProps {
  /** Fill ratio, 0–100. Values outside the range are clamped. */
  value: number;
  tone?: SignalTone;
  orientation?: 'horizontal' | 'vertical';
  /** Thickness in px (height when horizontal, width when vertical). */
  thickness?: number;
  /** Length in px; defaults to filling the parent when horizontal. */
  length?: number;
}

/** Atom: a non-interactive fill indicator for levels and meters. */
export function LevelBar({
  value,
  tone = 'active',
  orientation = 'horizontal',
  thickness = 8,
  length,
}: LevelBarProps) {
  const ratio = Math.min(100, Math.max(0, value));
  const isVertical = orientation === 'vertical';

  return (
    <Box
      role="presentation"
      sx={(theme) => ({
        position: 'relative',
        overflow: 'hidden',
        borderRadius: `${radius.pill}px`,
        backgroundColor: theme.palette.surfaces.sunken,
        width: isVertical ? thickness : (length ?? '100%'),
        height: isVertical ? (length ?? 120) : thickness,
      })}
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          left: 0,
          bottom: 0,
          borderRadius: `${radius.pill}px`,
          backgroundColor: theme.palette.signal[tone],
          transition: theme.transitions.create(['width', 'height'], { duration: 120 }),
          width: isVertical ? '100%' : `${ratio}%`,
          height: isVertical ? `${ratio}%` : '100%',
        })}
      />
    </Box>
  );
}
