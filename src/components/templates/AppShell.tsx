import Box from '@mui/material/Box';
import type { ReactNode } from 'react';

export interface AppShellProps {
  topBar: ReactNode;
  bottomNav: ReactNode;
  children: ReactNode;
}

/**
 * Template: the single-page frame.
 *
 * A full-viewport flex column — top bar, scrollable content, bottom menu. The
 * content region is the only scroll container (`flex: 1; min-height: 0`), so the
 * bottom menu keeps its own space in the layout and an over-long fragment scrolls
 * beneath it instead of covering it. No fixed positioning, no padding constants.
 */
export function AppShell({ topBar, bottomNav, children }: AppShellProps) {
  return (
    <Box
      sx={{
        height: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: 'background.default',
      }}
    >
      {topBar}
      <Box
        component="main"
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </Box>
      {bottomNav}
    </Box>
  );
}
