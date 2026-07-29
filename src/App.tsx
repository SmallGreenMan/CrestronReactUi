import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import type { ReactElement } from 'react';
import { AppShell } from './components/templates/AppShell';
import { TopBar } from './components/organisms/TopBar';
import { BottomNavBar } from './components/organisms/BottomNavBar';
import { useColorMode } from './theme/colorModeContext';
import { DEFAULT_PATH, NAV_DESTINATIONS, findDestination } from './navigation/navigation';
import { AltairDemoFragment } from './features/altair-demo/AltairDemoFragment';
import { PresenterLinkBadge } from './features/altair-demo/components/PresenterLinkBadge';
import { VideoCommutationFragment } from './features/video-commutation/VideoCommutationFragment';
import { AudioControlFragment } from './features/audio-control/AudioControlFragment';
import { VcsFragment } from './features/vcs/VcsFragment';

/** Maps each navigation destination to the fragment it renders. */
const FRAGMENTS: Record<string, ReactElement> = {
  '/altair-demo': <AltairDemoFragment />,
  '/video-commutation': <VideoCommutationFragment />,
  '/audio-control': <AudioControlFragment />,
  '/vcs': <VcsFragment />,
};

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, toggleMode } = useColorMode();

  // Derived from the URL, so the highlighted menu item survives a reload.
  const active = findDestination(location.pathname);

  return (
    <AppShell
      topBar={
        <TopBar
          title="Altair Demo"
          subtitle={active.description}
          colorMode={mode}
          onToggleColorMode={toggleMode}
          status={<PresenterLinkBadge />}
        />
      }
      bottomNav={
        <BottomNavBar
          items={NAV_DESTINATIONS.map(({ path, label, icon }) => ({ value: path, label, icon }))}
          value={active.path}
          onChange={(path) => navigate(path)}
        />
      }
    >
      <Routes>
        {NAV_DESTINATIONS.map((destination) => (
          <Route
            key={destination.path}
            path={destination.path}
            element={FRAGMENTS[destination.path]}
          />
        ))}
        <Route path="*" element={<Navigate to={DEFAULT_PATH} replace />} />
      </Routes>
    </AppShell>
  );
}

/**
 * Single-page application root.
 *
 * `HashRouter` keeps this a true single page — a built bundle needs no server
 * rewrite rules and works when served statically.
 */
export default function App() {
  return (
    <HashRouter>
      <AppLayout />
    </HashRouter>
  );
}
