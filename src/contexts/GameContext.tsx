import { createContext, useContext, useState, ReactNode } from 'react';
import confetti from 'canvas-confetti';

export type Player = 'X' | 'O' | null;
export type GameMode = 'human' | 'ai';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'unbeatable';
export type WinAnimation = 'none' | 'confetti' | 'sparkle' | 'glow';

export interface GameTheme {
  id: string;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  xColor: string;
  oColor: string;
  boardBg: string;
  enableBoxFill: boolean;
}

export interface GameSettings {
  theme: GameTheme;
  gameMode: GameMode;
  difficulty: Difficulty;
  winAnimation: WinAnimation;
  showGameStatus: boolean;
  enableAnimations: boolean;
  gridFontSize: 'very-small' | 'small' | 'medium' | 'large' | 'very-large';
}

interface GameContextType {
  board: Player[];
  currentPlayer: Player;
  winner: Player;
  winningLine: number[] | null;
  gameSettings: GameSettings;
  gameStats: {
    xWins: number;
    oWins: number;
    draws: number;
  };
  persistentStats: {
    xWins: number;
    oWins: number;
    draws: number;
  };
  isAiThinking: boolean;
  makeMove: (index: number) => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  triggerWinAnimation: () => void;
  resetStats: () => void;
  resetPersistentStats: () => void;
}

const defaultThemes: GameTheme[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: '',
    primary: '#3B82F6',
    secondary: '#EF4444',
    accent: '#F59E0B',
    xColor: '#1A73E8',
    oColor: '#EA4335',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
  },
  {
    id: 'modern',
    name: 'Modern',
    description: '',
    primary: '#3B82F6',
    secondary: '#DB34F2',
    accent: '#FF375F',
    xColor: '#DB34F2',
    oColor: '#FF375F',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
  },
  {
    id: 'neon',
    name: 'Neon',
    description: '',
    primary: '#3B82F6',
    secondary: '#30D158',
    accent: '#FFD600',
    xColor: '#30D158',
    oColor: '#FFD600',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: '',
    primary: '#3B82F6',
    secondary: '#6B7280',
    accent: '#374151',
    xColor: '#6B7280',
    oColor: '#374151',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
  },
  {
    id: 'retro',
    name: 'Retro',
    description: '',
    primary: '#3B82F6',
    secondary: '#FF9230',
    accent: '#DB34F2',
    xColor: '#FF9230',
    oColor: '#DB34F2',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
  },
];

const defaultSettings: GameSettings = {
  theme: defaultThemes[0],
  gameMode: 'human',
  difficulty: 'medium',
  winAnimation: 'confetti',
  showGameStatus: false,
  enableAnimations: true,
  gridFontSize: 'medium',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const loadSavedSettings = (): GameSettings => {
    try {
      const saved = localStorage.getItem('tic-tac-toe-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  };

  const loadSavedStats = () => {
    return { xWins: 0, oWins: 0, draws: 0 };
  };

  const loadPersistentStats = () => {
    try {
      const saved = localStorage.getItem('tic-tac-toe-persistent-stats');
      return saved ? JSON.parse(saved) : { xWins: 0, oWins: 0, draws: 0 };
    } catch {
      return { xWins: 0, oWins: 0, draws: 0 };
    }
  };

  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings>(loadSavedSettings());
  const [gameStats, setGameStats] = useState(loadSavedStats());
  const [persistentStats, setPersistentStats] = useState(loadPersistentStats());
  const [isAiThinking, setIsAiThinking] = useState(false);

  const checkWinner = (squares: Player[]): { winner: Player; line: number[] | null } => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }

    return { winner: null, line: null };
  };

  const getBestMove = (squares: Player[], difficulty: Difficulty): number => {
    const availableMoves = squares.map((square, index) => square === null ? index : null).filter(val => val !== null) as number[];
    
    if (difficulty === 'easy') {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    const minimax = (squares: Player[], depth: number, isMaximizing: boolean, alpha: number = -Infinity, beta: number = Infinity): number => {
      const { winner } = checkWinner(squares);
      
      if (winner === 'O') return 10 - depth;
      if (winner === 'X') return depth - 10;
      if (squares.every(square => square !== null)) return 0;
      
      if (difficulty === 'medium' && depth > 4) return 0;
      if (difficulty === 'hard' && depth > 6) return 0;

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (squares[i] === null) {
            squares[i] = 'O';
            const score = minimax(squares, depth + 1, false, alpha, beta);
            squares[i] = null;
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (squares[i] === null) {
            squares[i] = 'X';
            const score = minimax(squares, depth + 1, true, alpha, beta);
            squares[i] = null;
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, score);
            if (beta <= alpha) break;
          }
        }
        return bestScore;
      }
    };

    let bestMove = availableMoves[0];
    let bestScore = -Infinity;

    for (const move of availableMoves) {
      const newSquares = [...squares];
      newSquares[move] = 'O';
      const score = minimax(newSquares, 0, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    return bestMove;
  };

  const makeMove = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const { winner: gameWinner, line } = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinningLine(line);
      const newStats = {
        ...gameStats,
        ...(gameWinner === 'X' ? { xWins: gameStats.xWins + 1 } : { oWins: gameStats.oWins + 1 })
      };
      setGameStats(newStats);
      
      const newPersistentStats = {
        ...persistentStats,
        ...(gameWinner === 'X' ? { xWins: persistentStats.xWins + 1 } : { oWins: persistentStats.oWins + 1 })
      };
      setPersistentStats(newPersistentStats);
      localStorage.setItem('tic-tac-toe-persistent-stats', JSON.stringify(newPersistentStats));
      
      triggerWinAnimation();
      return;
    }

    if (newBoard.every(square => square !== null)) {
      const newStats = { ...gameStats, draws: gameStats.draws + 1 };
      setGameStats(newStats);
      
      const newPersistentStats = { ...persistentStats, draws: persistentStats.draws + 1 };
      setPersistentStats(newPersistentStats);
      localStorage.setItem('tic-tac-toe-persistent-stats', JSON.stringify(newPersistentStats));
      
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    if (gameSettings.gameMode === 'ai' && nextPlayer === 'O') {
      setIsAiThinking(true);
      setTimeout(() => {
        const aiMove = getBestMove(newBoard, gameSettings.difficulty);
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);

        const { winner: aiWinner, line: aiLine } = checkWinner(aiBoard);
        if (aiWinner) {
          setWinner(aiWinner);
          setWinningLine(aiLine);
          const newStats = { ...gameStats, oWins: gameStats.oWins + 1 };
          setGameStats(newStats);
          
          const newPersistentStats = { ...persistentStats, oWins: persistentStats.oWins + 1 };
          setPersistentStats(newPersistentStats);
          localStorage.setItem('tic-tac-toe-persistent-stats', JSON.stringify(newPersistentStats));
          
          triggerWinAnimation();
          setIsAiThinking(false);
          return;
        }

        if (aiBoard.every(square => square !== null)) {
          const newStats = { ...gameStats, draws: gameStats.draws + 1 };
          setGameStats(newStats);
          
          const newPersistentStats = { ...persistentStats, draws: persistentStats.draws + 1 };
          setPersistentStats(newPersistentStats);
          localStorage.setItem('tic-tac-toe-persistent-stats', JSON.stringify(newPersistentStats));
          
          setIsAiThinking(false);
          return;
        }

        setCurrentPlayer('X');
        setIsAiThinking(false);
      }, 800);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setWinningLine(null);
    setIsAiThinking(false);
  };

  const updateSettings = (settings: Partial<GameSettings>) => {
    const newSettings = { ...gameSettings, ...settings };
    setGameSettings(newSettings);
    localStorage.setItem('tic-tac-toe-settings', JSON.stringify(newSettings));
  };

  const triggerWinAnimation = () => {
    switch (gameSettings.winAnimation) {
      case 'confetti':
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        break;
      case 'sparkle':
        break;
      case 'glow':
        break;
      case 'none':
        break;
    }
  };

  const resetStats = () => {
    const newStats = { xWins: 0, oWins: 0, draws: 0 };
    setGameStats(newStats);
  };

  const resetPersistentStats = () => {
    const newPersistentStats = { xWins: 0, oWins: 0, draws: 0 };
    setPersistentStats(newPersistentStats);
    localStorage.setItem('tic-tac-toe-persistent-stats', JSON.stringify(newPersistentStats));
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
        resetStats,
        resetPersistentStats,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export { defaultThemes };