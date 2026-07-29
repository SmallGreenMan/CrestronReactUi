import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { StatusDot } from '../atoms/StatusDot';
import type { SignalTone } from '../atoms/tone';

export interface ConnectionIndicatorProps {
  tone: SignalTone;
  label: string;
  detail?: string;
  /** Pulses the dot — for "connecting"/"reconnecting" style states. */
  pulse?: boolean;
}

/** Molecule: dot + primary/secondary text describing a link's state. */
export function ConnectionIndicator({
  tone,
  label,
  detail,
  pulse = false,
}: ConnectionIndicatorProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
      <StatusDot tone={tone} pulse={pulse} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.3 }} noWrap>
          {label}
        </Typography>
        {detail && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
            {detail}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
