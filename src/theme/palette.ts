import type { PaletteOptions } from '@mui/material/styles';
import { brand, neutral, signal } from './tokens';

/**
 * Both colour schemes are declared here. The application never hard-codes a
 * colour: components reference `palette.*` keys, so switching scheme (or
 * re-branding) is a change to this file alone.
 */

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: brand.cyan500,
    light: brand.cyan400,
    dark: brand.cyan700,
    contrastText: neutral[0],
  },
  secondary: {
    main: brand.amber700,
    light: brand.amber500,
    dark: '#95600a',
    contrastText: neutral[0],
  },
  success: { main: signal.onlineDim },
  warning: { main: brand.amber700 },
  error: { main: signal.danger },
  info: { main: brand.cyan500 },
  background: {
    default: neutral[25],
    paper: neutral[0],
  },
  text: {
    primary: neutral[900],
    secondary: neutral[600],
    disabled: neutral[400],
  },
  divider: neutral[100],
  signal: {
    online: signal.onlineDim,
    offline: neutral[400],
    warning: brand.amber700,
    danger: signal.danger,
    idle: neutral[200],
    active: brand.cyan500,
  },
  surfaces: {
    panel: neutral[0],
    sunken: neutral[50],
    border: neutral[100],
    navBar: neutral[0],
  },
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: brand.cyan400,
    light: brand.cyan200,
    dark: brand.cyan700,
    contrastText: neutral[950],
  },
  secondary: {
    main: brand.amber500,
    light: brand.amber300,
    dark: brand.amber700,
    contrastText: neutral[950],
  },
  success: { main: signal.online },
  warning: { main: brand.amber500 },
  error: { main: signal.danger },
  info: { main: brand.cyan400 },
  background: {
    default: neutral[950],
    paper: neutral[900],
  },
  text: {
    primary: neutral[50],
    secondary: neutral[400],
    disabled: neutral[600],
  },
  divider: neutral[800],
  signal: {
    online: signal.online,
    offline: signal.offline,
    warning: signal.warning,
    danger: signal.danger,
    idle: signal.idle,
    active: brand.cyan400,
  },
  surfaces: {
    panel: neutral[900],
    sunken: neutral[800],
    border: neutral[800],
    navBar: neutral[900],
  },
};
