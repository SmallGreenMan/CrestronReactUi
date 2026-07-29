import SettingsInputHdmiIcon from '@mui/icons-material/SettingsInputHdmi';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import CableIcon from '@mui/icons-material/Cable';
import InputIcon from '@mui/icons-material/Input';
import { Panel } from '../../../components/organisms/Panel';
import { OptionSelector } from '../../../components/molecules/OptionSelector';
import type { SelectorOption } from '../../../components/molecules/OptionSelector';
import { ToneChip } from '../../../components/atoms/ToneChip';
import { SOURCE_RANGE } from '../../../services/presenter';
import { describeSource } from '../model/presentation';

export interface SourcePanelProps {
  /** Current input, 1–4, or `null` when the driver has not reported one. */
  source: number | null;
  disabled: boolean;
  onSelect: (source: number) => void;
}

/** Icons follow the AP-3000 input plate; index = source number. */
const SOURCE_ICONS = [
  <SettingsInputHdmiIcon key="1" />,
  <SettingsInputComponentIcon key="2" />,
  <SettingsInputAntennaIcon key="3" />,
  <CableIcon key="4" />,
];

const SOURCE_OPTIONS: SelectorOption<number>[] = Array.from(
  { length: SOURCE_RANGE.max - SOURCE_RANGE.min + 1 },
  (_unused, index) => {
    const value = SOURCE_RANGE.min + index;
    return {
      value,
      label: `Input ${value}`,
      caption: describeSource(value) ?? undefined,
      icon: SOURCE_ICONS[index],
    };
  },
);

/** Feature section: input selection, mapped to the `setsource` command (SRC:n). */
export function SourcePanel({ source, disabled, onSelect }: SourcePanelProps) {
  const sourceName = describeSource(source);

  return (
    <Panel
      title="Input source"
      subtitle={`AltairDriver.SetSourceAsync — ${SOURCE_RANGE.min}…${SOURCE_RANGE.max}`}
      icon={<InputIcon />}
      action={
        <ToneChip
          label={sourceName ?? 'Unknown'}
          tone={source === null ? 'offline' : 'active'}
          variant={source === null ? 'outlined' : 'filled'}
        />
      }
    >
      <OptionSelector
        options={SOURCE_OPTIONS}
        value={source}
        onChange={onSelect}
        disabled={disabled}
        ariaLabel="Input source"
        columns={4}
      />
    </Panel>
  );
}
