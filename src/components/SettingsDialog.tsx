import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast as showToast } from '@/components/ui/toast-helper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogContainer } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { SettingsSection, SettingsRow } from '@/components/ui/settings';
import { Ripple } from '@/components/ui/ripple';
import { 
  Settings, 
  Palette, 
  Layout, 
  BarChart3, 
  Zap, 
  Bot,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  RotateCw,
  Link2,
  Sun,
  Moon,
  Monitor,
  Accessibility,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  Minus,
  Trophy,
  Square,
  Circle,
  Settings as SettingsIcon,
  Gamepad2,
  Play,
  Menu,
  X,
  MoreHorizontal,
  HelpCircle,
  Smartphone,
  Keyboard,
  Info,
  Infinity,
} from 'lucide-react';
import { GameTheme } from '@/contexts/GameContext';
import { getAppStoreUrl } from '@/lib/utils';
import { CustomBoardStylingDialog } from './CustomBoardStylingDialog';
import { ThemesNavigationView } from './ThemesNavigationView';
import { cn } from '@/lib/utils';
import { getDefaultGameSettings, resetAccessibilitySettings, getDefaultAppearanceTheme, resetAllLocalStorageSettings } from '@/lib/settings-reset';
import { useIsMobile } from '@/hooks/use-mobile';
import { useIsPWA } from '@/hooks/use-pwa';
import React from 'react';

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ open: externalOpen, onOpenChange: externalOnOpenChange }: SettingsDialogProps) {
  const { gameSettings, updateSettings, persistentStats, resetPersistentStats, updatePersistentStats } = useGame();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const isPWA = useIsPWA();
  
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream;
  const isIOSPWA = isPWA && isIOS;
  const [reduceMotion, setReduceMotion] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-reduce-motion') === 'true';
    } catch {
      return false;
    }
  });

  const [pauseAchievements, setPauseAchievements] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-pause-achievements') === 'true';
    } catch {
      return false;
    }
  });

  const [disableTabIndex, setDisableTabIndex] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-disable-tabindex') === 'true';
    } catch {
      return false;
    }
  });

  const [appThemeColor, setAppThemeColor] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-app-theme-color') || '#3b82f6';
    } catch {
      return '#3b82f6';
    }
  });

  const [isStatusBarSynced, setIsStatusBarSynced] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-status-bar-synced') === 'true';
    } catch {
      return false;
    }
  });

  const [statusBarColor, setStatusBarColor] = useState(() => {
    try {
      const synced = localStorage.getItem('tic-tac-toe-status-bar-synced') === 'true';
      if (synced) {
        return localStorage.getItem('tic-tac-toe-app-theme-color') || '#3b82f6';
      }
      return localStorage.getItem('tic-tac-toe-status-bar-color') || '#000000';
    } catch {
      return '#000000';
    }
  });

  const appThemeColorInputRef = useRef<HTMLInputElement>(null);
  const statusBarColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-theme-color', appThemeColor);
    const defaultColor = '#3b82f6';
    if (appThemeColor !== defaultColor) {
      document.documentElement.setAttribute('data-theme-customized', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme-customized');
    }
  }, [appThemeColor]);

  useEffect(() => {
    if (isStatusBarSynced) {
      setStatusBarColor(appThemeColor);
      localStorage.setItem('tic-tac-toe-status-bar-color', appThemeColor);
    }
  }, [appThemeColor, isStatusBarSynced]);

  useEffect(() => {
    const updateStatusBarColor = () => {
      let lightMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]') as HTMLMetaElement;
      let darkMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]') as HTMLMetaElement;
      
      if (!lightMeta) {
        lightMeta = document.createElement('meta');
        lightMeta.name = 'theme-color';
        lightMeta.setAttribute('media', '(prefers-color-scheme: light)');
        document.head.appendChild(lightMeta);
      }
      if (!darkMeta) {
        darkMeta = document.createElement('meta');
        darkMeta.name = 'theme-color';
        darkMeta.setAttribute('media', '(prefers-color-scheme: dark)');
        document.head.appendChild(darkMeta);
      }
      
      lightMeta.content = statusBarColor;
      darkMeta.content = statusBarColor;

      const generalMeta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement;
      if (generalMeta) {
        generalMeta.content = statusBarColor;
      } else {
        const meta = document.createElement('meta');
        meta.name = 'theme-color';
        meta.content = statusBarColor;
        document.head.appendChild(meta);
      }
    };

    updateStatusBarColor();
  }, [statusBarColor]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 59, g: 130, b: 246 };
  };

  const appThemeRgb = hexToRgb(appThemeColor);
  const appThemeColorRgb = `${appThemeRgb.r}, ${appThemeRgb.g}, ${appThemeRgb.b}`;

  const [showCustomBoardDialog, setShowCustomBoardDialog] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<{
    type: 'xWins' | 'oWins' | 'draws' | 'gamesPlayed' | 'easyWins' | 'mediumWins' | 'hardWins' | 'unbeatableWins';
    label: string;
  } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('s');
      if (tab && ['appearance', 'gameplay', 'effects', 'awards', 'accessibility', 'app-settings', 'other'].includes(tab)) {
        return tab;
      }
    }
    return 'appearance';
  });
  const [internalOpen, setInternalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.has('s');
    }
    return false;
  });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResetSettingsDialog, setShowResetSettingsDialog] = useState(false);
  const [showResetThemesDialog, setShowResetThemesDialog] = useState(false);
  const [showHowToPlayDialog, setShowHowToPlayDialog] = useState(false);
  const [showExportThemesDialog, setShowExportThemesDialog] = useState(false);
  const [showThemesView, setShowThemesView] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('tic-tac-toe-sidebar-collapsed');
        return saved === 'true';
      }
    } catch {
    }
    return false;
  });

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('tic-tac-toe-sidebar-collapsed', sidebarCollapsed.toString());
      }
    } catch {
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    if (isMobile && sidebarCollapsed) {
      setSidebarCollapsed(false);
    }
  }, [isMobile, sidebarCollapsed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        if (!isMobile) {
          setSidebarCollapsed(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobile]);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (value: boolean) => {
    if (externalOnOpenChange) {
      externalOnOpenChange(value);
    } else {
      setInternalOpen(value);
    }
    
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set('s', activeSection);
      } else {
        url.searchParams.delete('s');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    localStorage.setItem('tic-tac-toe-reduce-motion', reduceMotion.toString());
  }, [reduceMotion]);

  useEffect(() => {
    localStorage.setItem('tic-tac-toe-pause-achievements', pauseAchievements.toString());
  }, [pauseAchievements]);

  useEffect(() => {
    localStorage.setItem('tic-tac-toe-disable-tabindex', disableTabIndex.toString());
    
    const styleId = 'disable-tabindex-style';
    let observer: MutationObserver | null = null;
    
    if (disableTabIndex) {
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      
      styleElement.textContent = `
        *:not(input):not(textarea):not(select) {
          outline: none !important;
          box-shadow: none !important;
        }
        *:not(input):not(textarea):not(select):focus {
          outline: none !important;
          box-shadow: none !important;
        }
        *:not(input):not(textarea):not(select):focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `;

      const removeTabIndex = () => {
        const allElements = document.querySelectorAll('[tabindex]:not(input):not(textarea):not(select)');
        allElements.forEach((el) => {
          (el as HTMLElement).removeAttribute('tabindex');
        });
      };

      removeTabIndex();
      observer = new MutationObserver(removeTabIndex);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['tabindex']
      });
    } else {
      const styleElement = document.getElementById(styleId);
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      const styleElement = document.getElementById(styleId);
      if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [disableTabIndex]);

  useEffect(() => {
    (window as any).showSettings = () => setOpen(true);
  }, [setOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.has('s') && !open) {
        setOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    if (open && typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('s', activeSection);
      window.history.replaceState({}, '', url.toString());
    }
  }, [activeSection, open]);

  const resetStatistics = () => {
    resetPersistentStats();
    setShowResetDialog(false);
    showToast.success('Awards Reset', 'All awards have been reset successfully.');
  };

  const resetSettings = () => {
    updateSettings(getDefaultGameSettings());
    
    setReduceMotion(false);
    resetAccessibilitySettings();
    
    setTheme(getDefaultAppearanceTheme());
    
    const defaultColor = '#3b82f6';
    setAppThemeColor(defaultColor);
    document.documentElement.style.setProperty('--app-theme-color', defaultColor);
    document.documentElement.removeAttribute('data-theme-customized');
    
    resetAllLocalStorageSettings();
    setSidebarCollapsed(false);
    setDisableTabIndex(false);
    
    setShowResetSettingsDialog(false);
    showToast.success(
      "Settings Reset",
      "All game settings have been reset to default values."
    );
  };

  const resetThemes = () => {
    localStorage.removeItem('tic-tac-toe-custom-themes');
    window.dispatchEvent(new Event('custom-storage-change'));
    setShowResetThemesDialog(false);
    showToast.success(
      "Presets Deleted",
      "All custom theme presets have been removed."
    );
  };

  const performExport = () => {
    try {
      const saved = localStorage.getItem('tic-tac-toe-custom-themes');
      if (!saved) {
        showToast.error(
          "Export Failed",
          "No custom presets to export."
        );
        return;
      }

      const themes: GameTheme[] = JSON.parse(saved);
      if (themes.length === 0) {
        showToast.error(
          "Export Failed",
          "No custom presets to export."
        );
        return;
      }

      const themesToExport = themes.map(({ boardBg, ...rest }) => rest);

      const dataStr = JSON.stringify(themesToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `XOBattle-Themes.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast.success(
        "Themes Exported",
        `${themes.length} custom preset${themes.length === 1 ? '' : 's'} exported successfully.`
      );
    } catch (error) {
      console.error('Failed to export themes:', error);
      showToast.error(
        "Export Failed",
        "Failed to export custom presets. Please try again."
      );
    }
  };

  const exportThemes = () => {
    setShowExportThemesDialog(true);
  };

  const importThemes = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedThemes: GameTheme[] = JSON.parse(content);

        if (!Array.isArray(importedThemes)) {
          throw new Error('Invalid file format');
        }

        if (importedThemes.length === 0) {
          showToast.error(
            "Import Failed",
            "The file contains no themes."
          );
          return;
        }

        const validThemes = importedThemes.filter(theme => 
          theme.id && 
          theme.name && 
          theme.xColor && 
          theme.oColor
        );

        if (validThemes.length === 0) {
          showToast.error(
            "Import Failed",
            "No valid themes found in the file."
          );
          return;
        }

        const existingThemes: GameTheme[] = (() => {
          try {
            const saved = localStorage.getItem('tic-tac-toe-custom-themes');
            return saved ? JSON.parse(saved) : [];
          } catch {
            return [];
          }
        })();

        const existingIds = new Set(existingThemes.map(t => t.id));
        const newThemes: GameTheme[] = [];
        const skipped: string[] = [];

        validThemes.forEach(theme => {
          if (existingIds.has(theme.id)) {
            skipped.push(theme.name);
          } else {
            const { boardBg, ...rest } = theme;
            newThemes.push(rest as GameTheme);
            existingIds.add(theme.id);
          }
        });

        const updatedThemes = [...existingThemes, ...newThemes];
        localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(updatedThemes));
        window.dispatchEvent(new Event('custom-storage-change'));

        let message = `${newThemes.length} preset${newThemes.length === 1 ? '' : 's'} imported successfully.`;
        if (skipped.length > 0) {
          message += ` ${skipped.length} preset${skipped.length === 1 ? '' : 's'} skipped (already exists).`;
        }

        showToast.success(
          "Themes Imported",
          message
        );
      } catch (error) {
        console.error('Failed to import themes:', error);
        showToast.error(
          "Import Failed",
          "Failed to import themes. Please check the file format."
        );
      }
    };

    reader.onerror = () => {
      showToast.error(
        "Import Failed",
        "Failed to read the file. Please try again."
      );
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  const importThemesInputRef = useRef<HTMLInputElement>(null);



  const sidebarItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'gameplay', label: 'Gameplay', icon: Layout },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'awards', label: 'Awards', icon: Trophy },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'other', label: 'Other', icon: MoreHorizontal },
  ];

  const appSettingsActive = activeSection === 'app-settings';

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <SettingsSection header="APPEARANCE">
              <div className="grid grid-cols-3 gap-0">
                  <div
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center py-3 border-r border-border/30 cursor-pointer active:bg-muted/50 transition-colors ${
                      theme === 'light' ? '' : 'hover:bg-muted/30'
                    }`}
                    style={theme === 'light' ? {
                      backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                    } : {}}
                    onMouseEnter={(e) => {
                      if (theme !== 'light') return;
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== 'light') return;
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                    }}
                  >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5">
                    <Sun className="h-5 w-5 text-yellow-500" />
                        </div>
                  <div className="text-[13px] font-normal text-foreground">Light</div>
                      </div>
                  <div
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center py-3 border-r border-border/30 cursor-pointer active:bg-muted/50 transition-colors ${
                      theme === 'dark' ? '' : 'hover:bg-muted/30'
                    }`}
                    style={theme === 'dark' ? {
                      backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                    } : {}}
                    onMouseEnter={(e) => {
                      if (theme !== 'dark') return;
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== 'dark') return;
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                    }}
                  >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5">
                    <Moon className="h-5 w-5 text-blue-500" />
                        </div>
                  <div className="text-[13px] font-normal text-foreground">Dark</div>
                      </div>
                  <div
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center py-3 cursor-pointer active:bg-muted/50 transition-colors ${
                      theme === 'system' ? '' : 'hover:bg-muted/30'
                    }`}
                    style={theme === 'system' ? {
                      backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                    } : {}}
                    onMouseEnter={(e) => {
                      if (theme !== 'system') return;
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      if (theme !== 'system') return;
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                    }}
                  >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mb-1.5">
                    <Monitor className="h-5 w-5 text-slate-500" />
                        </div>
                  <div className="text-[13px] font-normal text-foreground">System</div>
                      </div>
                      </div>
            </SettingsSection>
            
            <SettingsSection header="APP THEME COLOUR">
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Accent Colour
                    </label>
                    <button
                      onClick={() => {
                        const defaultColor = '#3b82f6';
                        setAppThemeColor(defaultColor);
                        localStorage.setItem('tic-tac-toe-app-theme-color', defaultColor);
                        document.documentElement.style.setProperty('--app-theme-color', defaultColor);
                        document.documentElement.removeAttribute('data-theme-customized');
                      }}
                      disabled={appThemeColor === '#3b82f6'}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
                      title={appThemeColor === '#3b82f6' ? 'Already at default colour' : 'Reset to default colour'}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="relative">
                    <div
                      className="w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 border border-border/30 hover:border-border/50"
                      style={{ backgroundColor: appThemeColor }}
                      onClick={() => appThemeColorInputRef.current?.click()}
                    />
                    <input
                      ref={appThemeColorInputRef}
                      type="color"
                      value={appThemeColor}
                        onChange={(e) => {
                          const newColor = e.target.value;
                          setAppThemeColor(newColor);
                          localStorage.setItem('tic-tac-toe-app-theme-color', newColor);
                          document.documentElement.style.setProperty('--app-theme-color', newColor);
                          const defaultColor = '#3b82f6';
                          if (newColor !== defaultColor) {
                            document.documentElement.setAttribute('data-theme-customized', 'true');
                          } else {
                            document.documentElement.removeAttribute('data-theme-customized');
                          }
                        }}
                      className="absolute top-0 left-0 w-10 h-10 opacity-0 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection header="THEMES">
              <SettingsRow
                icon={<Palette className="h-4 w-4" />}
                iconColor="bg-purple-500"
                title="Open Themes"
                subtitle="Browse and manage themes"
                onClick={() => setShowThemesView(true)}
                showChevron
              />
          </SettingsSection>
          </div>
        );


      case 'gameplay':
        const gameModeLabel = gameSettings.gameMode === 'human' ? 'Human vs Human' : 'Human vs AI';
        const difficultyLabels: Record<string, string> = {
          easy: 'Easy',
          medium: 'Medium',
          hard: 'Hard',
          unbeatable: 'Unbeatable'
        };
        
        return (
          <div className="space-y-6">
            <SettingsSection header="GAME MODE">
              <SettingsRow
                icon={gameSettings.gameMode === 'human' ? <Users className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                iconColor={gameSettings.gameMode === 'human' ? "bg-blue-500" : "bg-green-500"}
                title="Game Mode"
                subtitle={gameModeLabel}
                rightElement={
                <Select 
                  value={gameSettings.gameMode} 
                  onValueChange={(value: 'human' | 'ai') => updateSettings({ gameMode: value })}
                >
                    <SelectTrigger 
                      className="h-auto w-auto border-0 bg-transparent p-0 focus:ring-0 [&>svg]:hidden"
                      style={{ outline: 'none', boxShadow: 'none' }}
                    >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="human">Human vs Human</SelectItem>
                      <SelectItem value="ai">Human vs AI</SelectItem>
                  </SelectContent>
                </Select>
                }
                showDropdown
                isFirst
              />
              <SettingsRow
                icon={<Bot className="h-4 w-4" />}
                iconColor={
                  gameSettings.difficulty === 'easy' ? 'bg-green-500' :
                  gameSettings.difficulty === 'medium' ? 'bg-blue-500' :
                  gameSettings.difficulty === 'hard' ? 'bg-orange-500' :
                  'bg-red-500'
                }
                title="AI Difficulty"
                subtitle={difficultyLabels[gameSettings.difficulty]}
                rightElement={
                  <Select 
                    value={gameSettings.difficulty} 
                    onValueChange={(value: any) => updateSettings({ difficulty: value })}
                  >
                    <SelectTrigger 
                      className="h-auto w-auto border-0 bg-transparent p-0 focus:ring-0 [&>svg]:hidden"
                      style={{ outline: 'none', boxShadow: 'none' }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-black text-xs font-semibold">1</span>
                          <span>Easy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-black text-xs font-semibold">2</span>
                          <span>Medium</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hard">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-black text-xs font-semibold">3</span>
                          <span>Hard</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="unbeatable">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500">
                            <Infinity className="h-3 w-3 text-black" />
                          </span>
                          <span>Unbeatable</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                }
                showDropdown
                isLast
              />
            </SettingsSection>

            <SettingsSection header="BOARD STYLING">
              <div className="space-y-0">
                <div
                  onClick={() => {
                    const newStyling = { ...gameSettings.boardStyling, style: 'standard' as const };
                    newStyling.borderRadius = 12;
                    newStyling.borderWidth = 0;
                    newStyling.borderColor = '#000000';
                    newStyling.backgroundColor = 'transparent';
                    newStyling.useGradient = false;
                    updateSettings({ boardStyling: newStyling });
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 min-h-[44px] cursor-pointer active:bg-muted/50 transition-colors border-b border-border/30",
                    gameSettings.boardStyling.style === 'standard' ? '' : "hover:bg-muted/30"
                  )}
                  style={gameSettings.boardStyling.style === 'standard' ? {
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  } : {}}
                  onMouseEnter={(e) => {
                    if (gameSettings.boardStyling.style === 'standard') {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameSettings.boardStyling.style === 'standard') {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <Square className={cn(
                      "h-4 w-4",
                      gameSettings.boardStyling.style === 'standard' ? "text-blue-500" : "text-muted-foreground"
                    )} />
                          </div>
                  <div className="flex-1 min-w-0 py-2.5">
                    <div className="text-[15px] font-normal text-foreground leading-tight">Standard</div>
                        </div>
                          </div>
                <div
                  onClick={() => {
                    const newStyling = { ...gameSettings.boardStyling, style: 'rounded' as const };
                    newStyling.borderRadius = 24;
                    newStyling.borderWidth = 0;
                    newStyling.borderColor = '#000000';
                    newStyling.backgroundColor = 'transparent';
                    newStyling.useGradient = false;
                    updateSettings({ boardStyling: newStyling });
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 min-h-[44px] cursor-pointer active:bg-muted/50 transition-colors border-b border-border/30",
                    gameSettings.boardStyling.style === 'rounded' ? '' : "hover:bg-muted/30"
                  )}
                  style={gameSettings.boardStyling.style === 'rounded' ? {
                    backgroundColor: 'rgba(34, 197, 94, 0.2)',
                  } : {}}
                  onMouseEnter={(e) => {
                    if (gameSettings.boardStyling.style === 'rounded') {
                      e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameSettings.boardStyling.style === 'rounded') {
                      e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <Circle className={cn(
                      "h-4 w-4",
                      gameSettings.boardStyling.style === 'rounded' ? "text-green-500" : "text-muted-foreground"
                    )} />
                        </div>
                  <div className="flex-1 min-w-0 py-2.5">
                    <div className="text-[15px] font-normal text-foreground leading-tight">Rounded</div>
                          </div>
                        </div>
                <div
                  onClick={() => {
                    if (gameSettings.boardStyling.style !== 'custom') {
                      const newStyling = { ...gameSettings.boardStyling, style: 'custom' as const };
                      newStyling.borderRadius = 12;
                      if (newStyling.borderWidth === undefined) newStyling.borderWidth = 0;
                      if (!newStyling.borderColor) newStyling.borderColor = '#000000';
                      if (!newStyling.backgroundColor || newStyling.backgroundColor === 'transparent') newStyling.backgroundColor = '#ffffff';
                      if (newStyling.useGradient === undefined) newStyling.useGradient = false;
                      if (!newStyling.gradientColors) newStyling.gradientColors = ['#3B82F6', '#8B5CF6'];
                      updateSettings({ boardStyling: newStyling });
                    }
                    setShowCustomBoardDialog(true);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 min-h-[44px] cursor-pointer active:bg-muted/50 transition-colors",
                    gameSettings.boardStyling.style === 'custom' ? '' : "hover:bg-muted/30"
                  )}
                  style={gameSettings.boardStyling.style === 'custom' ? {
                    backgroundColor: 'rgba(168, 85, 247, 0.2)',
                  } : {}}
                  onMouseEnter={(e) => {
                    if (gameSettings.boardStyling.style === 'custom') {
                      e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameSettings.boardStyling.style === 'custom') {
                      e.currentTarget.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    <SettingsIcon className={cn(
                      "h-4 w-4",
                      gameSettings.boardStyling.style === 'custom' ? "text-purple-500" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0 py-2.5">
                    <div className="text-[15px] font-normal text-foreground leading-tight">Custom</div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </SettingsSection>

            <SettingsSection header="DISPLAY">
              <SettingsRow
                icon={<BarChart3 className="h-4 w-4" />}
                iconColor="bg-green-500"
                title="Game Status Panel"
                subtitle="Show detailed game statistics and status"
                rightElement={
                <Switch
                  checked={gameSettings.showGameStatus}
                  onCheckedChange={(checked) => updateSettings({ showGameStatus: checked })}
                  appThemeColor={appThemeColor}
                />
                }
                isFirst
                isLast={!gameSettings.showGameStatus}
              />
              {gameSettings.showGameStatus && (
                <SettingsRow
                  icon={<span className="text-xs font-bold">⇄</span>}
                  iconColor="bg-blue-500"
                  title="Panel Position"
                  subtitle={gameSettings.gameStatusPosition === 'left' ? 'Left' : 'Right'}
                  rightElement={
                    <Select 
                      value={gameSettings.gameStatusPosition} 
                      onValueChange={(value: 'left' | 'right') => updateSettings({ gameStatusPosition: value })}
                    >
                      <SelectTrigger 
                        className="h-auto w-auto border-0 bg-transparent p-0 focus:ring-0 [&>svg]:hidden"
                        style={{ outline: 'none', boxShadow: 'none' }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  }
                  showDropdown
                  isLast
                />
              )}
          </SettingsSection>
          </div>
        );

      case 'effects':
        const animationLabels: Record<string, string> = {
          none: 'None',
          confetti: 'Confetti',
          sparkle: 'Sparkle',
          glow: 'Glow'
        };
        
        return (
          <div className="space-y-6">
            <SettingsSection header="ANIMATIONS">
              <SettingsRow
                icon={<Sparkles className="h-4 w-4" />}
                iconColor="bg-pink-500"
                title="Win Animation"
                subtitle={animationLabels[gameSettings.winAnimation]}
                rightElement={
              <Select 
                value={gameSettings.winAnimation} 
                onValueChange={(value: any) => updateSettings({ winAnimation: value })}
              >
                    <SelectTrigger 
                      className="h-auto w-auto border-0 bg-transparent p-0 focus:ring-0 [&>svg]:hidden"
                      style={{ outline: 'none', boxShadow: 'none' }}
                    >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="confetti">Confetti</SelectItem>
                      <SelectItem value="sparkle">Sparkle</SelectItem>
                      <SelectItem value="glow">Glow</SelectItem>
                </SelectContent>
              </Select>
                }
                showDropdown
                isFirst
              />
              <SettingsRow
                icon={<Zap className="h-4 w-4" />}
                iconColor="bg-orange-500"
                title="Enable Animations"
                subtitle="Show fun animations and effects during gameplay"
                rightElement={
                <Switch
                  checked={gameSettings.enableAnimations}
                  onCheckedChange={(checked) => updateSettings({ enableAnimations: checked })}
                  appThemeColor={appThemeColor}
                />
                }
                isLast
              />
          </SettingsSection>
          </div>
        );

      case 'accessibility':
        const fontSizeLabels: Record<string, string> = {
          'very-small': 'Very Small',
          'small': 'Small',
          'medium': 'Medium',
          'large': 'Large',
          'very-large': 'Very Large'
        };
        
        return (
          <div className="space-y-6">
            <SettingsSection header="ACCESSIBILITY">
              <SettingsRow
                icon={<Accessibility className="h-4 w-4" />}
                iconColor="bg-indigo-500"
                title="Reduce Motion"
                subtitle="Disable animations and transitions"
                rightElement={
              <Switch
                checked={reduceMotion}
                onCheckedChange={(checked) => setReduceMotion(checked)}
                appThemeColor={appThemeColor}
              />
                }
                isFirst
              />
              <SettingsRow
                icon={<span className="text-xs font-bold">Aa</span>}
                iconColor="bg-teal-500"
                title="Grid Font Size"
                subtitle={fontSizeLabels[gameSettings.gridFontSize]}
                rightElement={
              <Select 
                value={gameSettings.gridFontSize} 
                onValueChange={(value: 'very-small' | 'small' | 'medium' | 'large' | 'very-large') => updateSettings({ gridFontSize: value })}
              >
                    <SelectTrigger 
                      className="h-auto w-auto border-0 bg-transparent p-0 focus:ring-0 [&>svg]:hidden"
                      style={{ outline: 'none', boxShadow: 'none' }}
                    >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="very-small">Very Small</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="very-large">Very Large</SelectItem>
                </SelectContent>
              </Select>
                }
                showDropdown
              />
              <SettingsRow
                icon={<Keyboard className="h-4 w-4" />}
                iconColor="bg-gray-500"
                title="Disable Focus Outlines"
                subtitle="Remove all focus outlines and tabindex attributes"
                rightElement={
                  <Switch
                    checked={disableTabIndex}
                    onCheckedChange={(checked) => setDisableTabIndex(checked)}
                    appThemeColor={appThemeColor}
                  />
                }
                isLast
              />
          </SettingsSection>
          </div>
        );

      case 'awards':
        return (
            <div className="space-y-6">
            <SettingsSection header={pauseAchievements ? "GAME PERFORMANCE (Paused)" : "GAME PERFORMANCE"}>
              <div className="grid grid-cols-4 gap-0">
                <div 
                  className="flex flex-col items-center justify-center py-4 border-r border-border/30 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'xWins', label: 'X Wins' })}
                >
                  <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-red-500">X</span>
                </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{persistentStats.xWins}</div>
                  <div className="text-xs text-muted-foreground">X Wins</div>
                    </div>
                <div 
                  className="flex flex-col items-center justify-center py-4 border-r border-border/30 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'draws', label: 'Draws' })}
                >
                  <div className="w-12 h-12 rounded-full bg-gray-500/10 flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-gray-500">-</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{persistentStats.draws}</div>
                  <div className="text-xs text-muted-foreground">Draws</div>
                    </div>
                <div 
                  className="flex flex-col items-center justify-center py-4 border-r border-border/30 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'oWins', label: 'O Wins' })}
                >
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-green-500">O</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{persistentStats.oWins}</div>
                  <div className="text-xs text-muted-foreground">O Wins</div>
                    </div>
                <div 
                  className="flex flex-col items-center justify-center py-4 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'gamesPlayed', label: 'Games Played' })}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                    <Gamepad2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-1">{persistentStats.gamesPlayed || 0}</div>
                  <div className="text-xs text-muted-foreground">Games Played</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-0 border-t border-border/30 pt-4 mt-4">
                <div 
                  className="flex flex-col items-center justify-center py-3 border-r border-border/30 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'easyWins', label: 'Easy Wins' })}
                >
                  <div className="text-xl font-bold text-green-500 mb-1">{persistentStats.easyWins || 0}</div>
                  <div className="text-xs text-muted-foreground">Easy</div>
              </div>
                <div 
                  className="flex flex-col items-center justify-center py-3 border-r border-border/30 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'mediumWins', label: 'Medium Wins' })}
                >
                  <div className="text-xl font-bold text-blue-500 mb-1">{persistentStats.mediumWins || 0}</div>
                  <div className="text-xs text-muted-foreground">Medium</div>
                </div>
                <div 
                  className="flex flex-col items-center justify-center py-3 border-r border-border/30 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'hardWins', label: 'Hard Wins' })}
                >
                  <div className="text-xl font-bold text-orange-500 mb-1">{persistentStats.hardWins || 0}</div>
                  <div className="text-xs text-muted-foreground">Hard</div>
                </div>
                <div 
                  className="flex flex-col items-center justify-center py-3 cursor-pointer hover:bg-muted/20 transition-colors"
                  onClick={() => setSelectedAchievement({ type: 'unbeatableWins', label: 'Unbeatable Wins' })}
                >
                  <div className="text-xl font-bold text-red-500 mb-1">{persistentStats.unbeatableWins || 0}</div>
                  <div className="text-xs text-muted-foreground">Unbeatable</div>
              </div>
            </div>
          </SettingsSection>

            <SettingsSection header="MANAGE ACHIEVEMENTS">
              <SettingsRow
                icon={<Trophy className="h-4 w-4" />}
                iconColor="bg-yellow-500"
                title="Pause Achievements"
                rightElement={
                  <Switch
                    checked={pauseAchievements}
                    onCheckedChange={(checked) => setPauseAchievements(checked)}
                    appThemeColor={appThemeColor}
                  />
                }
                isFirst
              />
              <SettingsRow
                icon={<RotateCcw className="h-4 w-4" />}
                iconColor="bg-orange-500"
                title="Reset All Awards"
                onClick={() => setShowResetDialog(true)}
                showChevron
                isLast
              />
            </SettingsSection>
            </div>
        );

      case 'app-settings':
        if (isIOSPWA) {
          window.location.href = getAppStoreUrl();
          return null;
        }
        return (
          <div className="space-y-6">
            <SettingsSection header="STATUS BAR COLOUR">
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-foreground">
                      Status Bar Colour
                    </label>
                    <button
                      onClick={() => {
                        const newSyncedState = !isStatusBarSynced;
                        setIsStatusBarSynced(newSyncedState);
                        localStorage.setItem('tic-tac-toe-status-bar-synced', String(newSyncedState));
                        if (newSyncedState) {
                          setStatusBarColor(appThemeColor);
                          localStorage.setItem('tic-tac-toe-status-bar-color', appThemeColor);
                        }
                      }}
                      className={cn(
                        "px-2 py-1 text-xs rounded-lg transition-colors",
                        isStatusBarSynced 
                          ? "hover:opacity-90" 
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      style={isStatusBarSynced ? {
                        backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                        color: appThemeColor
                      } : {}}
                    >
                      Sync with Accent
                    </button>
                    <button
                      onClick={() => {
                        const defaultColor = '#000000';
                        setStatusBarColor(defaultColor);
                        localStorage.setItem('tic-tac-toe-status-bar-color', defaultColor);
                      }}
                      disabled={statusBarColor === '#000000'}
                      className="p-1 rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-muted-foreground"
                      title={statusBarColor === '#000000' ? 'Already at default colour' : 'Reset to default colour'}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="relative">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg transition-all duration-200 border border-border/30",
                        isStatusBarSynced 
                          ? "cursor-not-allowed opacity-60" 
                          : "cursor-pointer hover:border-border/50"
                      )}
                      style={{ backgroundColor: statusBarColor }}
                      onClick={() => {
                        if (!isStatusBarSynced) {
                          statusBarColorInputRef.current?.click();
                        }
                      }}
                    />
                    <input
                      ref={statusBarColorInputRef}
                      type="color"
                      value={statusBarColor}
                      onChange={(e) => {
                        if (!isStatusBarSynced) {
                          const newColor = e.target.value;
                          setStatusBarColor(newColor);
                          localStorage.setItem('tic-tac-toe-status-bar-color', newColor);
                          setIsStatusBarSynced(false);
                          localStorage.setItem('tic-tac-toe-status-bar-synced', 'false');
                        }
                      }}
                      className="absolute top-0 left-0 w-10 h-10 opacity-0"
                      style={{ pointerEvents: isStatusBarSynced ? 'none' : 'auto', cursor: isStatusBarSynced ? 'not-allowed' : 'pointer' }}
                      disabled={isStatusBarSynced}
                    />
                  </div>
                </div>
              </div>
            </SettingsSection>
          </div>
        );

      case 'other':
        return (
            <div className="space-y-6">
            <SettingsSection header="INFORMATION">
              <SettingsRow
                icon={<Play className="h-4 w-4" />}
                iconColor="bg-blue-500"
                title="Onboarding Tour"
                  onClick={() => {
                    if ((window as any).showOnboardingAgain) {
                      (window as any).showOnboardingAgain();
                    }
                    setOpen(false);
                  }}
                showChevron
                isFirst
              />
              <SettingsRow
                icon={<HelpCircle className="h-4 w-4" />}
                iconColor="bg-yellow-500"
                title="How to Play"
                onClick={() => setShowHowToPlayDialog(true)}
                showChevron
              />
              <SettingsRow
                icon={<Info className="h-4 w-4" />}
                iconColor="bg-gray-500"
                title="Version"
                subtitle="X&O Battle Web 2.1.0"
              />
            </SettingsSection>

            <SettingsSection header="Theme Export / Import">
              <SettingsRow
                icon={<Download className="h-4 w-4" />}
                iconColor="bg-green-500"
                title="Export Themes"
                onClick={exportThemes}
                showChevron
                isFirst
              />
              <SettingsRow
                icon={<Upload className="h-4 w-4" />}
                iconColor="bg-teal-500"
                title="Import Themes"
                onClick={() => importThemesInputRef.current?.click()}
                showChevron
              />
            </SettingsSection>

            <SettingsSection header="RESET OPTIONS">
              <SettingsRow
                icon={<RotateCcw className="h-4 w-4" />}
                iconColor="bg-red-500"
                title="Reset All Settings"
                onClick={() => setShowResetSettingsDialog(true)}
                showChevron
                isFirst
              />
              <SettingsRow
                icon={<Palette className="h-4 w-4" />}
                iconColor="bg-purple-500"
                title="Delete Presets"
                onClick={() => setShowResetThemesDialog(true)}
                showChevron
              />
          </SettingsSection>

          </div>
        );

      default:
        return null;
    }
  };

      return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-full w-screen h-screen p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-md dark:bg-[#080808] border-0 rounded-none sm:rounded-none">
        <div className="flex h-full relative">
          {mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}
          <div className={cn(
            "bg-[#F2F3F3] dark:bg-[#0E0E0E] border-r border-border/30 flex flex-col h-full transition-all duration-300 ease-in-out",
            isMobile ? "fixed z-50 w-64" : "fixed md:relative z-50 md:z-auto",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            !isMobile && (sidebarCollapsed ? "w-16" : "w-64")
          )} style={{ boxShadow: 'none', outline: 'none' }}>
            {!isMobile && (
              <div
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:w-2 transition-all duration-200 z-10"
              />
            )}
            <div className={cn(
              "border-b border-border/20 transition-all duration-300",
              isMobile ? "p-4" : sidebarCollapsed ? "p-3" : "p-6"
            )}>
              {!sidebarCollapsed ? (
              <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 flex-1">
                <div className="flex items-center justify-center">
                  <Settings className="h-4 w-4" style={{ color: appThemeColor }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Settings</h3>
                </div>
              </div>
                </div>
              ) : (
                !isMobile && (
                  <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="w-full flex items-center justify-center p-3 rounded-lg transition-colors group relative"
                    title="Expand sidebar"
                  >
                    <Settings className="h-[18px] w-[18px] transition-all duration-200 group-hover:opacity-0 absolute" style={{ color: appThemeColor }} />
                    <ChevronRight className="h-[18px] w-[18px] text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-foreground transition-all duration-200" />
                  </button>
                )
              )}
            </div>
            
            <nav className={cn(
              "flex-1 overflow-y-auto",
              isMobile ? "p-4" : "p-4"
            )}>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const button = (
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setShowThemesView(false);
                        setMobileMenuOpen(false);
                      }}
                    className={cn(
                      "w-full group flex items-center rounded-lg text-left transition-all duration-200",
                      sidebarCollapsed ? "justify-center p-3" : "gap-4 p-3",
                      isActive && !sidebarCollapsed
                          ? ''
                        : !isActive && !sidebarCollapsed && 'hover:bg-muted/50 text-muted-foreground hover:text-foreground',
                      sidebarCollapsed && 'text-muted-foreground'
                    )}
                    style={isActive && !sidebarCollapsed ? {
                        backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                        color: appThemeColor
                      } : {}}
                    title={sidebarCollapsed ? item.label : undefined}
                    >
                    <div className={cn(
                      "rounded-lg flex items-center justify-center transition-all duration-200",
                      sidebarCollapsed ? "w-8 h-8" : "w-8 h-8"
                    )}>
                      <Icon 
                        className={cn(
                          "h-5 w-5 transition-colors duration-200",
                          sidebarCollapsed && "group-hover:text-foreground"
                        )}
                        style={isActive && sidebarCollapsed ? {
                          color: appThemeColor
                        } : {}}
                      />
                      </div>
                    {!sidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium text-sm"
                          style={isActive ? {
                            color: appThemeColor
                          } : {}}
                        >
                          {item.label}
                        </div>
                      </div>
                    )}
                    </button>
                );

                return sidebarCollapsed ? (
                  <div key={item.id} className="mb-2">
                    {button}
                  </div>
                ) : (
                  <Ripple 
                    key={item.id}
                    color={`rgba(${appThemeColorRgb}, 0.2)`}
                    className="mb-2"
                  >
                    {button}
                  </Ripple>
                );
              })}
            </nav>
            
            <div className="p-4 border-t border-border/30">
              {sidebarCollapsed ? (
                isPWA && !isIOSPWA ? (
                  <button
                    onClick={() => {
                      setActiveSection('app-settings');
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full group flex items-center justify-center p-3 rounded-lg transition-all duration-200",
                      appSettingsActive ? "text-foreground" : "text-muted-foreground"
                    )}
                    title="App Settings"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200">
                      <Monitor className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        appSettingsActive ? "" : "group-hover:text-foreground"
                      )} />
                    </div>
                  </button>
                ) : (
                  <a
                    href={getAppStoreUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full group flex items-center justify-center p-3 text-muted-foreground rounded-lg transition-all duration-200"
                    title="Get App"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200">
                      <Download className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        "group-hover:text-foreground"
                      )} />
                    </div>
                  </a>
                )
              ) : (
                <Ripple 
                  color={`rgba(${appThemeColorRgb}, 0.2)`}
                >
                  {isPWA && !isIOSPWA ? (
                    <button
                      onClick={() => {
                        setActiveSection('app-settings');
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full group flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-200",
                        appSettingsActive ? "text-foreground" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      )}
                      title="App Settings"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200">
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium text-sm"
                        >
                          App Settings
                        </div>
                      </div>
                    </button>
                  ) : (
                    <a
                      href={getAppStoreUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full group flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-200 hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                      title="Get App"
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200">
                        <Download className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium text-sm"
                        >
                          Get App
                        </div>
                      </div>
                    </a>
                  )}
                </Ripple>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="md:hidden p-4 border-b border-border/30 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
                  >
                    <Menu className="h-5 w-5 text-foreground" />
                  </button>
                  <h3 className="font-semibold text-foreground text-lg">Settings</h3>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-hidden bg-muted/20 relative">
              <div className="absolute inset-0 overflow-y-auto">
                <div className="p-6 pt-4 md:pt-6 max-w-4xl mx-auto">
                  <div className="space-y-6 relative">
                    <div className={cn(
                      "transition-transform duration-300 ease-in-out",
                      showThemesView ? "-translate-x-full opacity-0 absolute inset-0 pointer-events-none" : "translate-x-0 opacity-100"
                    )}>
                {renderContent()}
                    </div>
                    
                    <div className={cn(
                      "transition-transform duration-300 ease-in-out",
                      showThemesView ? "translate-x-0 opacity-100 relative z-10" : "translate-x-full opacity-0 absolute inset-0 pointer-events-none"
                    )}>
                      {showThemesView && <ThemesNavigationView
                        appThemeColor={appThemeColor} 
                        onBack={() => setShowThemesView(false)}
                        searchQuery={themeSearchQuery}
                        onSearchChange={setThemeSearchQuery}
                      />}
                    </div>
                  </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      <ConfirmDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Awards"
        description={<>Are you sure you want to reset all awards? This action <strong>cannot</strong> be undone.</>}
        confirmText="Reset All Awards"
        onConfirm={resetStatistics}
        variant="destructive"
      />

      <ConfirmDialog
        open={showResetSettingsDialog}
        onOpenChange={setShowResetSettingsDialog}
        title="Reset All Settings"
        description={<>Are you sure you want to reset all game settings? This action <strong>cannot</strong> be undone.</>}
        confirmText="Reset All Settings"
        onConfirm={resetSettings}
        variant="destructive"
      />

      <ConfirmDialog
        open={showResetThemesDialog}
        onOpenChange={setShowResetThemesDialog}
        title="Delete Presets"
        description={<>Are you sure you want to delete all custom theme presets? This action <strong>cannot</strong> be undone.</>}
        confirmText="Delete Presets"
        onConfirm={resetThemes}
        variant="destructive"
      />

      <ConfirmDialog
        open={showExportThemesDialog}
        onOpenChange={setShowExportThemesDialog}
        title="Export Themes"
        description={<>Export your custom themes and colour settings as a <strong>.json</strong> file to later on import.</>}
        confirmText="Export"
        onConfirm={() => {
          performExport();
          setShowExportThemesDialog(false);
        }}
        buttonClassName="w-full py-3.5 rounded-xl font-semibold text-[15px] hover:shadow-none hover:border-0 !transition-[background-color] bg-green-500 hover:bg-green-600 text-white dark:text-black"
      />

      <input
        ref={importThemesInputRef}
        type="file"
        accept=".json"
        onChange={importThemes}
        style={{ display: 'none' }}
      />

      <CustomBoardStylingDialog
        open={showCustomBoardDialog}
        onOpenChange={setShowCustomBoardDialog}
        gameSettings={gameSettings}
        updateSettings={updateSettings}
        appThemeColor={appThemeColor}
      />

      <Dialog open={!!selectedAchievement && !showResetConfirm} onOpenChange={(open) => {
        if (!open) {
          setSelectedAchievement(null);
          setShowResetConfirm(false);
        }
      }}>
        <DialogContent className="sm:max-w-[420px] p-0 gap-0 bg-transparent border-0 shadow-none !duration-0 data-[state=open]:!animate-none data-[state=closed]:!animate-none">
          <DialogContainer className={selectedAchievement ? (() => {
            const colorMap: Record<string, string> = {
              'xWins': '!bg-red-50 dark:!bg-red-500/10',
              'oWins': '!bg-green-50 dark:!bg-green-500/10',
              'draws': '!bg-gray-50 dark:!bg-gray-500/10',
              'gamesPlayed': '!bg-blue-50 dark:!bg-blue-500/10',
              'easyWins': '!bg-green-50 dark:!bg-green-500/10',
              'mediumWins': '!bg-blue-50 dark:!bg-blue-500/10',
              'hardWins': '!bg-orange-50 dark:!bg-orange-500/10',
              'unbeatableWins': '!bg-red-50 dark:!bg-red-500/10',
            };
            return colorMap[selectedAchievement.type] || '';
          })() : ''}>
            <div className="p-5">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-center text-lg font-semibold">
                  {selectedAchievement?.label}
            </DialogTitle>
          </DialogHeader>
          
              {selectedAchievement && (
                <>
                  <div className="space-y-4 mb-5">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-foreground mb-1">
                        {persistentStats[selectedAchievement.type as keyof typeof persistentStats] as number || 0}
          </div>
                      <div className="text-xs text-muted-foreground">Total Achievements</div>
                    </div>
                    
                    <div className="space-y-2.5 pt-3 border-t border-border/30">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">First Achieved</span>
                        <span className="text-sm font-medium text-foreground">
                          {persistentStats[`${selectedAchievement.type}FirstAchieved` as keyof typeof persistentStats] 
                            ? (() => {
                                const date = new Date(persistentStats[`${selectedAchievement.type}FirstAchieved` as keyof typeof persistentStats] as string);
                                const day = date.getDate();
                                const month = date.toLocaleDateString('en-US', { month: 'short' });
                                const year = date.getFullYear();
                                const hours = date.getHours().toString().padStart(2, '0');
                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                return `${day} ${month} ${year} at ${hours}:${minutes}`;
                              })()
                            : 'Never'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Last Updated</span>
                        <span className="text-sm font-medium text-foreground">
                          {persistentStats[`${selectedAchievement.type}LastUpdated` as keyof typeof persistentStats]
                            ? (() => {
                                const date = new Date(persistentStats[`${selectedAchievement.type}LastUpdated` as keyof typeof persistentStats] as string);
                                const day = date.getDate();
                                const month = date.toLocaleDateString('en-US', { month: 'short' });
                                const year = date.getFullYear();
                                const hours = date.getHours().toString().padStart(2, '0');
                                const minutes = date.getMinutes().toString().padStart(2, '0');
                                return `${day} ${month} ${year} at ${hours}:${minutes}`;
                              })()
                            : 'Never'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-border/30">
                    <Button 
                      variant="secondary" 
                      onClick={() => setShowResetConfirm(true)}
                      className={cn(
                        "w-full py-3 rounded-xl font-semibold text-[15px] hover:shadow-none hover:border-0 !transition-[background-color]",
                        selectedAchievement && (() => {
                          const buttonColorMap: Record<string, string> = {
                            'xWins': '!bg-red-500/10 hover:!bg-red-500/20 !text-red-600 dark:!text-red-400 border-red-500/20 hover:!text-red-600 dark:hover:!text-red-400',
                            'oWins': '!bg-green-500/10 hover:!bg-green-500/20 !text-green-600 dark:!text-green-400 border-green-500/20 hover:!text-green-600 dark:hover:!text-green-400',
                            'draws': '!bg-gray-500/10 hover:!bg-gray-500/20 !text-gray-600 dark:!text-gray-400 border-gray-500/20 hover:!text-gray-600 dark:hover:!text-gray-400',
                            'gamesPlayed': '!bg-blue-500/10 hover:!bg-blue-500/20 !text-blue-600 dark:!text-blue-400 border-blue-500/20 hover:!text-blue-600 dark:hover:!text-blue-400',
                            'easyWins': '!bg-green-500/10 hover:!bg-green-500/20 !text-green-600 dark:!text-green-400 border-green-500/20 hover:!text-green-600 dark:hover:!text-green-400',
                            'mediumWins': '!bg-blue-500/10 hover:!bg-blue-500/20 !text-blue-600 dark:!text-blue-400 border-blue-500/20 hover:!text-blue-600 dark:hover:!text-blue-400',
                            'hardWins': '!bg-orange-500/10 hover:!bg-orange-500/20 !text-orange-600 dark:!text-orange-400 border-orange-500/20 hover:!text-orange-600 dark:hover:!text-orange-400',
                            'unbeatableWins': '!bg-red-500/10 hover:!bg-red-500/20 !text-red-600 dark:!text-red-400 border-red-500/20 hover:!text-red-600 dark:hover:!text-red-400',
                          };
                          return buttonColorMap[selectedAchievement.type] || '';
                        })()
                      )}
                    >
                      Reset {selectedAchievement.label}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContainer>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showResetConfirm}
        onOpenChange={(open) => !open && setShowResetConfirm(false)}
        title={`Reset ${selectedAchievement?.label}?`}
        description={<>Are you sure you want to reset this achievement? This action <strong>cannot</strong> be undone.</>}
        confirmText={`Reset ${selectedAchievement?.label}`}
        onConfirm={() => {
          if (selectedAchievement) {
            const updatedStats: any = { ...persistentStats };
            updatedStats[selectedAchievement.type] = 0;
            delete updatedStats[`${selectedAchievement.type}FirstAchieved`];
            delete updatedStats[`${selectedAchievement.type}LastUpdated`];
            updatePersistentStats(updatedStats);
          }
        }}
        variant="destructive"
      />

      <Dialog open={showHowToPlayDialog} onOpenChange={setShowHowToPlayDialog}>
        <DialogContent className="sm:max-w-[420px] p-0 gap-0 bg-transparent border-0 shadow-none [&>button.absolute]:hidden">
          <DialogContainer>
            <div className="p-5">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-center text-lg font-semibold">
                  How to Play
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-3 mb-5">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Objective</h4>
                  <p className="text-sm text-muted-foreground">
                    Get three of your marks in a row (horizontal, vertical, or diagonal) to win.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Taking Turns</h4>
                  <p className="text-sm text-muted-foreground">
                    Players take turns placing their mark (X or O) on the board by clicking an empty cell.
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">AI Mode</h4>
                  <p className="text-sm text-muted-foreground">
                    Play against the computer with adjustable difficulty levels (Easy, Medium, Hard, Unbeatable).
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Draws</h4>
                  <p className="text-sm text-muted-foreground">
                    If all cells are filled without a winner, the game ends in a draw.
                  </p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border/30">
              <Button 
                  variant="outline"
                  onClick={() => setShowHowToPlayDialog(false)}
                  className="w-full py-2.5 rounded-xl bg-transparent border-0 font-medium text-[14px] text-orange-500 hover:bg-gray-200 dark:hover:bg-muted/40 hover:text-black dark:hover:text-orange-500 hover:border-0 hover:shadow-none active:bg-gray-300 dark:active:bg-muted/60 active:text-black dark:active:text-orange-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0 !transition-[background-color]"
                >
                  Got it
              </Button>
            </div>
          </div>
          </DialogContainer>
        </DialogContent>
      </Dialog>

    </Dialog>
  );
}