import Box from '@mui/material/Box';
import type { ReactNode } from 'react';
import { radius } from '../../theme/tokens';
import type { SignalTone } from './tone';

export interface IconBadgeProps {
  children: ReactNode;
  tone?: SignalTone;
  size?: number;
}

/** Atom: an icon on a tinted rounded tile. */
export function IconBadge({ children, tone = 'active', size = 38 }: IconBadgeProps) {
  return (
    <Box
      sx={(theme) => ({
        flex: '0 0 auto',
        display: 'grid',
        placeItems: 'center',
        width: size,
        height: size,
        borderRadius: `${radius.md}px`,
        color: theme.palette.signal[tone],
        backgroundColor: `${theme.palette.signal[tone]}1f`,
        '& .MuiSvgIcon-root': { fontSize: size * 0.55 },
      })}
    >
      {children}
    </Box>
  );
}
