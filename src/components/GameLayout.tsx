import { Suspense, useEffect, useState, type ComponentType, type CSSProperties } from 'react';
import { GameAnnouncer } from './GameAnnouncer';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { cn, isModalOpen, isTypingOrMenuTarget, MODIFIER_KEY } from '@/lib/utils';
import { lazyWithPreload, whenIdle } from '@/lib/lazy';
import { playResetSound, playSettingsOpenSound, playGameModeSwitchSound } from '@/lib/sounds';
import { CONTROL_BUTTONS, resolveControlColors, type ControlButtonId } from '@/lib/control-buttons';

const SettingsDialog = lazyWithPreload(async () => ({ default: (await import('./SettingsDialog')).SettingsDialog }));
const GameModeDialog = lazyWithPreload(async () => ({ default: (await import('./GameModeDialog')).GameModeDialog }));

function TurnIndicator() {
  const { winner, currentPlayer, gameSettings, board, isAiThinking } = useGame();
  const { theme, gameMode } = gameSettings;
  const isDraw = !winner && board.every((cell) => cell !== null);

  let message: string;
  let color: string | undefined;

  if (winner) {
    message = gameMode === 'ai' && winner === 'O' ? 'AI Wins!' : `Player ${winner} Wins!`;
    color = winner === 'X' ? theme.xColor : theme.oColor;
  } else if (isDraw) {
    message = 'It’s a Draw!';
  } else if (gameMode === 'ai') {
    message = isAiThinking ? 'AI is thinking…' : 'You’re X and AI is O.';
    color = isAiThinking ? theme.oColor : theme.xColor;
  } else {
    message = `Please proceed with your turn player ${currentPlayer}.`;
    color = currentPlayer === 'X' ? theme.xColor : theme.oColor;
  }

  const isResult = !!winner || isDraw;

  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'text-balance font-semibold',
        isResult ? 'text-2xl tracking-tight' : 'text-base',
        !color && 'text-muted-foreground'
      )}
      style={{ color }}
    >
      {message}
    </p>
  );
}

interface ControlButtonProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  color: string;
  custom: boolean;
  shortcut: string;
  onClick: () => void;
}

function ControlButton({ icon: Icon, label, color, custom, shortcut, onClick }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={`${label} (${shortcut})`}
      data-style={custom ? 'custom' : undefined}
      className="control-button"
      style={{ '--control': color } as CSSProperties}
    >
      <Icon />
    </button>
  );
}

export function GameLayout() {
  const [settingsOpen, setSettingsOpen] = useState(() => new URLSearchParams(window.location.search).has('s'));
  const [gameModeOpen, setGameModeOpen] = useState(false);
  const [mounted, setMounted] = useState({ settings: settingsOpen, mode: false });
  const { resetGame, gameSettings } = useGame();
  const { theme, setTheme } = useTheme();
  const { controlColors, customControlButtons, controlColorsSynced } = usePreferences();
  const buttonColors = resolveControlColors({
    custom: customControlButtons,
    synced: controlColorsSynced,
    colors: controlColors,
    theme: gameSettings.theme,
  });

  const handleResetGame = () => {
    if (gameSettings.enableSounds) playResetSound();
    resetGame();
  };

  const handleSettingsOpen = (open: boolean) => {
    if (open && gameSettings.enableSounds) playSettingsOpenSound();
    if (open && !mounted.settings) setMounted((previous) => ({ ...previous, settings: true }));
    setSettingsOpen(open);
  };

  const handleGameModeOpen = (open: boolean) => {
    if (open && gameSettings.enableSounds) playGameModeSwitchSound();
    if (open && !mounted.mode) setMounted((previous) => ({ ...previous, mode: true }));
    setGameModeOpen(open);
  };

  useEffect(
    () =>
      whenIdle(() => {
        const ignore = () => undefined;
        SettingsDialog.preload().then(() => setMounted((previous) => ({ ...previous, settings: true })), ignore);
        GameModeDialog.preload().then(() => setMounted((previous) => ({ ...previous, mode: true })), ignore);
        import('canvas-confetti').catch(ignore);
      }),
    []
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (settingsOpen || gameModeOpen || event.repeat) return;
      if (isModalOpen() || isTypingOrMenuTarget(event.target)) return;
      const key = event.key.toLowerCase();

      if (key === 'r' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        handleResetGame();
      } else if (key === 's' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        handleGameModeOpen(true);
      } else if (event.key === ',' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        handleSettingsOpen(true);
      } else if (key === 't' && event.altKey && event.shiftKey) {
        event.preventDefault();
        setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  });

  const showStatusPanel = gameSettings.showGameStatus;

  const controlActions: Record<ControlButtonId, Omit<ControlButtonProps, 'icon' | 'color' | 'custom'>> = {
    reset: { label: 'Reset game', shortcut: 'R', onClick: handleResetGame },
    mode: { label: 'Change game mode', shortcut: 'S', onClick: () => handleGameModeOpen(true) },
    settings: { label: 'Settings', shortcut: `${MODIFIER_KEY}+,`, onClick: () => handleSettingsOpen(true) },
  };

  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      <main
        className={cn(
          'flex flex-1 flex-col items-center justify-center px-6 pt-[max(3rem,env(safe-area-inset-top))]',
          showStatusPanel ? 'pb-32 sm:pb-12' : 'pb-[max(3rem,env(safe-area-inset-bottom))]'
        )}
      >
        <header className="flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Tic Tac Toe</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">Play against AI or a friend</p>
          <div className="mt-6 flex h-8 items-center justify-center max-[359px]:h-12">
            <TurnIndicator />
          </div>
        </header>

        <div className="mt-6">
          <GameBoard />
        </div>

        <nav aria-label="Game controls" className="mt-10 flex items-center gap-6">
          {CONTROL_BUTTONS.map((button) => (
            <ControlButton
              key={button.id}
              icon={button.icon}
              color={buttonColors[button.id]}
              custom={customControlButtons}
              {...controlActions[button.id]}
            />
          ))}
        </nav>
      </main>

      <GameAnnouncer />

      {showStatusPanel && (
        <div
          className={cn(
            'fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 max-sm:inset-x-4',
            gameSettings.gameStatusPosition === 'left' ? 'sm:left-6' : 'sm:right-6'
          )}
        >
          <GameStatus />
        </div>
      )}

      {mounted.mode && (
        <Suspense fallback={null}>
          <GameModeDialog open={gameModeOpen} onOpenChange={handleGameModeOpen} />
        </Suspense>
      )}
      {mounted.settings && (
        <Suspense fallback={null}>
          <SettingsDialog open={settingsOpen} onOpenChange={handleSettingsOpen} />
        </Suspense>
      )}
    </div>
  );
}
