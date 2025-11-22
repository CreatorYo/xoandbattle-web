import { defaultThemes } from '@/contexts/GameContext';
import type { GameSettings } from '@/contexts/GameContext';

/**
 * Default game settings values
 */
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

/**
 * Resets all game settings to default values
 */
export function getDefaultGameSettings(): Partial<GameSettings> {
  return { ...defaultGameSettings };
}

/**
 * Resets accessibility settings
 * Removes reduce motion from localStorage and DOM
 */
export function resetAccessibilitySettings(): void {
  localStorage.removeItem('tic-tac-toe-reduce-motion');
  document.body.classList.remove('reduce-motion');
}

/**
 * Resets appearance theme to system
 */
export function getDefaultAppearanceTheme(): 'system' {
  return 'system';
}

