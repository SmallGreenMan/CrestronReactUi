import { useCallback, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import GroupsIcon from '@mui/icons-material/Groups';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { FragmentLayout } from '../../components/templates/FragmentLayout';
import { Panel } from '../../components/organisms/Panel';
import { StatCard } from '../../components/molecules/StatCard';
import { ToggleRow } from '../../components/molecules/ToggleRow';
import { SliderRow } from '../../components/molecules/SliderRow';
import { ActionButton } from '../../components/molecules/ActionButton';
import { InfoRow } from '../../components/molecules/InfoRow';
import { OptionSelector } from '../../components/molecules/OptionSelector';
import type { SelectorOption } from '../../components/molecules/OptionSelector';
import { ConnectionIndicator } from '../../components/molecules/ConnectionIndicator';
import type { SignalTone } from '../../components/atoms/tone';

type CallState = 'idle' | 'dialing' | 'connected';

type LayoutId = 'speaker' | 'grid' | 'presentation';

const LAYOUT_OPTIONS: SelectorOption<LayoutId>[] = [
  { value: 'speaker', label: 'Speaker', icon: <GroupsIcon />, caption: 'Active talker' },
  { value: 'grid', label: 'Grid', icon: <GroupsIcon />, caption: 'Equal tiles' },
  { value: 'presentation', label: 'Content', icon: <ScreenShareIcon />, caption: 'Share + PiP' },
];

const CALL_DESCRIPTORS: Record<CallState, { label: string; tone: SignalTone; pulse?: boolean }> = {
  idle: { label: 'No active call', tone: 'idle' },
  dialing: { label: 'Dialing…', tone: 'warning', pulse: true },
  connected: { label: 'In call', tone: 'online' },
};

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Fragment: video conferencing controls.
 *
 * Local state only — the presenter exposes no VCS commands. The call lifecycle is
 * simulated so the controls behave the way the real ones would.
 */
export function VcsFragment() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [duration, setDuration] = useState(0);
  const [micMuted, setMicMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [farEndVolume, setFarEndVolume] = useState(60);
  const [layout, setLayout] = useState<LayoutId>('speaker');

  // Dialing settles into a connected call.
  useEffect(() => {
    if (callState !== 'dialing') return;
    const timer = setTimeout(() => setCallState('connected'), 1800);
    return () => clearTimeout(timer);
  }, [callState]);

  // Call timer. Resetting to zero happens in the handlers below, so this effect
  // only ever owns the interval.
  useEffect(() => {
    if (callState !== 'connected') return;
    const timer = setInterval(() => setDuration((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [callState]);

  const startCall = useCallback(() => {
    setDuration(0);
    setCallState('dialing');
  }, []);
  const endCall = useCallback(() => {
    setCallState('idle');
    setDuration(0);
    setSharing(false);
  }, []);

  const descriptor = CALL_DESCRIPTORS[callState];
  const inCall = callState === 'connected';
  const participants = inCall ? 4 : 0;

  return (
    <FragmentLayout
      title="VCS"
      subtitle="Video conferencing system — call, camera and content"
      headerAction={
        <ConnectionIndicator
          tone={descriptor.tone}
          label={descriptor.label}
          detail={inCall ? formatDuration(duration) : undefined}
          pulse={descriptor.pulse}
        />
      }
    >
      <Box
        sx={{
          display: 'grid',
          gap: 1.5,
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        }}
      >
        <StatCard
          icon={<CallIcon />}
          label="Call"
          value={descriptor.label}
          tone={descriptor.tone}
        />
        <StatCard
          icon={<GroupsIcon />}
          label="Participants"
          value={inCall ? participants : null}
          tone={inCall ? 'online' : 'offline'}
        />
        <StatCard
          icon={micMuted ? <MicOffIcon /> : <MicIcon />}
          label="Microphone"
          value={micMuted ? 'Muted' : 'Open'}
          tone={micMuted ? 'danger' : 'online'}
        />
        <StatCard
          icon={cameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
          label="Camera"
          value={cameraOff ? 'Off' : 'On'}
          tone={cameraOff ? 'warning' : 'online'}
        />
      </Box>

      <Panel
        title="Call"
        subtitle="Room system endpoint"
        icon={<VideoCallIcon />}
        tone={descriptor.tone}
      >
        <Stack spacing={2}>
          <Stack>
            <InfoRow label="Endpoint" value="room-4.vcs.local" mono />
            <InfoRow label="Duration" value={inCall ? formatDuration(duration) : undefined} mono />
            <InfoRow label="Layout" value={LAYOUT_OPTIONS.find((o) => o.value === layout)?.label} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <ActionButton
              label="Join meeting"
              icon={<CallIcon />}
              onClick={startCall}
              disabled={callState !== 'idle'}
              busy={callState === 'dialing'}
              size="large"
              fullWidth
            />
            <ActionButton
              label="End call"
              icon={<CallEndIcon />}
              onClick={endCall}
              disabled={callState === 'idle'}
              color="error"
              variant="outlined"
              size="large"
              fullWidth
            />
          </Stack>
        </Stack>
      </Panel>

      <Panel title="Devices" subtitle="Near-end audio and video" icon={<MicIcon />}>
        <Stack spacing={2.5}>
          <ToggleRow
            label="Mute microphone"
            description="Stops audio being sent to the far end."
            icon={micMuted ? <MicOffIcon /> : <MicIcon />}
            checked={micMuted}
            onChange={setMicMuted}
            stateText={{ on: 'Muted', off: 'Open' }}
            tone={{ on: 'danger', off: 'online' }}
          />
          <ToggleRow
            label="Turn camera off"
            description="Sends a privacy placeholder instead of the room view."
            icon={cameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
            checked={cameraOff}
            onChange={setCameraOff}
            stateText={{ on: 'Off', off: 'On' }}
            tone={{ on: 'warning', off: 'online' }}
          />
          <ToggleRow
            label="Share content"
            description="Routes the lectern source into the call."
            icon={<ScreenShareIcon />}
            checked={sharing}
            onChange={setSharing}
            disabled={!inCall}
            stateText={{ on: 'Sharing', off: 'Not sharing' }}
            tone={{ on: 'active', off: 'idle' }}
          />
          <SliderRow
            label="Far-end volume"
            icon={<VolumeUpIcon />}
            value={farEndVolume}
            min={0}
            max={100}
            unit="%"
            onCommit={setFarEndVolume}
          />
        </Stack>
      </Panel>

      <Panel title="Video layout" subtitle="How remote participants are arranged" icon={<GroupsIcon />}>
        <Stack spacing={1.5}>
          <OptionSelector
            options={LAYOUT_OPTIONS}
            value={layout}
            onChange={setLayout}
            ariaLabel="Video layout"
            columns={3}
          />
          {!inCall && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              The layout is stored now and applied when the next call connects.
            </Typography>
          )}
        </Stack>
      </Panel>
    </FragmentLayout>
  );
}
