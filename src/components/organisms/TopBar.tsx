import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import type { ReactNode } from 'react';

export interface TopBarProps {
  title: string;
  subtitle?: string;
  colorMode: 'light' | 'dark';
  onToggleColorMode: () => void;
  /** Slot for a global status indicator. */
  status?: ReactNode;
}

/** Organism: slim application bar with branding, global status and theme switch. */
export function TopBar({ title, subtitle, colorMode, onToggleColorMode, status }: TopBarProps) {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={(theme) => ({
        flex: '0 0 auto',
        backgroundColor: theme.palette.surfaces.navBar,
        borderBottom: `1px solid ${theme.palette.surfaces.border}`,
      })}
    >
      <Toolbar variant="dense" sx={{ gap: 1.5, minHeight: 56 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" component="p" noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
              {subtitle}
            </Typography>
          )}
        </Box>
        {status}
        <Tooltip title={colorMode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          <IconButton onClick={onToggleColorMode} aria-label="Toggle colour theme">
            {colorMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
