import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HubIcon from '@mui/icons-material/Hub';
import GridOnIcon from '@mui/icons-material/GridOn';
import BoltIcon from '@mui/icons-material/BoltOutlined';
import CastIcon from '@mui/icons-material/Cast';
import { FragmentLayout } from '../../components/templates/FragmentLayout';
import { Panel } from '../../components/organisms/Panel';
import { RoutingMatrix } from '../../components/organisms/RoutingMatrix';
import type { MatrixPort } from '../../components/organisms/RoutingMatrix';
import { InfoRow } from '../../components/molecules/InfoRow';
import { ActionButton } from '../../components/molecules/ActionButton';
import { StatCard } from '../../components/molecules/StatCard';
import { ToneChip } from '../../components/atoms/ToneChip';

const INPUTS: MatrixPort[] = [
  { id: 1, label: 'Lectern PC' },
  { id: 2, label: 'Laptop HDMI' },
  { id: 3, label: 'Room camera' },
  { id: 4, label: 'Wireless cast' },
];

const OUTPUTS: MatrixPort[] = [
  { id: 1, label: 'Main' },
  { id: 2, label: 'Stage L' },
  { id: 3, label: 'Stage R' },
  { id: 4, label: 'Confidence' },
];

type RouteMap = Record<number, number | null>;

const PRESETS: { name: string; routes: RouteMap }[] = [
  { name: 'Presentation', routes: { 1: 1, 2: 1, 3: 1, 4: 3 } },
  { name: 'Dual screen', routes: { 1: 1, 2: 2, 3: 2, 4: 1 } },
  { name: 'Camera feed', routes: { 1: 3, 2: 3, 3: 3, 4: 3 } },
];

const INITIAL_ROUTES: RouteMap = { 1: 1, 2: 1, 3: 2, 4: 3 };

/**
 * Fragment: video matrix routing.
 *
 * The presenter exposes no matrix commands, so this fragment drives local state.
 * Swapping `useState` for a presenter-backed hook — as Altair.Demo does — is the
 * only change needed to make it live.
 */
export function VideoCommutationFragment() {
  const [routes, setRoutes] = useState<RouteMap>(INITIAL_ROUTES);
  const [activePreset, setActivePreset] = useState<string | null>('Presentation');

  const handleRoute = useCallback((outputId: number, inputId: number) => {
    setRoutes((current) => ({ ...current, [outputId]: inputId }));
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((name: string, presetRoutes: RouteMap) => {
    setRoutes(presetRoutes);
    setActivePreset(name);
  }, []);

  const activeInputCount = useMemo(
    () => new Set(Object.values(routes).filter((id): id is number => id !== null)).size,
    [routes],
  );

  const labelFor = (ports: MatrixPort[], id: number | null) =>
    ports.find((port) => port.id === id)?.label ?? null;

  return (
    <FragmentLayout
      title="Video Commutation"
      subtitle="Crosspoint routing between room sources and displays"
      headerAction={<ToneChip label="Local demo state" tone="idle" variant="outlined" />}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        <StatCard icon={<CastIcon />} label="Sources in use" value={activeInputCount} unit={`/ ${INPUTS.length}`} />
        <StatCard icon={<GridOnIcon />} label="Displays fed" value={OUTPUTS.length} />
        <StatCard
          icon={<BoltIcon />}
          label="Preset"
          value={activePreset ?? 'Custom'}
          tone={activePreset ? 'online' : 'warning'}
        />
      </Box>

      <Panel
        title="Crosspoint matrix"
        subtitle="Tap a cell to route a source to a display"
        icon={<HubIcon />}
      >
        <RoutingMatrix inputs={INPUTS} outputs={OUTPUTS} routes={routes} onRoute={handleRoute} />
      </Panel>

      <Panel title="Presets" subtitle="Recall a stored routing layout" icon={<BoltIcon />}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          {PRESETS.map((preset) => (
            <ActionButton
              key={preset.name}
              label={preset.name}
              icon={<BoltIcon />}
              onClick={() => applyPreset(preset.name, preset.routes)}
              variant={activePreset === preset.name ? 'contained' : 'outlined'}
              fullWidth
            />
          ))}
        </Stack>
      </Panel>

      <Panel title="Current assignment" subtitle="One source per display" icon={<GridOnIcon />}>
        <Stack>
          {OUTPUTS.map((output) => (
            <InfoRow
              key={output.id}
              label={output.label}
              value={labelFor(INPUTS, routes[output.id]) ?? undefined}
            />
          ))}
          <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
            Displays without a source show the room idle graphic.
          </Typography>
        </Stack>
      </Panel>
    </FragmentLayout>
  );
}
