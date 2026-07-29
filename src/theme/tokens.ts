/**
 * Design tokens — the single source of truth for every raw value used by the theme.
 *
 * Nothing outside `src/theme` should import this file. Components read colours,
 * radii and sizes from the MUI theme (`sx`, `styled`, `useTheme`) so that a change
 * here propagates through the whole application.
 */

export const brand = {
  cyan50: '#e0f7fa',
  cyan200: '#7fdfe8',
  cyan400: '#26c6da',
  cyan500: '#12a4b8',
  cyan700: '#0b7c8c',
  amber300: '#ffcf6b',
  amber500: '#f5a623',
  amber700: '#c07c10',
} as const;

export const neutral = {
  0: '#ffffff',
  25: '#f7f9fb',
  50: '#eef2f6',
  100: '#dde4ec',
  200: '#c2ccd8',
  400: '#7c8a9c',
  600: '#4a5666',
  700: '#2f3947',
  800: '#1e2632',
  900: '#141a23',
  950: '#0c1017',
} as const;

export const signal = {
  online: '#2ecc71',
  onlineDim: '#1f8a4c',
  offline: '#8b97a6',
  warning: '#f5a623',
  danger: '#e74c3c',
  idle: '#5c6b7c',
  active: brand.cyan400,
} as const;

/** Radii, in px. */
export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
} as const;

/** Layout constants shared by the shell and the templates. */
export const layout = {
  /** Height of the fixed bottom navigation bar. */
  bottomNavHeight: 72,
  /** Max width of a fragment's content column. */
  contentMaxWidth: 1100,
  /** Horizontal page gutter, in theme spacing units. */
  pageGutter: 2,
} as const;

export const fontStack = [
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(', ');

export const monoStack = [
  '"SFMono-Regular"',
  'ui-monospace',
  'Menlo',
  'Consolas',
  '"Liberation Mono"',
  'monospace',
].join(', ');
