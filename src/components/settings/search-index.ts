import { getSectionMeta, type SectionId } from './sections';

export interface SearchableSetting {
  id: string;
  label: string;
  section: SectionId;
  keywords?: string[];
  fallbackId?: string;
}

const SETTINGS_INDEX: SearchableSetting[] = [
  { id: 'colour-mode', label: 'Light, Dark or System', section: 'appearance', keywords: ['appearance', 'theme', 'dark mode', 'light mode', 'night', 'colour mode', 'color mode'] },
  { id: 'liquid-glass', label: 'Liquid Glass', section: 'appearance', keywords: ['glass', 'transparency', 'clear', 'tinted', 'blur', 'see-through'] },
  { id: 'accent-colour', label: 'Accent Colour', section: 'appearance', keywords: ['accent', 'color', 'colour', 'tint', 'brand', 'highlight'] },
  { id: 'board-shape', label: 'Board Shape', section: 'appearance', keywords: ['board', 'standard', 'rounded', 'custom', 'squares', 'corners'] },
  { id: 'customise-board', label: 'Customise Board', section: 'appearance', keywords: ['board', 'border', 'radius', 'gradient', 'fill', 'custom'], fallbackId: 'board-shape' },
  { id: 'control-buttons', label: 'Control Buttons', section: 'appearance', keywords: ['advanced', 'custom control buttons', 'reset', 'game mode', 'settings', 'classic', 'glow', 'sync', 'preset', 'colour', 'color'] },

  { id: 'themes-list', label: 'Themes', section: 'themes', keywords: ['theme', 'classic', 'modern', 'neon', 'minimal', 'retro', 'colours', 'colors', 'x colour', 'o colour'] },
  { id: 'custom-presets', label: 'Custom Presets', section: 'themes', keywords: ['preset', 'custom', 'my themes', 'symbols', 'emoji'] },
  { id: 'add-preset', label: 'Add Preset', section: 'themes', keywords: ['new', 'create', 'preset', 'theme'], fallbackId: 'custom-presets' },
  { id: 'reorder-presets', label: 'Reorder Presets', section: 'themes', keywords: ['reorder', 'sort', 'arrange', 'drag'], fallbackId: 'custom-presets' },

  { id: 'game-mode', label: 'Game Mode', section: 'gameplay', keywords: ['two player', 'ai', 'computer', 'friend', 'opponent', 'mode', 'single player'] },
  { id: 'ai-difficulty', label: 'AI Difficulty', section: 'gameplay', keywords: ['easy', 'medium', 'hard', 'unbeatable', 'difficulty', 'level'] },
  { id: 'game-status-panel', label: 'Game Status Panel', section: 'gameplay', keywords: ['score', 'turn', 'status', 'panel', 'display'] },
  { id: 'panel-position', label: 'Panel Position', section: 'gameplay', keywords: ['left', 'right', 'position', 'panel'], fallbackId: 'game-status-panel' },

  { id: 'sound-effects', label: 'Sound Effects', section: 'effects', keywords: ['sound', 'audio', 'mute', 'volume', 'noise'] },
  { id: 'enable-animations', label: 'Enable Animations', section: 'effects', keywords: ['animation', 'motion', 'pieces'] },
  { id: 'win-animation', label: 'Win Animation', section: 'effects', keywords: ['confetti', 'sparkle', 'glow', 'celebration', 'win'] },

  { id: 'game-performance', label: 'Game Performance', section: 'awards', keywords: ['stats', 'statistics', 'wins', 'draws', 'games played', 'score', 'achievements'] },
  { id: 'ai-wins', label: 'AI Wins', section: 'awards', keywords: ['easy', 'medium', 'hard', 'unbeatable', 'wins', 'achievements'] },
  { id: 'pause-achievements', label: 'Pause Achievements', section: 'awards', keywords: ['pause', 'tracking', 'stats'] },
  { id: 'reset-awards', label: 'Reset All Awards', section: 'awards', keywords: ['reset', 'clear', 'stats', 'achievements'] },

  { id: 'reduce-motion', label: 'Reduce Motion', section: 'accessibility', keywords: ['motion', 'animation', 'vestibular', 'blur', 'transparency', 'sensitivity'] },
  { id: 'grid-font-size', label: 'Grid Font Size', section: 'accessibility', keywords: ['font', 'text', 'size', 'symbols', 'large', 'small', 'bigger'] },
  { id: 'read-aloud', label: 'Read Aloud', section: 'accessibility', keywords: ['speech', 'speak', 'voice', 'narrate', 'announce', 'text to speech', 'tts', 'turn', 'winner'] },
  { id: 'focus-outlines', label: 'Disable Focus Outlines', section: 'accessibility', keywords: ['focus', 'outline', 'keyboard', 'tab'] },

  { id: 'status-bar-sync', label: 'Sync Status Bar with Accent', section: 'app', keywords: ['status bar', 'pwa', 'installed', 'sync'] },
  { id: 'status-bar-colour', label: 'Status Bar Colour', section: 'app', keywords: ['status bar', 'colour', 'color', 'pwa'] },

  { id: 'export-themes', label: 'Export Themes', section: 'data', keywords: ['export', 'backup', 'download', 'json', 'presets'] },
  { id: 'import-themes', label: 'Import Themes', section: 'data', keywords: ['import', 'restore', 'upload', 'json', 'presets'] },
  { id: 'reset-settings', label: 'Reset All Settings', section: 'data', keywords: ['reset', 'default', 'restore', 'factory'] },
  { id: 'delete-presets', label: 'Delete Presets', section: 'data', keywords: ['delete', 'remove', 'presets', 'clear'] },

  { id: 'onboarding-tour', label: 'Onboarding Tour', section: 'about', keywords: ['tour', 'welcome', 'intro', 'tutorial', 'help'] },
  { id: 'how-to-play', label: 'How to Play', section: 'about', keywords: ['rules', 'help', 'instructions', 'guide'] },
  { id: 'get-app', label: 'Get the App', section: 'about', keywords: ['download', 'app store', 'microsoft store', 'ios', 'windows'], fallbackId: 'version' },
  { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', section: 'about', keywords: ['keyboard', 'shortcuts', 'keys', 'hotkeys'], fallbackId: 'version' },
  { id: 'version', label: 'Version', section: 'about', keywords: ['version', 'about', 'build'] },
];

export function searchSettings(query: string, availableSections: ReadonlySet<SectionId>): SearchableSetting[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const phrase = terms.join(' ');

  return SETTINGS_INDEX.filter((setting) => availableSections.has(setting.section))
    .map((setting) => {
      const label = setting.label.toLowerCase();
      const haystack = [label, getSectionMeta(setting.section).label.toLowerCase(), ...(setting.keywords ?? [])].join(' ');
      if (!terms.every((term) => haystack.includes(term))) return null;
      const rank = label.startsWith(phrase) ? 0 : label.includes(phrase) ? 1 : 2;
      return { setting, rank };
    })
    .filter((result): result is { setting: SearchableSetting; rank: number } => result !== null)
    .sort((a, b) => a.rank - b.rank)
    .map((result) => result.setting);
}
