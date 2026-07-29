import { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import type { ReactNode } from 'react';
import { FieldLabel } from '../atoms/FieldLabel';
import { MetricValue } from '../atoms/MetricValue';
import { IconBadge } from '../atoms/IconBadge';
import type { SignalTone } from '../atoms/tone';

export interface SliderRowProps {
  label: string;
  icon?: ReactNode;
  /** `null` = unknown; the slider sits at `min` and the readout shows a dash. */
  value: number | null;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  marks?: { value: number; label?: string }[];
  disabled?: boolean;
  tone?: SignalTone;
  /**
   * Called once, when the user lets go of the thumb. Reporting every `onChange`
   * would flood the device with one command per pointer move.
   */
  onCommit: (value: number) => void;
}

/** Molecule: a labelled slider that reports only committed values. */
export function SliderRow({
  label,
  icon,
  value,
  min,
  max,
  step = 1,
  unit,
  marks,
  disabled = false,
  tone = 'active',
  onCommit,
}: SliderRowProps) {
  // The thumb follows the user while dragging, and re-adopts the authoritative
  // value whenever a new one arrives. Adjusting state during render (rather than
  // in an effect) is React's recommended pattern for deriving from props.
  const [draft, setDraft] = useState<number | null>(value);
  const [seenValue, setSeenValue] = useState<number | null>(value);

  if (value !== seenValue) {
    setSeenValue(value);
    setDraft(value);
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      {icon && <IconBadge tone={tone}>{icon}</IconBadge>}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 2 }}
        >
          <FieldLabel>{label}</FieldLabel>
          <MetricValue value={draft} unit={unit} tone={tone} size="sm" />
        </Box>
        <Slider
          value={draft ?? min}
          min={min}
          max={max}
          step={step}
          marks={marks}
          disabled={disabled}
          valueLabelDisplay="auto"
          aria-label={label}
          onChange={(_event, next) => setDraft(next as number)}
          onChangeCommitted={(_event, next) => onCommit(next as number)}
          sx={{ my: 0.5 }}
        />
      </Box>
    </Box>
  );
}
