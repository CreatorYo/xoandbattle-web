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
  localStorage.removeItem('tic-tac-toe-disable-tabindex');
  document.body.classList.remove('reduce-motion');
  
  // Remove the disable tabindex style if it exists
  const styleElement = document.getElementById('disable-tabindex-style');
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
  }
}

export function getDefaultAppearanceTheme(): 'system' {
  return 'system';
}

export function resetAllLocalStorageSettings(): void {
  try {
    localStorage.removeItem('tic-tac-toe-reorder-mode');
    localStorage.removeItem('tic-tac-toe-pause-achievements');
    localStorage.removeItem('tic-tac-toe-sidebar-collapsed');
    localStorage.setItem('tic-tac-toe-app-theme-color', '#3b82f6');
    window.dispatchEvent(new Event('reorder-mode-reset'));
  } catch (error) {
    console.error('Failed to reset localStorage settings:', error);
  }
}

