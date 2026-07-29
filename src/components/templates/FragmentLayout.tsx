import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import type { ReactNode } from 'react';
import { FragmentHeader } from '../organisms/FragmentHeader';

export interface FragmentLayoutProps {
  title: string;
  subtitle?: string;
  /** Right-aligned slot in the header. */
  headerAction?: ReactNode;
  children: ReactNode;
}

/** Template: the shared content column used by every fragment. */
export function FragmentLayout({ title, subtitle, headerAction, children }: FragmentLayoutProps) {
  return (
    <Box
      sx={(theme) => ({
        maxWidth: theme.layout.contentMaxWidth,
        mx: 'auto',
        px: { xs: theme.layout.pageGutter, sm: 3 },
        py: { xs: 2, sm: 3 },
      })}
    >
      <Stack spacing={{ xs: 2, sm: 2.5 }}>
        <FragmentHeader title={title} subtitle={subtitle} action={headerAction} />
        {children}
      </Stack>
    </Box>
  );
}
