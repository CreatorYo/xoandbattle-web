import type { BoardStyling } from '@/contexts/GameContext';

export const DEFAULT_GRADIENT = ['#3b82f6', '#8b5cf6'];

export const DEFAULT_CUSTOM_STYLING: BoardStyling = {
  style: 'custom',
  borderRadius: 12,
  borderWidth: 0,
  borderColor: '#000000',
  backgroundColor: 'transparent',
  useGradient: false,
  gradientColors: DEFAULT_GRADIENT,
};

export function presetStyling(style: 'standard' | 'rounded', current: BoardStyling): BoardStyling {
  return {
    ...current,
    style,
    borderRadius: style === 'rounded' ? 24 : 12,
    borderWidth: 0,
    borderColor: '#000000',
    backgroundColor: 'transparent',
    useGradient: false,
  };
}

export function toCustomStyling(current: BoardStyling): BoardStyling {
  if (current.style === 'custom') return current;
  return {
    ...DEFAULT_CUSTOM_STYLING,
    borderWidth: current.borderWidth ?? 0,
    borderColor: current.borderColor || '#000000',
    gradientColors: current.gradientColors?.length === 2 ? current.gradientColors : DEFAULT_GRADIENT,
  };
}

export function isDefaultCustomStyling(styling: BoardStyling): boolean {
  const gradient = styling.gradientColors ?? DEFAULT_GRADIENT;
  return (
    (styling.borderRadius ?? 12) === 12 &&
    (styling.borderWidth ?? 0) === 0 &&
    (styling.borderColor || '#000000').toLowerCase() === '#000000' &&
    (styling.backgroundColor || 'transparent') === 'transparent' &&
    !styling.useGradient &&
    gradient[0].toLowerCase() === DEFAULT_GRADIENT[0] &&
    gradient[1].toLowerCase() === DEFAULT_GRADIENT[1]
  );
}

export function describeStyling(styling: BoardStyling): string {
  const parts = [`${styling.borderRadius ?? 12}px corners`];
  const border = styling.borderWidth ?? 0;
  parts.push(border > 0 ? `${border}px border` : 'no border');
  if (styling.useGradient) parts.push('gradient fill');
  else if (styling.backgroundColor && styling.backgroundColor !== 'transparent') parts.push('solid fill');
  return parts.join(' · ');
}
