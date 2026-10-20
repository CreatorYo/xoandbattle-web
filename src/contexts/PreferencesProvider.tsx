import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import {
  DEFAULT_ACCENT,
  PreferencesContext,
  type PreferencesContextValue,
  type PreferencesState,
} from '@/contexts/PreferencesContext';
import { getPastelBase, getReadableForeground, normalizeHex } from '@/lib/utils';
import { withoutTransitions } from '@/lib/motion';
import { stopSpeaking } from '@/lib/speech';
import { DEFAULT_CONTROL_COLORS, type ControlColors } from '@/lib/control-buttons';

const DEFAULT_GLASS_TINT = 65;
const SYSTEM_BAR_COLORS = { light: '#f2f2f7', dark: '#000000' } as const;

const KEYS = {
  accent: 'tic-tac-toe-app-theme-color',
  glassTint: 'tic-tac-toe-glass-tint',
  reduceMotion: 'tic-tac-toe-reduce-motion',
  hideFocusOutlines: 'tic-tac-toe-hide-focus-outlines',
  readAloud: 'tic-tac-toe-read-aloud',
  pauseAchievements: 'tic-tac-toe-pause-achievements',
  statusBarSynced: 'tic-tac-toe-status-bar-synced',
  statusBarColor: 'tic-tac-toe-status-bar-color',
  customControlButtons: 'tic-tac-toe-custom-control-buttons',
  controlColorsSynced: 'tic-tac-toe-control-colors-synced',
  controlColors: 'tic-tac-toe-control-colors',
} as const;

const DEFAULT_PREFERENCES: PreferencesState = {
  accentColor: DEFAULT_ACCENT,
  glassTint: DEFAULT_GLASS_TINT,
  reduceMotion: false,
  hideFocusOutlines: false,
  readAloud: false,
  pauseAchievements: false,
  statusBarSynced: false,
  statusBarColor: null,
  customControlButtons: false,
  controlColorsSynced: false,
  controlColors: DEFAULT_CONTROL_COLORS,
};

const clampTint = (value: number) => Math.round(Math.min(100, Math.max(0, value)));
const glassTintToOpacity = (value: number) => `${Math.round(40 + clampTint(value) * 0.58)}%`;

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
}

function readNumber(key: string, fallback: number) {
  const stored = read(key);
  const parsed = Number(stored);
  return stored !== null && Number.isFinite(parsed) ? clampTint(parsed) : fallback;
}

function readControlColors(): ControlColors {
  try {
    const parsed: unknown = JSON.parse(read(KEYS.controlColors) ?? 'null');
    const stored = parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    const colorFor = (id: keyof ControlColors) =>
      (typeof stored[id] === 'string' && normalizeHex(stored[id])) || DEFAULT_CONTROL_COLORS[id];
    return { reset: colorFor('reset'), mode: colorFor('mode'), settings: colorFor('settings') };
  } catch {
    return DEFAULT_CONTROL_COLORS;
  }
}

function loadPreferences(): PreferencesState {
  return {
    accentColor: normalizeHex(read(KEYS.accent) ?? '') ?? DEFAULT_ACCENT,
    glassTint: readNumber(KEYS.glassTint, DEFAULT_GLASS_TINT),
    reduceMotion: read(KEYS.reduceMotion) === 'true',
    hideFocusOutlines: read(KEYS.hideFocusOutlines) === 'true',
    readAloud: read(KEYS.readAloud) === 'true',
    pauseAchievements: read(KEYS.pauseAchievements) === 'true',
    statusBarSynced: read(KEYS.statusBarSynced) === 'true',
    statusBarColor: normalizeHex(read(KEYS.statusBarColor) ?? ''),
    customControlButtons: read(KEYS.customControlButtons) === 'true',
    controlColorsSynced: read(KEYS.controlColorsSynced) === 'true',
    controlColors: readControlColors(),
  };
}

function applyAccentColor(color: string) {
  const root = document.documentElement;
  const foreground = getReadableForeground(color);
  const pastelBase = getPastelBase(color);
  if (
    root.style.getPropertyValue('--brand') === color &&
    root.style.getPropertyValue('--brand-foreground') === foreground &&
    root.style.getPropertyValue('--brand-pastel-base') === pastelBase
  ) {
    return;
  }
  withoutTransitions(() => {
    root.style.setProperty('--brand', color);
    root.style.setProperty('--brand-foreground', foreground);
    root.style.setProperty('--brand-pastel-base', pastelBase);
  });
}

function applyStatusBarColor(color: string) {
  document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
    meta.content = color;
  });
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [state, setState] = useState<PreferencesState>(loadPreferences);

  const effectiveStatusBarColor = state.statusBarSynced
    ? state.accentColor
    : (state.statusBarColor ?? SYSTEM_BAR_COLORS[resolvedTheme]);

  useLayoutEffect(() => {
    applyAccentColor(state.accentColor);
    write(KEYS.accent, state.accentColor);
  }, [state.accentColor]);

  useLayoutEffect(() => {
    document.documentElement.style.setProperty('--glass-tint-user', glassTintToOpacity(state.glassTint));
    write(KEYS.glassTint, String(state.glassTint));
  }, [state.glassTint]);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', state.reduceMotion);
    write(KEYS.reduceMotion, String(state.reduceMotion));
  }, [state.reduceMotion]);

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('hide-focus-outlines', state.hideFocusOutlines);
    write(KEYS.hideFocusOutlines, String(state.hideFocusOutlines));
  }, [state.hideFocusOutlines]);

  useLayoutEffect(() => {
    applyStatusBarColor(effectiveStatusBarColor);
  }, [effectiveStatusBarColor]);

  useEffect(() => {
    write(KEYS.statusBarSynced, String(state.statusBarSynced));
    write(KEYS.statusBarColor, state.statusBarColor);
  }, [state.statusBarSynced, state.statusBarColor]);

  useEffect(() => {
    write(KEYS.pauseAchievements, String(state.pauseAchievements));
  }, [state.pauseAchievements]);

  useEffect(() => {
    write(KEYS.readAloud, String(state.readAloud));
    if (!state.readAloud) stopSpeaking();
  }, [state.readAloud]);

  useEffect(() => {
    write(KEYS.customControlButtons, String(state.customControlButtons));
    write(KEYS.controlColorsSynced, String(state.controlColorsSynced));
    write(KEYS.controlColors, JSON.stringify(state.controlColors));
  }, [state.customControlButtons, state.controlColorsSynced, state.controlColors]);

  const update = useCallback(<K extends keyof PreferencesState>(key: K, value: PreferencesState[K]) => {
    setState((previous) => (previous[key] === value ? previous : { ...previous, [key]: value }));
  }, []);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      ...state,
      effectiveStatusBarColor,
      setAccentColor: (color) => {
        const normalized = normalizeHex(color);
        if (normalized) update('accentColor', normalized);
      },
      setCustomControlButtons: (next) => update('customControlButtons', next),
      setControlColorsSynced: (next) => update('controlColorsSynced', next),
      setControlColor: (button, color) => {
        const normalized = normalizeHex(color);
        if (!normalized) return;
        setState((previous) =>
          previous.controlColors[button] === normalized
            ? previous
            : { ...previous, controlColors: { ...previous.controlColors, [button]: normalized } },
        );
      },
      resetControlColors: () => update('controlColors', DEFAULT_CONTROL_COLORS),
      setGlassTint: (next) => update('glassTint', clampTint(next)),
      setReduceMotion: (next) => update('reduceMotion', next),
      setHideFocusOutlines: (next) => update('hideFocusOutlines', next),
      setReadAloud: (next) => update('readAloud', next),
      setPauseAchievements: (next) => update('pauseAchievements', next),
      setStatusBarSynced: (next) => update('statusBarSynced', next),
      setStatusBarColor: (color) => {
        const normalized = normalizeHex(color);
        if (normalized) update('statusBarColor', normalized);
      },
      resetStatusBarColor: () => update('statusBarColor', null),
      resetPreferences: () => setState(DEFAULT_PREFERENCES),
    }),
    [state, effectiveStatusBarColor, update],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
