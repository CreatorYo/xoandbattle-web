import { createContext, useContext } from 'react';

export type Player = 'X' | 'O' | null;
export type GameMode = 'human' | 'ai';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'unbeatable';
export type WinAnimation = 'none' | 'confetti' | 'sparkle' | 'glow';

export interface GameTheme {
  id: string;
  name: string;
  description: string;
  xColor: string;
  oColor: string;
  enableBoxFill: boolean;
  xSymbol?: string;
  oSymbol?: string;
}

export interface BoardStyling {
  style: 'standard' | 'rounded' | 'custom';
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  useGradient?: boolean;
  gradientColors?: string[];
}

export interface GameSettings {
  theme: GameTheme;
  gameMode: GameMode;
  difficulty: Difficulty;
  winAnimation: WinAnimation;
  showGameStatus: boolean;
  gameStatusPosition: 'left' | 'right';
  enableAnimations: boolean;
  enableSounds: boolean;
  gridFontSize: 'very-small' | 'small' | 'medium' | 'large' | 'very-large';
  boardStyling: BoardStyling;
}

export type CountedStat =
  | 'xWins'
  | 'oWins'
  | 'draws'
  | 'gamesPlayed'
  | 'easyWins'
  | 'mediumWins'
  | 'hardWins'
  | 'unbeatableWins';

export type PersistentStats = Record<CountedStat, number> &
  Partial<Record<`${CountedStat}FirstAchieved` | `${CountedStat}LastUpdated`, string>>;

export interface SessionStats {
  xWins: number;
  oWins: number;
  draws: number;
}

interface GameContextValue {
  board: Player[];
  currentPlayer: Player;
  winner: Player;
  winningLine: number[] | null;
  gameSettings: GameSettings;
  gameStats: SessionStats;
  persistentStats: PersistentStats;
  isAiThinking: boolean;
  makeMove: (index: number) => void;
  resetGame: () => void;
  updateSettings: (settings: Partial<GameSettings>) => void;
  triggerWinAnimation: (winner?: Player) => void;
  resetPersistentStats: () => void;
  updatePersistentStats: (stats: PersistentStats) => void;
}

export const defaultThemes: GameTheme[] = [
  { id: 'classic', name: 'Classic', description: '', xColor: '#1A73E8', oColor: '#EA4335', enableBoxFill: false },
  { id: 'modern', name: 'Modern', description: '', xColor: '#DB34F2', oColor: '#FF375F', enableBoxFill: false },
  { id: 'neon', name: 'Neon', description: '', xColor: '#30D158', oColor: '#FFD600', enableBoxFill: false },
  { id: 'minimal', name: 'Minimal', description: '', xColor: '#6B7280', oColor: '#374151', enableBoxFill: false },
  { id: 'retro', name: 'Retro', description: '', xColor: '#FF9230', oColor: '#DB34F2', enableBoxFill: false },
];

export const defaultSettings: GameSettings = {
  theme: defaultThemes[0],
  gameMode: 'human',
  difficulty: 'medium',
  winAnimation: 'confetti',
  showGameStatus: false,
  gameStatusPosition: 'left',
  enableAnimations: true,
  enableSounds: false,
  gridFontSize: 'medium',
  boardStyling: {
    style: 'standard',
    borderRadius: 12,
    borderWidth: 0,
    borderColor: '#000000',
    backgroundColor: 'transparent',
    useGradient: false,
    gradientColors: ['#3b82f6', '#8b5cf6'],
  },
};

export const GameContext = createContext<GameContextValue | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
