import { defaultSettings, type CountedStat, type GameSettings, type PersistentStats } from '@/contexts/GameContext';
import { sanitizePreset } from '@/lib/presets';

const SETTINGS_KEY = 'tic-tac-toe-settings';
const STATS_KEY = 'tic-tac-toe-persistent-stats';

export const emptyStats = (): PersistentStats => ({
  xWins: 0,
  oWins: 0,
  draws: 0,
  gamesPlayed: 0,
  easyWins: 0,
  mediumWins: 0,
  hardWins: 0,
  unbeatableWins: 0,
});

function readJson(key: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(key) ?? 'null');
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

export function loadSettings(): GameSettings {
  const saved = readJson(SETTINGS_KEY);
  if (!saved) return defaultSettings;
  const boardStyling = saved.boardStyling && typeof saved.boardStyling === 'object' ? saved.boardStyling : null;
  return {
    ...defaultSettings,
    ...saved,
    theme: sanitizePreset(saved.theme) ?? defaultSettings.theme,
    boardStyling: { ...defaultSettings.boardStyling, ...boardStyling },
  };
}

export function loadPersistentStats(): PersistentStats {
  const saved = readJson(STATS_KEY);
  const stats = { ...saved, ...emptyStats() } as PersistentStats;
  if (!saved) return stats;
  for (const key of Object.keys(emptyStats()) as CountedStat[]) {
    const value = Number(saved[key]);
    stats[key] = Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  }
  return stats;
}

export function saveSettings(settings: GameSettings) {
  save(SETTINGS_KEY, settings);
}

export function savePersistentStats(stats: PersistentStats) {
  save(STATS_KEY, stats);
}
