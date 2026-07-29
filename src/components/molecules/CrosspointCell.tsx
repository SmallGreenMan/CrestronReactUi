import ButtonBase from '@mui/material/ButtonBase';
import CheckIcon from '@mui/icons-material/Check';
import { radius } from '../../theme/tokens';

export interface CrosspointCellProps {
  active: boolean;
  onClick: () => void;
  /** Announced by screen readers, e.g. "Route input 2 to output 3". */
  ariaLabel: string;
  disabled?: boolean;
}

/** Molecule: one selectable cell of a routing matrix. */
export function CrosspointCell({ active, onClick, ariaLabel, disabled = false }: CrosspointCellProps) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active}
      sx={(theme) => ({
        width: '100%',
        aspectRatio: '1 / 1',
        minHeight: 34,
        borderRadius: `${radius.sm}px`,
        border: `1px solid ${theme.palette.surfaces.border}`,
        backgroundColor: active ? theme.palette.signal.active : theme.palette.surfaces.sunken,
        color: theme.palette.primary.contrastText,
        transition: theme.transitions.create(['background-color', 'transform'], { duration: 120 }),
        '&:hover': {
          backgroundColor: active ? theme.palette.signal.active : theme.palette.action.hover,
        },
        '&.Mui-disabled': { opacity: 0.4 },
        '& .MuiSvgIcon-root': { fontSize: 18 },
      })}
    >
      {active && <CheckIcon />}
    </ButtonBase>
  );
}
