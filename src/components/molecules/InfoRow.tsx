import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { monoStack } from '../../theme/tokens';

export interface InfoRowProps {
  label: string;
  /** Nullish renders the "unknown" placeholder. */
  value?: ReactNode;
  /** Renders the value in a monospaced face — for addresses, versions, ids. */
  mono?: boolean;
}

/** Molecule: one label/value line of a detail list. */
export function InfoRow({ label, value, mono = false }: InfoRowProps) {
  const isUnknown = value === null || value === undefined || value === '';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.75,
      }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          fontFamily: mono ? monoStack : undefined,
          fontWeight: 600,
          color: isUnknown ? 'text.disabled' : 'text.primary',
          textAlign: 'right',
          minWidth: 0,
        }}
      >
        {isUnknown ? '—' : value}
      </Typography>
    </Box>
  );
}
