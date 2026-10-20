import { useGame, type GameSettings } from '@/contexts/GameContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useSystemReducedMotion } from '@/hooks/use-reduced-motion';
import { SettingsGroup, SettingsPage, SettingsSwitchRow } from '@/components/ui/settings';
import { isSpeechSupported, speak } from '@/lib/speech';
import { SettingsPicker } from './SettingsSubPage';

type FontSize = GameSettings['gridFontSize'];

const FONT_SIZES: { value: FontSize; label: string; glyph: number }[] = [
  { value: 'very-small', label: 'Very Small', glyph: 12 },
  { value: 'small', label: 'Small', glyph: 15 },
  { value: 'medium', label: 'Medium', glyph: 18 },
  { value: 'large', label: 'Large', glyph: 22 },
  { value: 'very-large', label: 'Very Large', glyph: 26 },
];

export function AccessibilitySection() {
  const { gameSettings, updateSettings } = useGame();
  const { reduceMotion, setReduceMotion, readAloud, setReadAloud, hideFocusOutlines, setHideFocusOutlines } =
    usePreferences();
  const systemReducedMotion = useSystemReducedMotion();

  return (
    <SettingsPage title="Accessibility" description="Make the game easier to see and use.">
      <SettingsGroup
        title="Motion"
        footer={
          systemReducedMotion
            ? 'Always on because your device is set to reduce motion. You can change this in your device’s accessibility settings.'
            : 'Turns on automatically when your device is set to reduce motion.'
        }
      >
        <SettingsSwitchRow
          settingId="reduce-motion"
          label="Reduce Motion"
          description="Turns off animations, win celebrations and background blur."
          checked={reduceMotion || systemReducedMotion}
          disabled={systemReducedMotion}
          onCheckedChange={setReduceMotion}
        />
      </SettingsGroup>

      <SettingsGroup title="Board">
        <SettingsPicker<FontSize>
          settingId="grid-font-size"
          label="Grid Font Size"
          pageDescription="How large X and O appear on the board."
          value={gameSettings.gridFontSize}
          onValueChange={(gridFontSize) => updateSettings({ gridFontSize })}
          options={FONT_SIZES.map((size) => ({
            value: size.value,
            label: size.label,
            preview: (
              <span className="font-semibold leading-none" style={{ fontSize: size.glyph }}>
                Aa
              </span>
            ),
          }))}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Speech"
        footer={
          isSpeechSupported
            ? 'Uses your device’s voice. Works alongside screen readers.'
            : 'Read Aloud isn’t supported in this browser.'
        }
      >
        <SettingsSwitchRow
          settingId="read-aloud"
          label="Read Aloud"
          description="Speaks each move, whose turn it is and who wins."
          checked={readAloud && isSpeechSupported}
          disabled={!isSpeechSupported}
          onCheckedChange={(next) => {
            setReadAloud(next);
            if (next) speak('Read Aloud is on.', true);
          }}
        />
      </SettingsGroup>

      <SettingsGroup title="Keyboard" footer="Only turn this on if you don’t use a keyboard to get around.">
        <SettingsSwitchRow
          settingId="focus-outlines"
          label="Disable Focus Outlines"
          description="Hides the outline that shows which control is focused."
          checked={hideFocusOutlines}
          onCheckedChange={setHideFocusOutlines}
        />
      </SettingsGroup>
    </SettingsPage>
  );
}
