import { createTheme } from '@mui/material/styles';
import type { PaletteMode, Theme } from '@mui/material/styles';
import { darkPalette, lightPalette } from './palette';
import { typography } from './typography';
import { components } from './components';
import { layout, radius } from './tokens';

/** Builds the fully-assembled MUI theme for the requested colour scheme. */
export function createAppTheme(mode: PaletteMode): Theme {
  return createTheme({
    palette: mode === 'dark' ? darkPalette : lightPalette,
    typography,
    components,
    shape: { borderRadius: radius.md },
    spacing: 8,
    layout: {
      bottomNavHeight: layout.bottomNavHeight,
      contentMaxWidth: layout.contentMaxWidth,
      pageGutter: layout.pageGutter,
    },
  });
}
