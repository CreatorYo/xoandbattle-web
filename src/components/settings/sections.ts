import type { ComponentType } from 'react';
import { Accessibility, AppWindow, Database, Gamepad2, Info, Palette, Sparkles, SunMoon, Trophy } from 'lucide-react';

export type SectionId =
  | 'appearance'
  | 'themes'
  | 'gameplay'
  | 'effects'
  | 'awards'
  | 'accessibility'
  | 'app'
  | 'data'
  | 'about';

export type ModalSectionId = 'themes';
export type PageSectionId = Exclude<SectionId, ModalSectionId>;

export function isModalSection(id: SectionId): id is ModalSectionId {
  return id === 'themes';
}

interface SectionMeta {
  id: SectionId;
  label: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
}

export interface SectionGroup {
  label: string;
  sections: SectionMeta[];
}

export const SECTION_GROUPS: SectionGroup[] = [
  {
    label: 'Personalise',
    sections: [
      { id: 'appearance', label: 'Appearance', icon: SunMoon, color: '#007aff' },
      { id: 'themes', label: 'Themes', icon: Palette, color: '#af52de' },
    ],
  },
  {
    label: 'Play',
    sections: [
      { id: 'gameplay', label: 'Gameplay', icon: Gamepad2, color: '#34c759' },
      { id: 'effects', label: 'Sound & Effects', icon: Sparkles, color: '#ff2d55' },
      { id: 'awards', label: 'Awards', icon: Trophy, color: '#ff9500' },
    ],
  },
  {
    label: 'General',
    sections: [
      { id: 'accessibility', label: 'Accessibility', icon: Accessibility, color: '#0a84ff' },
      { id: 'app', label: 'App', icon: AppWindow, color: '#5856d6' },
      { id: 'data', label: 'Data', icon: Database, color: '#8e8e93' },
      { id: 'about', label: 'About', icon: Info, color: '#8e8e93' },
    ],
  },
];

export const ALL_SECTIONS = SECTION_GROUPS.flatMap((group) => group.sections);

export function getSectionMeta(id: SectionId): SectionMeta {
  return ALL_SECTIONS.find((section) => section.id === id)!;
}

export function parseSectionParam(value: string | null): SectionId | null {
  return ALL_SECTIONS.find((section) => section.id === value)?.id ?? null;
}
