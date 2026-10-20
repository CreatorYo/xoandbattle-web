import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const isApple = /iPhone|iPad|iPod|Macintosh/.test(window.navigator.userAgent);
const isWindows = !isApple && /Windows/i.test(window.navigator.userAgent);

export const MODIFIER_KEY = isApple ? '⌘' : 'Ctrl';

export const APP_STORE = isWindows
  ? { name: 'Microsoft Store', url: 'https://apps.microsoft.com/detail/9nk0184bmx07' }
  : { name: 'App Store', url: 'https://apps.apple.com/app/id6745736399' };

export function normalizeHex(value: string): string | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  let hex = match[1].toLowerCase();
  if (hex.length === 3) {
    hex = hex.split('').map((char) => char + char).join('');
  }
  return `#${hex}`;
}

function relativeLuminance(hex: string): number | null {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const channel = (offset: number) => {
    const value = parseInt(normalized.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

export function getReadableForeground(hex: string): string {
  const luminance = relativeLuminance(hex);
  if (luminance === null) return '#ffffff';
  return 1.05 / (luminance + 0.05) >= 3 ? '#ffffff' : '#0b0b0f';
}

export function getPastelBase(hex: string): string {
  const luminance = relativeLuminance(hex);
  return luminance === null || luminance <= 0.45 ? '#ffffff' : '#0b0b0f';
}

export function isModalOpen(): boolean {
  return document.querySelector('[role="dialog"], [role="alertdialog"]') !== null;
}

export function isTypingOrMenuTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return true;
  return target.closest('[role="menu"], [role="listbox"]') !== null;
}

export function formatDateTime(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
