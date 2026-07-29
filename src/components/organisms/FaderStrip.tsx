import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { LevelBar } from '../atoms/LevelBar';
import { MetricValue } from '../atoms/MetricValue';
import { radius } from '../../theme/tokens';

export interface FaderStripProps {
  label: string;
  /** Fader position, 0–100. */
  level: number;
  muted: boolean;
  /** Live signal level, 0–100, for the meter beside the fader. */
  meter: number;
  onLevelCommit: (level: number) => void;
  onMuteToggle: () => void;
}

/** Organism: one vertical channel — meter, fader and mute. */
export function FaderStrip({
  label,
  level,
  muted,
  meter,
  onLevelCommit,
  onMuteToggle,
}: FaderStripProps) {
  // Follows the pointer while dragging, re-adopting `level` when a new one arrives.
  const [draft, setDraft] = useState(level);
  const [seenLevel, setSeenLevel] = useState(level);

  if (level !== seenLevel) {
    setSeenLevel(level);
    setDraft(level);
  }

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        borderRadius: `${radius.md}px`,
        border: `1px solid ${theme.palette.surfaces.border}`,
        backgroundColor: theme.palette.surfaces.sunken,
      })}
    >
      <Typography variant="subtitle2" noWrap sx={{ maxWidth: 88 }}>
        {label}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 168 }}>
        <LevelBar
          value={muted ? 0 : meter}
          orientation="vertical"
          tone={meter > 88 ? 'danger' : meter > 70 ? 'warning' : 'online'}
          thickness={6}
          length={168}
        />
        <Slider
          orientation="vertical"
          value={draft}
          min={0}
          max={100}
          disabled={muted}
          valueLabelDisplay="auto"
          aria-label={`${label} level`}
          onChange={(_event, next) => setDraft(next as number)}
          onChangeCommitted={(_event, next) => onLevelCommit(next as number)}
          sx={{ height: 168 }}
        />
      </Box>

      <MetricValue value={muted ? 'MUTE' : draft} unit={muted ? undefined : '%'} size="sm" tone={muted ? 'danger' : 'active'} />

      <IconButton
        onClick={onMuteToggle}
        aria-label={muted ? `Unmute ${label}` : `Mute ${label}`}
        aria-pressed={muted}
        color={muted ? 'error' : 'default'}
        size="small"
      >
        {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </IconButton>
    </Box>
  );
}
