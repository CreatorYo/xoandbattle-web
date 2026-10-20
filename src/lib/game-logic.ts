import type { Difficulty, Player } from '@/contexts/GameContext';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export function checkWinner(squares: Player[]): { winner: Player; line: number[] | null } {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

export function getBestMove(squares: Player[], difficulty: Difficulty): number {
  const availableMoves = squares.flatMap((square, index) => (square === null ? [index] : []));

  if (difficulty === 'easy') {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  const depthLimit = difficulty === 'medium' ? 4 : difficulty === 'hard' ? 6 : Infinity;

  const minimax = (board: Player[], depth: number, isMaximizing: boolean, alpha: number, beta: number): number => {
    const { winner } = checkWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (board.every(Boolean) || depth > depthLimit) return 0;

    let best = isMaximizing ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] !== null) continue;
      board[i] = isMaximizing ? 'O' : 'X';
      const score = minimax(board, depth + 1, !isMaximizing, alpha, beta);
      board[i] = null;
      if (isMaximizing) {
        best = Math.max(best, score);
        alpha = Math.max(alpha, score);
      } else {
        best = Math.min(best, score);
        beta = Math.min(beta, score);
      }
      if (beta <= alpha) break;
    }
    return best;
  };

  let bestMove = availableMoves[0];
  let bestScore = -Infinity;
  for (const move of availableMoves) {
    const next = [...squares];
    next[move] = 'O';
    const score = minimax(next, 0, false, -Infinity, Infinity);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
