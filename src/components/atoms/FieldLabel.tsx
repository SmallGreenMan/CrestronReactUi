import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface FieldLabelProps {
  children: ReactNode;
  htmlFor?: string;
  id?: string;
}

/** Atom: the small uppercase caption that titles a control. */
export function FieldLabel({ children, htmlFor, id }: FieldLabelProps) {
  return (
    <Typography
      variant="overline"
      component={htmlFor ? 'label' : 'span'}
      htmlFor={htmlFor}
      id={id}
      sx={{ color: 'text.secondary', display: 'block' }}
    >
      {children}
    </Typography>
  );
}
