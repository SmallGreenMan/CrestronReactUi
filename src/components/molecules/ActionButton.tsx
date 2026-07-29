import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { ButtonProps } from '@mui/material/Button';
import type { ReactNode } from 'react';

export interface ActionButtonProps {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  /** Replaces the icon with a spinner and blocks interaction. */
  busy?: boolean;
  color?: ButtonProps['color'];
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  fullWidth?: boolean;
}

/** Molecule: a command button that can show in-flight state. */
export function ActionButton({
  label,
  icon,
  onClick,
  disabled = false,
  busy = false,
  color = 'primary',
  variant = 'contained',
  size = 'medium',
  fullWidth = false,
}: ActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || busy}
      color={color}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      startIcon={busy ? <CircularProgress size={16} color="inherit" /> : icon}
    >
      {label}
    </Button>
  );
}
