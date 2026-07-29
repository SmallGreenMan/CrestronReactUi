import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface SelectorOption<T extends string | number> {
  value: T;
  label: string;
  icon?: ReactNode;
  caption?: string;
  disabled?: boolean;
}

export interface OptionSelectorProps<T extends string | number> {
  options: SelectorOption<T>[];
  /** `null` = nothing selected / unknown. */
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  ariaLabel: string;
  /** Grid mode wraps options into equal-width columns instead of a single row. */
  columns?: number;
}

/**
 * Molecule: an exclusive choice between options, each with an icon and caption.
 * Re-selecting the active option is ignored, so a tap can never clear the choice.
 */
export function OptionSelector<T extends string | number>({
  options,
  value,
  onChange,
  disabled = false,
  ariaLabel,
  columns,
}: OptionSelectorProps<T>) {
  return (
    <ToggleButtonGroup
      exclusive
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(_event, next) => {
        if (next !== null) onChange(next as T);
      }}
      sx={
        columns
          ? {
              display: 'grid',
              gridTemplateColumns: {
                xs: `repeat(${Math.min(columns, 2)}, 1fr)`,
                sm: `repeat(${columns}, 1fr)`,
              },
            }
          : undefined
      }
    >
      {options.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          aria-label={option.label}
          sx={{ flexDirection: 'column', gap: 0.25, py: 1.25 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {option.icon}
            <span>{option.label}</span>
          </Box>
          {option.caption && (
            <Typography variant="caption" sx={{ opacity: 0.75, fontWeight: 500 }}>
              {option.caption}
            </Typography>
          )}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
