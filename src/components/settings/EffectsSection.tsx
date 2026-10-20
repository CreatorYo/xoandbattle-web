import { Play } from 'lucide-react';
import { useGame, type WinAnimation } from '@/contexts/GameContext';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { SettingsActionRow, SettingsGroup, SettingsPage, SettingsSwitchRow } from '@/components/ui/settings';
import { isCelebration } from '@/lib/celebrations';
import { playMoveSound } from '@/lib/sounds';
import { SettingsPicker } from './SettingsSubPage';

const WIN_ANIMATIONS: { value: WinAnimation; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'No celebration.' },
  { value: 'confetti', label: 'Confetti', description: 'Bursts of confetti across the screen.' },
  { value: 'sparkle', label: 'Sparkle', description: 'A shower of twinkling stars.' },
  { value: 'glow', label: 'Glow', description: 'The winning line glows on the board.' },
];

export function EffectsSection() {
  const { gameSettings, updateSettings, triggerWinAnimation } = useGame();
  const reducedMotion = useReducedMotion();
  const canPreview = !reducedMotion && isCelebration(gameSettings.winAnimation);

  return (
    <SettingsPage title="Sound & Effects" description="What you hear and see while you play.">
      <SettingsGroup title="Sound">
        <SettingsSwitchRow
          settingId="sound-effects"
          label="Sound Effects"
          description="Plays sounds for moves, wins, draws and buttons."
          checked={gameSettings.enableSounds}
          onCheckedChange={(enableSounds) => {
            updateSettings({ enableSounds });
            if (enableSounds) playMoveSound('X');
          }}
        />
      </SettingsGroup>

      <SettingsGroup
        title="Animations"
        footer={
          reducedMotion
            ? 'Animations and win celebrations are paused while Reduce Motion is on. Your choices are kept for when it’s turned off.'
            : undefined
        }
      >
        <SettingsSwitchRow
          settingId="enable-animations"
          label="Enable Animations"
          description="Animates X and O as they’re placed."
          checked={gameSettings.enableAnimations}
          onCheckedChange={(enableAnimations) => updateSettings({ enableAnimations })}
        />
        <SettingsPicker<WinAnimation>
          settingId="win-animation"
          label="Win Animation"
          pageDescription="How a win is celebrated."
          value={gameSettings.winAnimation}
          onValueChange={(winAnimation) => updateSettings({ winAnimation })}
          options={WIN_ANIMATIONS}
          footer={
            gameSettings.winAnimation === 'glow' && !gameSettings.enableAnimations
              ? 'Glow needs Enable Animations turned on.'
              : undefined
          }
        >
          <SettingsGroup
            footer={
              reducedMotion
                ? 'Previews are unavailable while Reduce Motion is on.'
                : 'Only Confetti and Sparkle can be previewed.'
            }
          >
            <SettingsActionRow
              icon={<Play className="fill-current" />}
              iconColor="#ff2d55"
              label="Preview"
              disabled={!canPreview}
              onClick={() => triggerWinAnimation('X')}
            />
          </SettingsGroup>
        </SettingsPicker>
      </SettingsGroup>
    </SettingsPage>
  );
}
