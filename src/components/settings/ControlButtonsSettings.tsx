import { Gamepad2, RotateCcw } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { SettingsActionRow, SettingsGroup, SettingsRow, SettingsSwitchRow } from '@/components/ui/settings';
import { ColorInput } from '@/components/ColorInput';
import {
  CONTROL_BUTTONS,
  DEFAULT_CONTROL_COLORS,
  resolveControlColors,
  type ControlColors,
} from '@/lib/control-buttons';
import { SettingsSubPage } from './SettingsSubPage';

function ColourDots({ colors }: { colors: ControlColors }) {
  return (
    <span aria-hidden className="flex items-center gap-1">
      {CONTROL_BUTTONS.map((button) => (
        <span
          key={button.id}
          className="size-3 rounded-full inset-ring inset-ring-foreground/15"
          style={{ backgroundColor: colors[button.id] }}
        />
      ))}
    </span>
  );
}

export function ControlButtonsSettings() {
  const {
    customControlButtons,
    setCustomControlButtons,
    controlColorsSynced,
    setControlColorsSynced,
    controlColors,
    setControlColor,
    resetControlColors,
  } = usePreferences();
  const { gameSettings } = useGame();

  const buttonColors = resolveControlColors({
    custom: customControlButtons,
    synced: controlColorsSynced,
    colors: controlColors,
    theme: gameSettings.theme,
  });
  const hasCustomControlColors = CONTROL_BUTTONS.some(
    (button) => controlColors[button.id] !== DEFAULT_CONTROL_COLORS[button.id]
  );

  return (
    <SettingsSubPage
      settingId="control-buttons"
      icon={<Gamepad2 />}
      iconColor="#8e8e93"
      label="Control Buttons"
      pageDescription="The round buttons under the board."
      value={<ColourDots colors={buttonColors} />}
    >
      <SettingsGroup
        footer={
          customControlButtons
            ? 'Softer colours without the glow.'
            : 'The classic red, blue and green buttons with a soft glow.'
        }
      >
        <SettingsSwitchRow
          label="Custom Control Buttons"
          description="Choose your own colours for Reset Game, Game Mode and Settings."
          checked={customControlButtons}
          onCheckedChange={setCustomControlButtons}
        />
      </SettingsGroup>

      {customControlButtons && (
        <SettingsGroup title="Colours">
          <SettingsSwitchRow
            label="Sync with Preset Colours"
            description="Uses the X and O colours from your current theme."
            checked={controlColorsSynced}
            onCheckedChange={setControlColorsSynced}
          />
          {!controlColorsSynced &&
            CONTROL_BUTTONS.map((button) => (
              <SettingsRow
                key={button.id}
                icon={<button.icon />}
                iconColor={controlColors[button.id]}
                plainIcon
                label={button.label}
                control={
                  <ColorInput
                    label={`${button.label} button colour`}
                    value={controlColors[button.id]}
                    onChange={(color) => setControlColor(button.id, color)}
                  />
                }
              />
            ))}
          {!controlColorsSynced && hasCustomControlColors && (
            <SettingsActionRow
              icon={<RotateCcw />}
              iconColor="var(--muted-foreground)"
              plainIcon
              label="Restore Default Colours"
              onClick={resetControlColors}
            />
          )}
        </SettingsGroup>
      )}
    </SettingsSubPage>
  );
}
