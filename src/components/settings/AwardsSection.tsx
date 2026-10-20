import { useState } from 'react';
import { ChevronRight, Pause, RotateCcw, Signal, SignalHigh, SignalLow, SignalMedium, type LucideIcon } from 'lucide-react';
import { useGame, type CountedStat } from '@/contexts/GameContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { SettingsActionRow, SettingsGroup, SettingsPage, SettingsSwitchRow } from '@/components/ui/settings';
import { pressableRowClassName } from '@/components/ui/row-styles';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/components/ui/toast-helper';
import { AwardDetailDialog, type Award } from '@/components/AwardDetailDialog';
import { cn } from '@/lib/utils';
import { getSymbols } from '@/lib/symbols';

const AWARDS: Record<CountedStat, Award> = {
  gamesPlayed: { type: 'gamesPlayed', label: 'Games Played', description: 'Every finished round, in any mode.' },
  xWins: { type: 'xWins', label: 'X Wins', description: 'Rounds won by player X.' },
  oWins: { type: 'oWins', label: 'O Wins', description: 'Rounds won by player O, including wins by the AI.' },
  draws: { type: 'draws', label: 'Draws', description: 'Rounds that ended with a full board and no winner.' },
  easyWins: { type: 'easyWins', label: 'Easy Wins', description: 'Rounds you’ve won against the AI on Easy.' },
  mediumWins: { type: 'mediumWins', label: 'Medium Wins', description: 'Rounds you’ve won against the AI on Medium.' },
  hardWins: { type: 'hardWins', label: 'Hard Wins', description: 'Rounds you’ve won against the AI on Hard.' },
  unbeatableWins: {
    type: 'unbeatableWins',
    label: 'Unbeatable Wins',
    description: 'Rounds you’ve won against the AI on Unbeatable.',
  },
};

const DIFFICULTY_TIERS: { type: CountedStat; label: string; icon: LucideIcon; color: string }[] = [
  { type: 'easyWins', label: 'Easy', icon: SignalLow, color: '#34c759' },
  { type: 'mediumWins', label: 'Medium', icon: SignalMedium, color: '#007aff' },
  { type: 'hardWins', label: 'Hard', icon: SignalHigh, color: '#ff9500' },
  { type: 'unbeatableWins', label: 'Unbeatable', icon: Signal, color: '#ff3b30' },
];

export function AwardsSection() {
  const { persistentStats, gameSettings, resetPersistentStats, updatePersistentStats } = useGame();
  const { pauseAchievements, setPauseAchievements } = usePreferences();
  const [selected, setSelected] = useState<Award | null>(null);
  const [resetTarget, setResetTarget] = useState<Award | null>(null);
  const [confirmSingleReset, setConfirmSingleReset] = useState(false);
  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const { theme } = gameSettings;
  const symbols = getSymbols(theme);
  const count = (type: CountedStat) => persistentStats[type] ?? 0;

  const outcomes = [
    { type: 'xWins', label: `${symbols.x} Wins`, color: theme.xColor },
    { type: 'draws', label: 'Draws', color: 'var(--muted-foreground)' },
    { type: 'oWins', label: `${symbols.o} Wins`, color: theme.oColor },
  ] satisfies { type: CountedStat; label: string; color: string }[];

  const resetSingle = () => {
    if (!resetTarget) return;
    const { type } = resetTarget;
    const updated = { ...persistentStats };
    updated[type] = 0;
    delete updated[`${type}FirstAchieved` as const];
    delete updated[`${type}LastUpdated` as const];
    updatePersistentStats(updated);
    toast.success(`${resetTarget.label} reset`, 'The count is back to zero.');
    setSelected(null);
  };

  return (
    <SettingsPage title="Awards" description="Your all-time record on this device.">
      <SettingsGroup settingId="game-performance" title="Game Performance" bare>
        <div className="overflow-hidden rounded-[1.25rem] bg-surface">
          <button
            type="button"
            onClick={() => setSelected(AWARDS.gamesPlayed)}
            className={cn('flex w-full items-end justify-between gap-4 px-5 pb-4 pt-5 text-left', pressableRowClassName)}
          >
            <span>
              <span className="block text-[13px] font-medium text-muted-foreground">Games Played</span>
              <span className="mt-1 block text-[44px] font-bold leading-none tabular-nums tracking-tight">
                {count('gamesPlayed')}
              </span>
            </span>
            {pauseAchievements ? (
              <span className="mb-1 rounded-full bg-[#ff9500]/15 px-2.5 py-1 text-xs font-semibold text-[#ff9500]">
                Paused
              </span>
            ) : (
              <ChevronRight className="mb-1.5 size-[18px] text-muted-foreground/50" strokeWidth={2.5} />
            )}
          </button>

          <div aria-hidden className="mx-5 flex h-2 gap-0.5 overflow-hidden rounded-full bg-surface-sunken">
            {outcomes.map(
              (outcome) =>
                count(outcome.type) > 0 && (
                  <span
                    key={outcome.type}
                    className="basis-0"
                    style={{ flexGrow: count(outcome.type), backgroundColor: outcome.color }}
                  />
                )
            )}
          </div>

          <div className="grid grid-cols-3 gap-1 p-2">
            {outcomes.map((outcome) => (
              <button
                key={outcome.type}
                type="button"
                onClick={() => setSelected(AWARDS[outcome.type])}
                className={cn('flex flex-col items-center gap-1 rounded-2xl px-2 py-3', pressableRowClassName)}
              >
                <span className="flex max-w-full items-center gap-1.5 text-[13px] text-muted-foreground">
                  <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: outcome.color }} />
                  <span className="truncate">{outcome.label}</span>
                </span>
                <span className="text-2xl font-bold tabular-nums tracking-tight">{count(outcome.type)}</span>
              </button>
            ))}
          </div>
        </div>
      </SettingsGroup>

      <SettingsGroup settingId="ai-wins" title="AI Wins" footer="Rounds you’ve won in AI Mode, by difficulty.">
        {DIFFICULTY_TIERS.map((tier) => (
          <SettingsActionRow
            key={tier.type}
            icon={<tier.icon />}
            iconColor={tier.color}
            label={tier.label}
            value={count(tier.type)}
            onClick={() => setSelected(AWARDS[tier.type])}
          />
        ))}
      </SettingsGroup>

      <SettingsGroup title="Manage Achievements">
        <SettingsSwitchRow
          settingId="pause-achievements"
          icon={<Pause />}
          iconColor="#ff9500"
          label="Pause Achievements"
          description="Finished rounds won’t count towards your awards while paused."
          checked={pauseAchievements}
          onCheckedChange={setPauseAchievements}
        />
        <SettingsActionRow
          settingId="reset-awards"
          icon={<RotateCcw />}
          iconColor="#ff3b30"
          label="Reset All Awards"
          tone="destructive"
          onClick={() => setConfirmResetAll(true)}
        />
      </SettingsGroup>

      <AwardDetailDialog
        award={selected}
        open={!!selected && !confirmSingleReset}
        onOpenChange={(open) => !open && setSelected(null)}
        onRequestReset={() => {
          setResetTarget(selected);
          setConfirmSingleReset(true);
        }}
      />

      <ConfirmDialog
        open={confirmSingleReset}
        onOpenChange={setConfirmSingleReset}
        title={`Reset ${resetTarget?.label ?? 'Award'}`}
        description="This count and its dates will be cleared. This can’t be undone."
        confirmText="Reset"
        variant="destructive"
        onConfirm={resetSingle}
      />

      <ConfirmDialog
        open={confirmResetAll}
        onOpenChange={setConfirmResetAll}
        title="Reset All Awards"
        description="Every count and date will be cleared. This can’t be undone."
        confirmText="Reset All Awards"
        variant="destructive"
        onConfirm={() => {
          resetPersistentStats();
          toast.success('Awards reset', 'All awards have been reset.');
        }}
      />
    </SettingsPage>
  );
}
