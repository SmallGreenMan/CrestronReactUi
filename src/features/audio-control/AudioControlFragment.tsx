import { useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TuneIcon from '@mui/icons-material/Tune';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import SpeakerIcon from '@mui/icons-material/Speaker';
import MicIcon from '@mui/icons-material/Mic';
import { FragmentLayout } from '../../components/templates/FragmentLayout';
import { Panel } from '../../components/organisms/Panel';
import { FaderStrip } from '../../components/organisms/FaderStrip';
import { SliderRow } from '../../components/molecules/SliderRow';
import { ToggleRow } from '../../components/molecules/ToggleRow';
import { ActionButton } from '../../components/molecules/ActionButton';
import { StatCard } from '../../components/molecules/StatCard';
import { OptionSelector } from '../../components/molecules/OptionSelector';
import type { SelectorOption } from '../../components/molecules/OptionSelector';
import { ToneChip } from '../../components/atoms/ToneChip';
import { useSimulatedMeters } from './useSimulatedMeters';

interface Channel {
  id: number;
  label: string;
  level: number;
  muted: boolean;
}

const INITIAL_CHANNELS: Channel[] = [
  { id: 1, label: 'Lectern mic', level: 72, muted: false },
  { id: 2, label: 'Handheld', level: 58, muted: true },
  { id: 3, label: 'Program', level: 80, muted: false },
  { id: 4, label: 'Conference', level: 65, muted: false },
];

type ZoneId = 'main' | 'lobby' | 'overflow';

const ZONE_OPTIONS: SelectorOption<ZoneId>[] = [
  { value: 'main', label: 'Main hall', icon: <SpeakerIcon />, caption: '8 speakers' },
  { value: 'lobby', label: 'Lobby', icon: <SpeakerIcon />, caption: '4 speakers' },
  { value: 'overflow', label: 'Overflow', icon: <SpeakerIcon />, caption: '2 speakers' },
];

/**
 * Fragment: audio mixing and zone levels.
 *
 * Local state only — the presenter exposes no audio commands. The controls are
 * fully interactive so the component library is exercised for real.
 */
export function AudioControlFragment() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [masterLevel, setMasterLevel] = useState(70);
  const [masterMuted, setMasterMuted] = useState(false);
  const [zone, setZone] = useState<ZoneId>('main');

  const meters = useSimulatedMeters(INITIAL_CHANNELS.length);

  const setChannelLevel = useCallback((id: number, level: number) => {
    setChannels((current) =>
      current.map((channel) => (channel.id === id ? { ...channel, level } : channel)),
    );
  }, []);

  const toggleChannelMute = useCallback((id: number) => {
    setChannels((current) =>
      current.map((channel) =>
        channel.id === id ? { ...channel, muted: !channel.muted } : channel,
      ),
    );
  }, []);

  const muteAll = useCallback(() => {
    setChannels((current) => current.map((channel) => ({ ...channel, muted: true })));
  }, []);

  const openAll = useCallback(() => {
    setChannels((current) => current.map((channel) => ({ ...channel, muted: false })));
  }, []);

  const liveCount = useMemo(() => channels.filter((channel) => !channel.muted).length, [channels]);
  const averageLevel = useMemo(
    () =>
      Math.round(
        channels.reduce((sum, channel) => sum + (channel.muted ? 0 : channel.level), 0) /
          channels.length,
      ),
    [channels],
  );

  return (
    <FragmentLayout
      title="Audio Control"
      subtitle="Channel levels, mutes and zone output"
      headerAction={
        <ToneChip
          label={masterMuted ? 'Master muted' : `${liveCount} channels live`}
          tone={masterMuted ? 'danger' : 'online'}
        />
      }
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        <StatCard
          icon={<VolumeUpIcon />}
          label="Master"
          value={masterMuted ? 'MUTE' : masterLevel}
          unit={masterMuted ? undefined : '%'}
          tone={masterMuted ? 'danger' : 'online'}
        />
        <StatCard icon={<MicIcon />} label="Open channels" value={liveCount} unit={`/ ${channels.length}`} />
        <StatCard icon={<EqualizerIcon />} label="Average level" value={averageLevel} unit="%" />
      </Box>

      <Panel
        title="Channel mixer"
        subtitle="Fader positions apply on release"
        icon={<TuneIcon />}
        action={
          <Stack direction="row" spacing={1}>
            <ActionButton
              label="Open all"
              icon={<VolumeUpIcon />}
              onClick={openAll}
              variant="outlined"
              size="small"
            />
            <ActionButton
              label="Mute all"
              icon={<VolumeOffIcon />}
              onClick={muteAll}
              variant="outlined"
              color="error"
              size="small"
            />
          </Stack>
        }
      >
        <Box
          sx={{
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: `repeat(${channels.length}, 1fr)` },
          }}
        >
          {channels.map((channel, index) => (
            <FaderStrip
              key={channel.id}
              label={channel.label}
              level={channel.level}
              muted={channel.muted || masterMuted}
              meter={meters[index] ?? 0}
              onLevelCommit={(level) => setChannelLevel(channel.id, level)}
              onMuteToggle={() => toggleChannelMute(channel.id)}
            />
          ))}
        </Box>
      </Panel>

      <Panel title="Master output" subtitle="Applies after the channel mix" icon={<SpeakerIcon />}>
        <Stack spacing={2.5}>
          <SliderRow
            label="Master level"
            icon={<VolumeUpIcon />}
            value={masterLevel}
            min={0}
            max={100}
            unit="%"
            disabled={masterMuted}
            onCommit={setMasterLevel}
          />
          <ToggleRow
            label="Mute master output"
            description="Silences every zone without changing fader positions."
            icon={masterMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            checked={masterMuted}
            onChange={setMasterMuted}
            stateText={{ on: 'Muted', off: 'Live' }}
            tone={{ on: 'danger', off: 'online' }}
          />
        </Stack>
      </Panel>

      <Panel title="Output zone" subtitle="Where the master mix is sent" icon={<SpeakerIcon />}>
        <OptionSelector
          options={ZONE_OPTIONS}
          value={zone}
          onChange={setZone}
          ariaLabel="Output zone"
          columns={3}
        />
      </Panel>
    </FragmentLayout>
  );
}
