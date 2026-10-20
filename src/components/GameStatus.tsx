import { Bot, Users } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export function GameStatus() {
  const { winner, currentPlayer, gameSettings, gameStats, board, isAiThinking } = useGame();
  const { theme, gameMode } = gameSettings;
  const isAiMode = gameMode === 'ai';
  const isDraw = !winner && board.every((cell) => cell !== null);

  const status = winner
    ? isAiMode
      ? winner === 'X'
        ? 'You win!'
        : 'AI wins'
      : `Player ${winner} wins!`
    : isDraw
      ? 'It’s a draw'
      : isAiMode
        ? isAiThinking || currentPlayer === 'O'
          ? 'AI’s turn'
          : 'Your turn'
        : `Player ${currentPlayer}’s turn`;

  const scores = [
    { label: isAiMode ? 'You' : 'X', value: gameStats.xWins, color: theme.xColor },
    { label: 'Draws', value: gameStats.draws, color: undefined },
    { label: isAiMode ? 'AI' : 'O', value: gameStats.oWins, color: theme.oColor },
  ];

  const ModeIcon = isAiMode ? Bot : Users;

  return (
    <section
      aria-label="Game status"
      className="flex items-center gap-4 rounded-[1.375rem] py-3 pl-3 pr-5 glass sm:min-w-80"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-sunken text-muted-foreground">
          <ModeIcon className="size-4" />
        </span>
        <span className="truncate text-sm font-medium">{status}</span>
      </div>

      <div className="h-8 w-px shrink-0 bg-border" aria-hidden />

      <dl className="flex shrink-0 items-center gap-4">
        {scores.map((score) => (
          <div key={score.label} className="flex min-w-8 flex-col-reverse items-center">
            <dt className="text-[11px] font-medium text-muted-foreground">{score.label}</dt>
            <dd
              className="text-lg font-semibold leading-tight tabular-nums"
              style={{ color: score.color }}
            >
              {score.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
