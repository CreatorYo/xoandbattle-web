import { useCallback, useEffect, useState } from 'react';
import type { GameTheme } from '@/contexts/GameContext';
import { sanitizePresets } from '@/lib/presets';

const STORAGE_KEY = 'tic-tac-toe-custom-themes';
const CHANGE_EVENT = 'xobattle:custom-themes-change';

export function readCustomThemes(): GameTheme[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? sanitizePresets(JSON.parse(saved)) : [];
  } catch (error) {
    console.error('Failed to load custom themes:', error);
    return [];
  }
}

export function writeCustomThemes(themes: GameTheme[]) {
  try {
    if (themes.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
  } catch (error) {
    console.error('Failed to save custom themes:', error);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function useCustomThemes() {
  const [themes, setThemes] = useState<GameTheme[]>(readCustomThemes);

  useEffect(() => {
    const reload = () => setThemes(readCustomThemes());
    window.addEventListener(CHANGE_EVENT, reload);
    window.addEventListener('storage', reload);
    return () => {
      window.removeEventListener(CHANGE_EVENT, reload);
      window.removeEventListener('storage', reload);
    };
  }, []);

  const save = useCallback((next: GameTheme[]) => {
    setThemes(next);
    writeCustomThemes(next);
  }, []);

  return [themes, save] as const;
}
