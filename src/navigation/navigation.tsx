import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import HubIcon from '@mui/icons-material/Hub';
import TuneIcon from '@mui/icons-material/Tune';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import type { ReactElement } from 'react';

/**
 * The four destinations of the single-page app. This array is the single source of
 * truth: the bottom menu and the router are both generated from it, so the two can
 * never drift apart.
 */
export interface NavDestination {
  /** Route path, also the bottom-menu value. */
  path: string;
  label: string;
  icon: ReactElement;
  /** Subtitle shown in the top bar while the destination is active. */
  description: string;
}

export const NAV_DESTINATIONS: NavDestination[] = [
  {
    path: '/altair-demo',
    label: 'Altair.Demo',
    icon: <SettingsRemoteIcon />,
    description: 'AP-3000 projector control',
  },
  {
    path: '/video-commutation',
    label: 'Video Commutation',
    icon: <HubIcon />,
    description: 'Matrix routing and presets',
  },
  {
    path: '/audio-control',
    label: 'Audio Control',
    icon: <TuneIcon />,
    description: 'Levels, mutes and zones',
  },
  {
    path: '/vcs',
    label: 'VCS',
    icon: <VideoCallIcon />,
    description: 'Video conferencing system',
  },
];

export const DEFAULT_PATH = NAV_DESTINATIONS[0].path;

/** Resolves a location pathname to a destination, falling back to the first one. */
export function findDestination(pathname: string): NavDestination {
  return NAV_DESTINATIONS.find((item) => pathname.startsWith(item.path)) ?? NAV_DESTINATIONS[0];
}
