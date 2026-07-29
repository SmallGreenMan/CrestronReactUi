import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ColorModeProvider } from './theme/ColorModeProvider';
import App from './App';

// All global styling comes from the MUI theme (CssBaseline + component overrides),
// so there is no stylesheet to import here.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <App />
    </ColorModeProvider>
  </StrictMode>,
);
