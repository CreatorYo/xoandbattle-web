import type { GameTheme } from '@/contexts/GameContext';
import { normalizeHex } from '@/lib/utils';

export const PRESET_NAME_LIMIT = 35;
export const PRESET_DESCRIPTION_LIMIT = 200;
export const PRESET_SYMBOL_LIMIT = 2;

const text = (value: unknown, limit: number) => (typeof value === 'string' ? value.slice(0, limit) : undefined);

export function sanitizePreset(value: unknown): GameTheme | null {
  if (!value || typeof value !== 'object') return null;
  const theme = value as Record<string, unknown>;
  const name = typeof theme.name === 'string' ? theme.name.trim() : '';
  const xColor = typeof theme.xColor === 'string' ? normalizeHex(theme.xColor) : null;
  const oColor = typeof theme.oColor === 'string' ? normalizeHex(theme.oColor) : null;
  if (typeof theme.id !== 'string' || !theme.id || !name || !xColor || !oColor) return null;

  return {
    id: theme.id,
    name: name.slice(0, PRESET_NAME_LIMIT),
    description: text(theme.description, PRESET_DESCRIPTION_LIMIT) ?? '',
    xColor,
    oColor,
    enableBoxFill: theme.enableBoxFill === true,
    xSymbol: text(theme.xSymbol, PRESET_SYMBOL_LIMIT),
    oSymbol: text(theme.oSymbol, PRESET_SYMBOL_LIMIT),
  };
}

export function sanitizePresets(values: unknown): GameTheme[] {
  if (!Array.isArray(values)) return [];
  return values.map(sanitizePreset).filter((theme): theme is GameTheme => theme !== null);
}

export function nextDuplicateName(theme: GameTheme, existing: GameTheme[]) {
  const baseName = theme.name.replace(/\s*\(x\d+\)$/, '');
  const highest = existing.reduce((max, candidate) => {
    if (candidate.name.replace(/\s*\(x\d+\)$/, '') !== baseName) return max;
    const match = candidate.name.match(/\(x(\d+)\)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);
  return `${baseName} (x${highest + 1})`;
}
