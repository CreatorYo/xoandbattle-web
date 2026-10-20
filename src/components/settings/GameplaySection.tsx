import { Cpu, Users } from 'lucide-react';
import { useGame, type Difficulty, type GameMode } from '@/contexts/GameContext';
import { SettingsGroup, SettingsPage, SettingsRow, SettingsSwitchRow } from '@/components/ui/settings';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SettingsPicker } from './SettingsSubPage';

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'Picks squares at random.' },
  { value: 'medium', label: 'Medium', description: 'Looks a few moves ahead.' },
  { value: 'hard', label: 'Hard', description: 'Looks further ahead and rarely slips up.' },
  { value: 'unbeatable', label: 'Unbeatable', description: 'Plays perfectly. The best you can do is draw.' },
];

export function GameplaySection() {
  const { gameSettings, updateSettings, resetGame } = useGame();

  return (
    <SettingsPage title="Gameplay" description="How each round is played and what appears around the board.">
      <SettingsGroup title="Game" footer="Changing the mode starts a new round.">
        <SettingsRow
          stack
          settingId="game-mode"
          label="Mode"
          control={
            <SegmentedControl<GameMode>
              aria-label="Game mode"
              value={gameSettings.gameMode}
              onValueChange={(gameMode) => {
                updateSettings({ gameMode });
                resetGame();
              }}
              options={[
                { value: 'human', label: 'Two Player', icon: <Users /> },
                { value: 'ai', label: 'AI Mode', icon: <Cpu /> },
              ]}
            />
          }
        />
        <SettingsPicker<Difficulty>
          settingId="ai-difficulty"
          label="AI Difficulty"
          pageDescription="How hard the AI tries to win in AI Mode."
          value={gameSettings.difficulty}
          onValueChange={(difficulty) => updateSettings({ difficulty })}
          options={DIFFICULTIES}
        />
      </SettingsGroup>

      <SettingsGroup title="Display">
        <SettingsSwitchRow
          settingId="game-status-panel"
          label="Game Status Panel"
          description="Shows whose turn it is and the score for this session."
          checked={gameSettings.showGameStatus}
          onCheckedChange={(showGameStatus) => updateSettings({ showGameStatus })}
        />
        {gameSettings.showGameStatus && (
          <SettingsRow
            settingId="panel-position"
            label="Panel Position"
            control={
              <SegmentedControl<'left' | 'right'>
                aria-label="Status panel position"
                size="sm"
                className="w-36"
                value={gameSettings.gameStatusPosition}
                onValueChange={(gameStatusPosition) => updateSettings({ gameStatusPosition })}
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            }
          />
        )}
      </SettingsGroup>
    </SettingsPage>
  );
}
