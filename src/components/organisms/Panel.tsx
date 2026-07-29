import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { IconBadge } from '../atoms/IconBadge';
import type { SignalTone } from '../atoms/tone';

export interface PanelProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: SignalTone;
  /** Rendered at the right end of the header — status chips, small buttons. */
  action?: ReactNode;
  children: ReactNode;
  /** Removes the padding around the body, for edge-to-edge content. */
  flush?: boolean;
}

/** Organism: the titled card that groups a set of related controls. */
export function Panel({
  title,
  subtitle,
  icon,
  tone = 'active',
  action,
  children,
  flush = false,
}: PanelProps) {
  return (
    <Card component="section">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2 }}>
        {icon && <IconBadge tone={tone}>{icon}</IconBadge>}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Box>
      <Divider />
      {flush ? <Box>{children}</Box> : <CardContent sx={{ px: 2.5 }}>{children}</CardContent>}
    </Card>
  );
}
