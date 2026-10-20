import { useEffect, useRef } from 'react';
import { useGame, type Player } from '@/contexts/GameContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { speak } from '@/lib/speech';

const CELL_NAMES = [
  'the top left',
  'the top centre',
  'the top right',
  'the middle left',
  'the centre',
  'the middle right',
  'the bottom left',
  'the bottom centre',
  'the bottom right',
];

function describeMove(mark: Exclude<Player, null>, cell: number, isAiMode: boolean) {
  if (!isAiMode) return `${mark} in ${CELL_NAMES[cell]}.`;
  return `${mark === 'X' ? 'You' : 'The AI'} played ${CELL_NAMES[cell]}.`;
}

function describeResult(winner: Player, isAiMode: boolean) {
  if (!winner) return 'It’s a draw.';
  if (!isAiMode) return `Player ${winner} wins!`;
  return winner === 'X' ? 'You win!' : 'The AI wins.';
}

export function GameAnnouncer() {
  const { board, winner, gameSettings } = useGame();
  const { readAloud } = usePreferences();
  const isAiMode = gameSettings.gameMode === 'ai';
  const previous = useRef(board);

  useEffect(() => {
    const lastBoard = previous.current;
    previous.current = board;
    if (!readAloud || lastBoard === board) return;

    if (board.every((cell) => cell === null)) {
      if (lastBoard.some(Boolean)) speak(`New round. ${isAiMode ? 'Your turn.' : 'Player X’s turn.'}`, true);
      return;
    }

    const placed = board.findIndex((cell, index) => cell !== null && lastBoard[index] !== cell);
    const mark = board[placed];
    if (placed === -1 || !mark) return;

    const parts = [describeMove(mark, placed, isAiMode)];
    if (winner || board.every(Boolean)) parts.push(describeResult(winner, isAiMode));
    else if (!isAiMode) parts.push(`Player ${mark === 'X' ? 'O' : 'X'}’s turn.`);
    else if (mark === 'O') parts.push('Your turn.');

    speak(parts.join(' '));
  }, [board, winner, readAloud, isAiMode]);

  return null;
}
