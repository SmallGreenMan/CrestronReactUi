import { useCallback, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { PaletteMode } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';
import { ColorModeContext } from './colorModeContext';

const STORAGE_KEY = 'altair-demo.color-mode';

function readInitialMode(): PaletteMode {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/**
 * Owns the active colour scheme and hands the assembled theme to MUI.
 * This is the only place in the application where a theme is created, which is
 * what makes every colour, radius and component style centrally defined.
 */
export function ColorModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>(readInitialMode);

  const toggleMode = useCallback(() => {
    setMode((current) => {
      const next: PaletteMode = current === 'dark' ? 'light' : 'dark';
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
