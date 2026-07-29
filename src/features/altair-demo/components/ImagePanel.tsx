import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import LightModeIcon from '@mui/icons-material/LightMode';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import { Panel } from '../../../components/organisms/Panel';
import { SliderRow } from '../../../components/molecules/SliderRow';
import { ToggleRow } from '../../../components/molecules/ToggleRow';
import { LIGHT_OUTPUT_RANGE } from '../../../services/presenter';
import { describeShutter } from '../model/presentation';

export interface ImagePanelProps {
  /** Light output percentage reported by the driver, or `null`. */
  lightOutput: number | null;
  /** `true` = shutter closed. */
  shutter: boolean | null;
  disabled: boolean;
  onLightOutputCommit: (percent: number) => void;
  onShutterChange: (closed: boolean) => void;
}

const LIGHT_MARKS = [
  { value: 0, label: '0' },
  { value: 25 },
  { value: 50, label: '50' },
  { value: 75 },
  { value: 100, label: '100' },
];

/**
 * Feature section: light output (`LGT:`) and shutter (`SHT:`).
 *
 * The shutter switch is labelled by what it does — the driver's boolean means
 * "closed", so a switch labelled just "Shutter" would read backwards.
 */
export function ImagePanel({
  lightOutput,
  shutter,
  disabled,
  onLightOutputCommit,
  onShutterChange,
}: ImagePanelProps) {
  const shutterDescriptor = describeShutter(shutter);

  return (
    <Panel
      title="Image"
      subtitle="AltairDriver.SetLightOutputAsync / SetShutterAsync"
      icon={<Brightness6Icon />}
    >
      <Stack spacing={2.5}>
        <SliderRow
          label="Light output"
          icon={<LightModeIcon />}
          value={lightOutput}
          min={LIGHT_OUTPUT_RANGE.min}
          max={LIGHT_OUTPUT_RANGE.max}
          unit="%"
          marks={LIGHT_MARKS}
          disabled={disabled}
          onCommit={onLightOutputCommit}
        />
        <Divider />
        <ToggleRow
          label="Close shutter"
          description={`Blanks the projected image. Currently: ${shutterDescriptor.label.toLowerCase()}.`}
          icon={shutter ? <VisibilityOffIcon /> : <VisibilityIcon />}
          checked={shutter}
          onChange={onShutterChange}
          disabled={disabled}
          stateText={{ on: 'Closed', off: 'Open', unknown: 'Unknown' }}
          tone={{ on: 'warning', off: 'online' }}
        />
      </Stack>
    </Panel>
  );
}
