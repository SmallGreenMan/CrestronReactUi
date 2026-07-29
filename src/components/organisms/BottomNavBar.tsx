import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import type { ReactElement } from 'react';

export interface BottomNavItem {
  /** Stable identifier for the destination. */
  value: string;
  label: string;
  icon: ReactElement;
}

export interface BottomNavBarProps {
  items: BottomNavItem[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Organism: the persistent bottom menu.
 *
 * Purely presentational — it takes items and a selected value and reports
 * changes. Nothing here knows about routing. It is rendered as the last,
 * non-shrinking child of the app shell's flex column, which is what guarantees
 * a fragment can never cover it.
 */
export function BottomNavBar({ items, value, onChange }: BottomNavBarProps) {
  return (
    <Paper
      component="nav"
      square
      elevation={0}
      aria-label="Main sections"
      sx={{ flex: '0 0 auto', zIndex: 2 }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, next: string) => onChange(next)}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
