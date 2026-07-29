import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface FragmentHeaderProps {
  title: string;
  subtitle?: string;
  /** Right-aligned slot for status indicators or page-level actions. */
  action?: ReactNode;
}

/** Organism: the heading block at the top of every fragment. */
export function FragmentHeader({ title, subtitle, action }: FragmentHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h2" component="h1">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
