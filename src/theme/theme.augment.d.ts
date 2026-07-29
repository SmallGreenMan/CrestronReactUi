/**
 * Module augmentation for the custom keys this application adds to the MUI theme.
 * Without this, TypeScript rejects `theme.palette.signal.online` and friends.
 */
import type {} from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface SignalPalette {
    /** Device reachable / feature enabled. */
    online: string;
    /** Device unreachable. */
    offline: string;
    /** Transitional state (warming up, cooling down). */
    warning: string;
    /** Destructive or fault state. */
    danger: string;
    /** Known but inactive. */
    idle: string;
    /** Currently selected / routed. */
    active: string;
  }

  interface SurfacePalette {
    /** Background of a control panel card. */
    panel: string;
    /** Background of an inset area inside a panel. */
    sunken: string;
    /** Border colour for panels and controls. */
    border: string;
    /** Background of the bottom navigation bar. */
    navBar: string;
  }

  interface Palette {
    signal: SignalPalette;
    surfaces: SurfacePalette;
  }

  interface PaletteOptions {
    signal?: Partial<SignalPalette>;
    surfaces?: Partial<SurfacePalette>;
  }

  interface Theme {
    layout: {
      bottomNavHeight: number;
      contentMaxWidth: number;
      pageGutter: number;
    };
  }

  interface ThemeOptions {
    layout?: {
      bottomNavHeight?: number;
      contentMaxWidth?: number;
      pageGutter?: number;
    };
  }
}
