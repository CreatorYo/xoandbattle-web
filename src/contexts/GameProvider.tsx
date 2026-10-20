import { useRef, useState, type ReactNode } from 'react';
import {
  GameContext,
  type CountedStat,
  type GameSettings,
  type PersistentStats,
  type Player,
  type SessionStats,
} from '@/contexts/GameContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { isCelebration, playCelebration } from '@/lib/celebrations';
import { checkWinner, getBestMove } from '@/lib/game-logic';
import {
  emptyStats,
  loadPersistentStats,
  loadSettings,
  savePersistentStats,
  saveSettings,
} from '@/lib/game-storage';
import { prefersReducedMotion } from '@/lib/motion';

const AI_MOVE_DELAY = 800;

export function GameProvider({ children }: { children: ReactNode }) {
  const { pauseAchievements } = usePreferences();
  const [board, setBoard] = useState<Player[]>(() => Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>(loadSettings);
  const [gameStats, setGameStats] = useState<SessionStats>({ xWins: 0, oWins: 0, draws: 0 });
  const [persistentStats, setPersistentStats] = useState<PersistentStats>(loadPersistentStats);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const aiTimer = useRef<number | undefined>(undefined);

  const recordStats = (keys: CountedStat[]) => {
    if (pauseAchievements) return;
    const now = new Date().toISOString();
    setPersistentStats((previous) => {
      const next: PersistentStats = { ...previous };
      for (const key of ['gamesPlayed', ...keys] as CountedStat[]) {
        next[key] = (previous[key] ?? 0) + 1;
        if (previous[`${key}FirstAchieved`]) next[`${key}LastUpdated`] = now;
        else next[`${key}FirstAchieved`] = now;
      }
      savePersistentStats(next);
      return next;
    });
  };

  const triggerWinAnimation = (winningPlayer?: Player) => {
    if (gameSettings.gameMode === 'ai' && winningPlayer === 'O') return;
    if (prefersReducedMotion() || !isCelebration(gameSettings.winAnimation)) return;
    playCelebration(gameSettings.winAnimation).catch((error: unknown) => {
      console.error('Could not play the win animation:', error);
    });
  };

  const finishRound = (result: Player | 'draw', line: number[] | null) => {
    if (result === 'draw') {
      setGameStats((previous) => ({ ...previous, draws: previous.draws + 1 }));
      recordStats(['draws']);
      return;
    }

    setWinner(result);
    setWinningLine(line);
    setGameStats((previous) =>
      result === 'X' ? { ...previous, xWins: previous.xWins + 1 } : { ...previous, oWins: previous.oWins + 1 },
    );

    const keys: CountedStat[] = [result === 'X' ? 'xWins' : 'oWins'];
    if (result === 'X' && gameSettings.gameMode === 'ai') keys.push(`${gameSettings.difficulty}Wins`);
    recordStats(keys);
    triggerWinAnimation(result);
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);

    const { winner: roundWinner, line } = checkWinner(nextBoard);
    if (roundWinner) return finishRound(roundWinner, line);
    if (nextBoard.every(Boolean)) return finishRound('draw', null);

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);
    if (gameSettings.gameMode !== 'ai' || nextPlayer !== 'O') return;

    setIsAiThinking(true);
    aiTimer.current = window.setTimeout(() => {
      const aiBoard = [...nextBoard];
      aiBoard[getBestMove(nextBoard, gameSettings.difficulty)] = 'O';
      setBoard(aiBoard);
      setIsAiThinking(false);

      const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard);
      if (aiWinner) finishRound(aiWinner, aiLine);
      else if (aiBoard.every(Boolean)) finishRound('draw', null);
      else setCurrentPlayer('X');
    }, AI_MOVE_DELAY);
  };

  const resetGame = () => {
    window.clearTimeout(aiTimer.current);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    setGameSettings((previous) => {
      const next = { ...previous, ...settings };
      saveSettings(next);
      return next;
    });
  };

  const resetPersistentStats = () => {
    const cleared = emptyStats();
    setPersistentStats(cleared);
    savePersistentStats(cleared);
  };

  const updatePersistentStats = (stats: PersistentStats) => {
    setPersistentStats(stats);
    savePersistentStats(stats);
  };

  return (
    <GameContext.Provider
      value={{
        board,
        currentPlayer,
        winner,
        winningLine,
        gameSettings,
        gameStats,
        persistentStats,
        isAiThinking,
        makeMove,
        resetGame,
        updateSettings,
        triggerWinAnimation,
        resetPersistentStats,
        updatePersistentStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
