import type { ThemeOptions } from '@mui/material/styles';
import { layout, monoStack, radius } from './tokens';

/**
 * Central style overrides for every MUI component the application uses.
 *
 * Feature and component code stays free of visual constants: a Button, Slider or
 * ToggleButton looks the way it does because of this file, not because of local
 * `sx` tweaks.
 */
export const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      'html, body, #root': {
        height: '100%',
        margin: 0,
      },
      body: {
        WebkitFontSmoothing: 'antialiased',
        overscrollBehavior: 'none',
      },
    },
  },

  MuiPaper: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: theme.palette.surfaces.panel,
      }),
      rounded: { borderRadius: radius.lg },
    },
  },

  MuiCard: {
    defaultProps: { elevation: 0 },
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.lg,
        border: `1px solid ${theme.palette.surfaces.border}`,
        backgroundColor: theme.palette.surfaces.panel,
      }),
    },
  },

  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 20,
        '&:last-child': { paddingBottom: 20 },
      },
    },
  },

  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: {
        borderRadius: radius.md,
        paddingInline: 18,
        minHeight: 42,
      },
      sizeLarge: { minHeight: 52, fontSize: '1rem' },
      sizeSmall: { minHeight: 34, paddingInline: 12 },
    },
  },

  MuiIconButton: {
    styleOverrides: {
      root: { borderRadius: radius.md },
    },
  },

  MuiToggleButtonGroup: {
    styleOverrides: {
      root: { gap: 8, flexWrap: 'wrap' },
      grouped: ({ theme }) => ({
        borderRadius: `${radius.md}px !important`,
        border: `1px solid ${theme.palette.surfaces.border} !important`,
      }),
    },
  },

  MuiToggleButton: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: radius.md,
        textTransform: 'none',
        fontWeight: 600,
        minHeight: 44,
        paddingInline: 16,
        color: theme.palette.text.secondary,
        backgroundColor: theme.palette.surfaces.sunken,
        '&.Mui-selected': {
          color: theme.palette.primary.contrastText,
          backgroundColor: theme.palette.primary.main,
          '&:hover': { backgroundColor: theme.palette.primary.dark },
        },
      }),
    },
  },

  MuiSlider: {
    styleOverrides: {
      root: { height: 6 },
      rail: ({ theme }) => ({ opacity: 1, backgroundColor: theme.palette.surfaces.sunken }),
      thumb: ({ theme }) => ({
        width: 22,
        height: 22,
        border: `2px solid ${theme.palette.surfaces.panel}`,
        boxShadow: `0 0 0 1px ${theme.palette.surfaces.border}`,
      }),
      valueLabel: ({ theme }) => ({
        borderRadius: radius.sm,
        fontFamily: monoStack,
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.background.paper,
      }),
      markLabel: ({ theme }) => ({
        fontSize: '0.6875rem',
        color: theme.palette.text.secondary,
      }),
    },
  },

  MuiSwitch: {
    styleOverrides: {
      root: { padding: 8 },
      track: ({ theme }) => ({
        borderRadius: radius.pill,
        opacity: 1,
        backgroundColor: theme.palette.surfaces.sunken,
        border: `1px solid ${theme.palette.surfaces.border}`,
      }),
    },
  },

  MuiChip: {
    styleOverrides: {
      root: { borderRadius: radius.sm, fontWeight: 600 },
      sizeSmall: { height: 22, fontSize: '0.6875rem' },
    },
  },

  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 6,
        borderRadius: radius.pill,
        backgroundColor: theme.palette.surfaces.sunken,
      }),
      bar: { borderRadius: radius.pill },
    },
  },

  MuiBottomNavigation: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: layout.bottomNavHeight,
        backgroundColor: theme.palette.surfaces.navBar,
        borderTop: `1px solid ${theme.palette.surfaces.border}`,
        gap: 4,
        paddingInline: 8,
      }),
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: ({ theme }) => ({
        minWidth: 0,
        gap: 4,
        borderRadius: radius.md,
        color: theme.palette.text.secondary,
        transition: theme.transitions.create(['color', 'background-color']),
        '&.Mui-selected': {
          color: theme.palette.primary.main,
          backgroundColor: theme.palette.action.selected,
        },
      }),
      label: {
        fontSize: '0.75rem',
        fontWeight: 600,
        '&.Mui-selected': { fontSize: '0.75rem' },
      },
    },
  },

  MuiTooltip: {
    defaultProps: { arrow: true },
    styleOverrides: {
      tooltip: { borderRadius: radius.sm, fontSize: '0.75rem' },
    },
  },

  MuiAlert: {
    styleOverrides: {
      root: { borderRadius: radius.md },
    },
  },

  MuiDivider: {
    styleOverrides: {
      root: ({ theme }) => ({ borderColor: theme.palette.surfaces.border }),
    },
  },
};
