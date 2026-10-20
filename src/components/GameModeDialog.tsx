import type { ComponentType, CSSProperties } from 'react';
import { Cpu, Users } from 'lucide-react';
import { useGame, type GameMode } from '@/contexts/GameContext';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkmark } from '@/components/ui/checkmark';
import { playGameModeSwitchSound } from '@/lib/sounds';
import { cn } from '@/lib/utils';

interface ModeOption {
  mode: GameMode;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

const OPTIONS: ModeOption[] = [
  { mode: 'human', title: 'Two Player', description: 'Play with a friend', icon: Users, color: '#3b82f6' },
  { mode: 'ai', title: 'AI Mode', description: 'Play against the AI', icon: Cpu, color: '#22c55e' },
];

interface GameModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GameModeDialog({ open, onOpenChange }: GameModeDialogProps) {
  const { gameSettings, updateSettings, resetGame } = useGame();

  const handleSelect = (mode: GameMode) => {
    if (mode !== gameSettings.gameMode) {
      updateSettings({ gameMode: mode });
      resetGame();
      if (gameSettings.enableSounds) playGameModeSwitchSound();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle className="text-2xl">Select Game Mode</DialogTitle>
          <DialogDescription>Choose how you want to play.</DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-3 pt-6">
          {OPTIONS.map((option) => {
            const selected = gameSettings.gameMode === option.mode;
            return (
              <button
                key={option.mode}
                type="button"
                aria-pressed={selected}
                onClick={() => handleSelect(option.mode)}
                style={{ '--mode': option.color } as CSSProperties}
                className={cn(
                  'flex w-full items-center gap-3.5 rounded-[1.25rem] px-4 py-4 text-left transition-[background-color,box-shadow,scale]',
                  'bg-[color-mix(in_oklab,var(--mode)_12%,transparent)] hover:bg-[color-mix(in_oklab,var(--mode)_18%,transparent)]',
                  'active:scale-[0.98] active:bg-[color-mix(in_oklab,var(--mode)_22%,transparent)]',
                  'outline-2 outline-offset-2 outline-transparent focus-visible:outline-[color:var(--mode)]',
                  selected && 'shadow-[inset_0_0_0_1.5px_var(--mode)]'
                )}
              >
                <span className="shrink-0" style={{ color: option.color }}>
                  <option.icon className="size-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-semibold">{option.title}</span>
                  <span className="block text-[13px] text-muted-foreground">{option.description}</span>
                </span>
                {selected && (
                  <Checkmark style={{ color: option.color }} />
                )}
              </button>
            );
          })}
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
