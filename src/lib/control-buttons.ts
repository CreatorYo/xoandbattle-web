import { Gamepad2, RotateCcw, Settings, type LucideIcon } from 'lucide-react';
import type { GameTheme } from '@/contexts/GameContext';

export type ControlButtonId = 'reset' | 'mode' | 'settings';
export type ControlColors = Record<ControlButtonId, string>;

const CLASSIC_CONTROL_COLORS: ControlColors = { reset: '#ef4444', mode: '#3b82f6', settings: '#22c55e' };
export const DEFAULT_CONTROL_COLORS: ControlColors = { reset: '#d16b6b', mode: '#6a8fd4', settings: '#5fa57b' };

export const CONTROL_BUTTONS: { id: ControlButtonId; label: string; icon: LucideIcon }[] = [
  { id: 'reset', label: 'Reset Game', icon: RotateCcw },
  { id: 'mode', label: 'Game Mode', icon: Gamepad2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface ControlStyle {
  custom: boolean;
  synced: boolean;
  colors: ControlColors;
  theme: Pick<GameTheme, 'xColor' | 'oColor'>;
}

export function resolveControlColors({ custom, synced, colors, theme }: ControlStyle): ControlColors {
  if (!custom) return CLASSIC_CONTROL_COLORS;
  if (!synced) return colors;
  return {
    reset: theme.xColor,
    mode: `color-mix(in oklab, ${theme.xColor}, ${theme.oColor})`,
    settings: theme.oColor,
  };
}
