import { defaultThemes } from '@/contexts/GameContext';
import type { GameSettings } from '@/contexts/GameContext';

export const defaultGameSettings: Partial<GameSettings> = {
  gameMode: 'human',
  difficulty: 'medium',
  winAnimation: 'confetti',
  theme: defaultThemes[0],
  showGameStatus: false,
  gameStatusPosition: 'left',
  enableAnimations: true,
  gridFontSize: 'medium',
  boardStyling: {
    style: 'standard',
    borderRadius: 12,
    borderWidth: 0,
    borderColor: '#000000',
    backgroundColor: 'transparent',
    useGradient: false,
    gradientColors: ['#3B82F6', '#8B5CF6'],
  },
};

export function getDefaultGameSettings(): Partial<GameSettings> {
  return { ...defaultGameSettings };
}

export function resetAccessibilitySettings(): void {
  localStorage.removeItem('tic-tac-toe-reduce-motion');
  document.body.classList.remove('reduce-motion');
}

export function getDefaultAppearanceTheme(): 'system' {
  return 'system';
}

