import type { ThemeOptions } from '@mui/material/styles';
import { fontStack } from './tokens';

export const typography: ThemeOptions['typography'] = {
  fontFamily: fontStack,
  h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.01em' },
  h3: { fontSize: '1.25rem', fontWeight: 600 },
  h4: { fontSize: '1.125rem', fontWeight: 600 },
  h5: { fontSize: '1rem', fontWeight: 600 },
  h6: { fontSize: '0.9375rem', fontWeight: 600 },
  subtitle1: { fontSize: '0.9375rem', fontWeight: 500 },
  subtitle2: { fontSize: '0.8125rem', fontWeight: 600, letterSpacing: '0.02em' },
  body1: { fontSize: '0.9375rem' },
  body2: { fontSize: '0.8125rem' },
  button: { fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
  caption: { fontSize: '0.75rem', letterSpacing: '0.02em' },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    lineHeight: 1.6,
  },
};
