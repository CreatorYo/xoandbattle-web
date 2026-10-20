import { createContext, useContext } from 'react';
import type { ControlButtonId, ControlColors } from '@/lib/control-buttons';

export const DEFAULT_ACCENT = '#3b82f6';

export interface PreferencesState {
  accentColor: string;
  glassTint: number;
  reduceMotion: boolean;
  hideFocusOutlines: boolean;
  readAloud: boolean;
  pauseAchievements: boolean;
  statusBarSynced: boolean;
  statusBarColor: string | null;
  customControlButtons: boolean;
  controlColorsSynced: boolean;
  controlColors: ControlColors;
}

export interface PreferencesContextValue extends PreferencesState {
  effectiveStatusBarColor: string;
  setAccentColor: (color: string) => void;
  setCustomControlButtons: (value: boolean) => void;
  setControlColorsSynced: (value: boolean) => void;
  setControlColor: (button: ControlButtonId, color: string) => void;
  resetControlColors: () => void;
  setGlassTint: (value: number) => void;
  setReduceMotion: (value: boolean) => void;
  setHideFocusOutlines: (value: boolean) => void;
  setReadAloud: (value: boolean) => void;
  setPauseAchievements: (value: boolean) => void;
  setStatusBarSynced: (value: boolean) => void;
  setStatusBarColor: (color: string) => void;
  resetStatusBarColor: () => void;
  resetPreferences: () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
