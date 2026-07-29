import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { IconBadge } from '../atoms/IconBadge';
import { MetricValue } from '../atoms/MetricValue';
import { FieldLabel } from '../atoms/FieldLabel';
import type { SignalTone } from '../atoms/tone';

export interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number | null | undefined;
  unit?: string;
  tone?: SignalTone;
  /** Secondary line under the value. */
  caption?: string;
}

/** Molecule: icon + label + readout, the standard at-a-glance status tile. */
export function StatCard({ icon, label, value, unit, tone = 'active', caption }: StatCardProps) {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}>
      <IconBadge tone={tone}>{icon}</IconBadge>
      <Box sx={{ minWidth: 0 }}>
        <FieldLabel>{label}</FieldLabel>
        <MetricValue value={value} unit={unit} tone={tone} size="md" />
        {caption && (
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
            {caption}
          </Typography>
        )}
      </Box>
    </Card>
  );
}
