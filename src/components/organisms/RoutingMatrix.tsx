import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CrosspointCell } from '../molecules/CrosspointCell';

export interface MatrixPort {
  id: number;
  label: string;
}

export interface RoutingMatrixProps {
  inputs: MatrixPort[];
  outputs: MatrixPort[];
  /** Maps an output id to the input id currently routed to it, or `null`. */
  routes: Record<number, number | null>;
  onRoute: (outputId: number, inputId: number) => void;
  disabled?: boolean;
}

/**
 * Organism: an inputs x outputs crosspoint grid.
 * Rows are inputs, columns are outputs; each output carries exactly one input.
 */
export function RoutingMatrix({
  inputs,
  outputs,
  routes,
  onRoute,
  disabled = false,
}: RoutingMatrixProps) {
  const template = `minmax(84px, 1.4fr) repeat(${outputs.length}, minmax(38px, 1fr))`;

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box sx={{ minWidth: 96 + outputs.length * 48, display: 'grid', gap: 0.75 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: template, gap: 0.75, alignItems: 'end' }}>
          <Typography variant="overline" sx={{ color: 'text.secondary' }}>
            In / Out
          </Typography>
          {outputs.map((output) => (
            <Typography
              key={output.id}
              variant="caption"
              sx={{ textAlign: 'center', fontWeight: 600, color: 'text.secondary' }}
            >
              {output.label}
            </Typography>
          ))}
        </Box>

        {inputs.map((input) => (
          <Box
            key={input.id}
            sx={{ display: 'grid', gridTemplateColumns: template, gap: 0.75, alignItems: 'center' }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {input.label}
            </Typography>
            {outputs.map((output) => (
              <CrosspointCell
                key={output.id}
                active={routes[output.id] === input.id}
                disabled={disabled}
                onClick={() => onRoute(output.id, input.id)}
                ariaLabel={`Route ${input.label} to ${output.label}`}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
