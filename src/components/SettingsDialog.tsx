import { useState, useEffect, useRef } from 'react';
import { useGame, defaultThemes, GameTheme } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { toast as showToast } from '@/components/ui/toast-helper';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogContainer } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Slider } from '@/components/ui/slider';
import { SettingsSection, SettingsRow } from '@/components/ui/settings';
import { Ripple } from '@/components/ui/ripple';
import { 
  Settings, 
  Palette, 
  Layout, 
  BarChart3, 
  Zap, 
  HelpCircle,
  Bot,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Accessibility,
  Database,
  Download,
  Upload,
  ChevronDown,
  ChevronRight,
  Trash2,
  Play,
  Check,
  Minus,
  PartyPopper,
  Trophy,
  Square,
  Circle,
  Settings as SettingsIcon,
  Gamepad2,
  ArrowLeft,
  Search,
  Plus,
  MoreVertical,
  Info,
  Copy as CopyIcon,
  Edit,
  Menu,
  X
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { CreateThemeDialog } from './CreateThemeDialog';
import { cn } from '@/lib/utils';
import { getDefaultGameSettings, resetAccessibilitySettings, getDefaultAppearanceTheme } from '@/lib/settings-reset';
import React from 'react';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorInput({ value, onChange, label }: ColorInputProps) {
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isTransparent = value === 'transparent' || !value || value === '';

  const getActualBackgroundColor = () => {
    if (!isTransparent) return value;
    return theme === 'dark' ? '#000000' : '#ffffff';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-[background-color,border-color] duration-200 relative overflow-hidden"
          style={{ backgroundColor: getActualBackgroundColor() }}
          onClick={() => colorInputRef.current?.click()}
        >
          {isTransparent && (
            <div className="absolute inset-0 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc),linear-gradient(45deg,#ccc_25%,transparent_25%,transparent_75%,#ccc_75%,#ccc)] bg-[length:8px_8px] [background-position:0_0,4px_4px] opacity-30" />
          )}
        </div>
        <input
          ref={colorInputRef}
          type="color"
          value={isTransparent ? getActualBackgroundColor() : value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
        />
      </div>
      {!isTransparent && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FF0000"
          className="h-8 text-xs font-mono bg-background/50 border-border/50 focus-visible:ring-0 focus-visible:border-2 focus-visible:border-primary/50"
        />
      )}
    </div>
  );
}

interface ThemesNavigationViewProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  appThemeColor: string;
}

function ThemesNavigationView({ onBack, searchQuery, onSearchChange, appThemeColor }: ThemesNavigationViewProps) {
  const { gameSettings, updateSettings } = useGame();
  const [customThemes, setCustomThemes] = useState<GameTheme[]>([]);
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState<GameTheme | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTheme, setEditingTheme] = useState<GameTheme | null>(null);
  const [showResetThemesDialog, setShowResetThemesDialog] = useState(false);

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

  useEffect(() => {
    const loadThemes = () => {
      try {
        const saved = localStorage.getItem('tic-tac-toe-custom-themes');
        if (saved) {
          setCustomThemes(JSON.parse(saved));
        } else {
          setCustomThemes([]);
        }
      } catch (error) {
        console.error('Failed to load custom themes:', error);
        setCustomThemes([]);
      }
    };
    
    loadThemes();
    
    const handleCustomStorageChange = () => {
      loadThemes();
    };
    
    window.addEventListener('custom-storage-change', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('custom-storage-change', handleCustomStorageChange);
    };
  }, []);

  const allThemes = [...defaultThemes, ...customThemes];
  const filteredThemes = allThemes.filter(theme => 
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const defaultThemesFiltered = defaultThemes.filter(theme => 
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const customThemesFiltered = customThemes.filter(theme => 
    theme.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTheme = (themeData: Omit<GameTheme, 'id'>) => {
    const theme: GameTheme = {
      id: `custom-${Date.now()}`,
      ...themeData,
    };
    const updatedThemes = [...customThemes, theme];
    setCustomThemes(updatedThemes);
    try {
      localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(updatedThemes));
      window.dispatchEvent(new Event('custom-storage-change'));
    } catch (error) {
      console.error('Failed to save custom themes:', error);
    }
    setShowCreateDialog(false);
  };

  const handleDuplicateTheme = (theme: GameTheme) => {
    const baseName = theme.name.replace(/\s*\(x\d+\)$/, '');
    
    const allThemes = [...defaultThemes, ...customThemes];
    const duplicatePattern = /\(x(\d+)\)$/;
    let maxNumber = 0;
    
    allThemes.forEach(t => {
      const tBaseName = t.name.replace(/\s*\(x\d+\)$/, '');
      if (tBaseName === baseName) {
        const match = t.name.match(duplicatePattern);
        if (match) {
          const num = parseInt(match[1], 10);
          if (num > maxNumber) {
            maxNumber = num;
          }
        }
      }
    });
    
    const nextNumber = maxNumber + 1;
    const newName = `${baseName} (x${nextNumber})`;
    
    setEditingTheme({
      ...theme,
      id: `custom-${Date.now()}`,
      name: newName,
    });
    setOpenMenuId(null);
  };

  const handleDeleteTheme = (themeId: string) => {
    const updatedThemes = customThemes.filter(theme => theme.id !== themeId);
    setCustomThemes(updatedThemes);
    try {
      localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(updatedThemes));
      window.dispatchEvent(new Event('custom-storage-change'));
    } catch (error) {
      console.error('Failed to save custom themes:', error);
    }
    if (gameSettings.theme.id === themeId) {
      updateSettings({ theme: defaultThemes[0] });
    }
    setOpenMenuId(null);
  };

  const handleEditTheme = (theme: GameTheme) => {
    setEditingTheme(theme);
    setOpenMenuId(null);
  };


  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 hover:bg-muted/30 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">Theme</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0 hover:bg-muted/30 rounded transition-colors">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuItem 
                  onClick={() => setShowResetThemesDialog(true)}
                  className="text-red-500 focus:text-red-500"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Delete Presets
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={onBack}
          className="px-3 py-1.5 h-auto font-medium"
          style={{
            color: appThemeColor,
            '--hover-color': appThemeColor,
          } as React.CSSProperties & { '--hover-color': string }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.1)`;
            target.style.color = appThemeColor;
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.backgroundColor = '';
            target.style.color = appThemeColor;
          }}
        >
          Done
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-10 rounded-lg bg-gray-200 dark:bg-muted/30 border-border/50 focus-visible:ring-2"
            style={{
              '--tw-ring-color': `rgba(${appThemeColorRgb}, 0.3)`,
            } as React.CSSProperties & { '--tw-ring-color': string }}
            onFocus={(e) => {
              e.currentTarget.style.setProperty('--tw-ring-color', `rgba(${appThemeColorRgb}, 0.3)`);
            }}
          />
        </div>
      </div>

      {defaultThemesFiltered.length === 0 && customThemesFiltered.length === 0 && searchQuery ? (
        <div className="pt-12 px-4 py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-[15px] font-medium text-foreground mb-2">Nope, not here</p>
          <p className="text-sm text-muted-foreground">Oops, nothing to be found! Try a different search or have another go.</p>
        </div>
      ) : (
      <div className="space-y-6">
        <div className="pt-6">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Themes
          </h3>
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            {defaultThemesFiltered.length === 0 && searchQuery ? (
              <div className="px-4 py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-[15px] font-medium text-foreground mb-2">Nope, not here</p>
                <p className="text-sm text-muted-foreground">Oops, nothing to be found! Try a different search or have another go.</p>
              </div>
            ) : (
              defaultThemesFiltered.map((theme, index) => {
              const isSelected = gameSettings.theme.id === theme.id;
              const isHovered = hoveredThemeId === theme.id;
              const isMenuOpen = openMenuId === theme.id;
              const isCustom = customThemes.some(ct => ct.id === theme.id);
              return (
                <ContextMenu key={theme.id}>
                  <ContextMenuTrigger asChild>
                    <div
                      onClick={() => updateSettings({ theme })}
                      onMouseEnter={() => {
                        if (!openMenuId) {
                          setHoveredThemeId(theme.id);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!openMenuId || openMenuId !== theme.id) {
                          setHoveredThemeId(null);
                        }
                      }}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 relative",
                        index !== defaultThemesFiltered.length - 1 && "border-b border-border/30"
                      )}
                      style={{ transition: 'background-color 0.15s ease', transform: 'none' }}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: theme.xColor }}
                          />
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: theme.oColor }}
                          />
                        </div>
                        <span className="text-[15px] font-normal text-foreground">{theme.name}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 w-6 justify-end">
                        {(isHovered || isMenuOpen) ? (
                          <DropdownMenu open={isMenuOpen} onOpenChange={(open) => {
                            setOpenMenuId(open ? theme.id : null);
                            if (!open) {
                              setHoveredThemeId(null);
                            }
                          }}>
                            <DropdownMenuTrigger asChild>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(theme.id);
                                  setHoveredThemeId(theme.id);
                                }}
                                onMouseEnter={() => setHoveredThemeId(theme.id)}
                                className="p-1 hover:bg-muted/50 rounded w-6 h-6 flex items-center justify-center"
                                style={{ transition: 'none', transform: 'none' }}
                              >
                                <MoreVertical className="h-4 w-4 text-muted-foreground" style={{ transform: 'none' }} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40" style={{ transform: 'none' }}>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                setShowInfoDialog(theme);
                                setOpenMenuId(null);
                              }} style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} className="dark:hover:bg-[var(--hover-bg)]">
                                <Info className="h-4 w-4 mr-2" />
                                View Info
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateTheme(theme);
                              }} style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} className="dark:hover:bg-[var(--hover-bg)]">
                                <CopyIcon className="h-4 w-4 mr-2" />
                                Duplicate
                              </DropdownMenuItem>
                              {isCustom && (
                                <>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTheme(theme);
                                  }} style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} className="dark:hover:bg-[var(--hover-bg)]">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTheme(theme.id);
                                    }}
                                    className="text-red-500 focus:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : isSelected ? (
                          <div className="w-6 h-6 flex items-center justify-center">
                            <Check className="h-5 w-5 flex-shrink-0" style={{ transform: 'none', color: appThemeColor }} />
                          </div>
                        ) : <div className="w-6 h-6" />}
                      </div>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-40">
                    <ContextMenuItem 
                      onClick={() => setShowInfoDialog(theme)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                      }}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      View Info
                    </ContextMenuItem>
                    <ContextMenuItem 
                      onClick={() => handleDuplicateTheme(theme)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                      }}
                    >
                      <CopyIcon className="h-4 w-4 mr-2" />
                      Duplicate
                    </ContextMenuItem>
                    {isCustom && (
                      <>
                        <ContextMenuItem 
                          onClick={() => handleEditTheme(theme)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="text-red-500 focus:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </ContextMenuItem>
                      </>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              );
            })
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
            Custom Presets{customThemes.length > 0 ? ` (${customThemes.length})` : ''}
          </h3>
          <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
            {customThemesFiltered.length === 0 ? (
              searchQuery ? (
                <div className="px-4 py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-[15px] font-medium text-foreground mb-2">Nope, not here</p>
                  <p className="text-sm text-muted-foreground">Oops, nothing to be found! Try a different search or have another go.</p>
                </div>
              ) : (
                <div className="px-4 py-3">
                  <p className="text-sm text-muted-foreground mb-3 text-left">No custom presets yet.</p>
                  <div className="text-left">
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      variant="ghost"
                      className="-ml-2 pl-2"
                      style={{ color: appThemeColor }}
                      onMouseEnter={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.1)`;
                        target.style.color = appThemeColor;
                      }}
                      onMouseLeave={(e) => {
                        const target = e.currentTarget;
                        target.style.backgroundColor = '';
                        target.style.color = appThemeColor;
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      Add Preset
                    </Button>
                  </div>
                </div>
              )
            ) : (
              <>
                {customThemesFiltered.map((theme, index) => {
                  const isSelected = gameSettings.theme.id === theme.id;
                  const isHovered = hoveredThemeId === theme.id;
                  const isMenuOpen = openMenuId === theme.id;
                  return (
                    <ContextMenu key={theme.id}>
                      <ContextMenuTrigger asChild>
                        <div
                          onClick={() => updateSettings({ theme })}
                          onMouseEnter={() => {
                            if (!openMenuId) {
                              setHoveredThemeId(theme.id);
                            }
                          }}
                          onMouseLeave={() => {
                            if (!openMenuId || openMenuId !== theme.id) {
                              setHoveredThemeId(null);
                            }
                          }}
                          className={cn(
                            "flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 relative",
                            index !== customThemesFiltered.length - 1 && "border-b border-border/30"
                          )}
                          style={{ transition: 'background-color 0.15s ease', transform: 'none' }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: theme.xColor }}
                              />
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: theme.oColor }}
                              />
                            </div>
                            <span className="text-[15px] font-normal text-foreground">{theme.name}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 w-6 justify-end">
                            {(isHovered || isMenuOpen) ? (
                              <DropdownMenu open={isMenuOpen} onOpenChange={(open) => {
                                setOpenMenuId(open ? theme.id : null);
                                if (!open) {
                                  setHoveredThemeId(null);
                                }
                              }}>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenMenuId(theme.id);
                                      setHoveredThemeId(theme.id);
                                    }}
                                    onMouseEnter={() => setHoveredThemeId(theme.id)}
                                    className="p-1 hover:bg-muted/50 rounded w-6 h-6 flex items-center justify-center"
                                    style={{ transition: 'none', transform: 'none' }}
                                  >
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" style={{ transform: 'none' }} />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40" style={{ transform: 'none' }}>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    setShowInfoDialog(theme);
                                    setOpenMenuId(null);
                                  }} style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} className="dark:hover:bg-[var(--hover-bg)]">
                                    <Info className="h-4 w-4 mr-2" />
                                    View Info
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleDuplicateTheme(theme);
                                  }} style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} className="dark:hover:bg-[var(--hover-bg)]">
                                    <CopyIcon className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditTheme(theme);
                                  }} style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} className="dark:hover:bg-[var(--hover-bg)]">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteTheme(theme.id);
                                    }}
                                    className="text-red-500 focus:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : isSelected ? (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <Check className="h-5 w-5 flex-shrink-0" style={{ transform: 'none', color: appThemeColor }} />
                              </div>
                            ) : <div className="w-6 h-6" />}
                          </div>
                        </div>
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-40">
                        <ContextMenuItem 
                          onClick={() => setShowInfoDialog(theme)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                          }}
                        >
                          <Info className="h-4 w-4 mr-2" />
                          View Info
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => handleDuplicateTheme(theme)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                          }}
                        >
                          <CopyIcon className="h-4 w-4 mr-2" />
                          Duplicate
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => handleEditTheme(theme)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '';
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </ContextMenuItem>
                        <ContextMenuItem 
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="text-red-500 focus:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                })}
                <div className="border-t border-border/30 px-4 py-3">
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    variant="ghost"
                    className="w-full justify-start -ml-2 pl-2"
                    style={{ color: appThemeColor }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.1)`;
                      target.style.color = appThemeColor;
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.backgroundColor = '';
                      target.style.color = appThemeColor;
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Preset
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      )}

      {showInfoDialog && (
        <Dialog open={!!showInfoDialog} onOpenChange={(open) => !open && setShowInfoDialog(null)}>
          <DialogContent className="sm:max-w-[420px] p-0 gap-0 bg-transparent border-0 shadow-none">
            <DialogContainer>
              <div className="p-5">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-semibold text-left mb-2">
                    {showInfoDialog.name}
                  </DialogTitle>
                  {customThemes.some(ct => ct.id === showInfoDialog.id) && showInfoDialog.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {showInfoDialog.description}
                    </p>
                  )}
                </DialogHeader>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
                      Player Colours
                    </h4>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group border border-border/30"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(showInfoDialog.xColor);
                          } catch (err) {
                            console.error('Failed to copy:', err);
                          }
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-border/50 shadow-sm transition-all duration-200 flex-shrink-0 group-hover:scale-105" 
                          style={{ backgroundColor: showInfoDialog.xColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground mb-0.5">Player X</div>
                          <div className="text-xs text-muted-foreground font-mono">{showInfoDialog.xColor}</div>
                        </div>
                        <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to copy
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer group border border-border/30"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(showInfoDialog.oColor);
                          } catch (err) {
                            console.error('Failed to copy:', err);
                          }
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border-2 border-border/50 shadow-sm transition-all duration-200 flex-shrink-0 group-hover:scale-105" 
                          style={{ backgroundColor: showInfoDialog.oColor }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-foreground mb-0.5">Player O</div>
                          <div className="text-xs text-muted-foreground font-mono">{showInfoDialog.oColor}</div>
                        </div>
                        <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to copy
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContainer>
          </DialogContent>
        </Dialog>
      )}

      <CreateThemeDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateTheme={handleCreateTheme}
        onEditComplete={() => setShowCreateDialog(false)}
        appThemeColor={appThemeColor}
      />

      {editingTheme && (
        <CreateThemeDialog
          appThemeColor={appThemeColor}
          onCreateTheme={(themeData) => {
            const isNewTheme = !customThemes.some(theme => theme.id === editingTheme.id);
            
            if (isNewTheme) {
              const newTheme: GameTheme = {
                ...themeData,
                id: editingTheme.id,
              };
              const updatedThemes = [...customThemes, newTheme];
              setCustomThemes(updatedThemes);
              try {
                localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(updatedThemes));
                window.dispatchEvent(new Event('custom-storage-change'));
              } catch (error) {
                console.error('Failed to save custom themes:', error);
              }
            } else {
              const updatedThemes = customThemes.map(theme =>
                theme.id === editingTheme.id ? { ...themeData, id: editingTheme.id } : theme
              );
              setCustomThemes(updatedThemes);
              try {
                localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(updatedThemes));
                window.dispatchEvent(new Event('custom-storage-change'));
              } catch (error) {
                console.error('Failed to save custom themes:', error);
              }
              if (gameSettings.theme.id === editingTheme.id) {
                updateSettings({ theme: { ...themeData, id: editingTheme.id } });
              }
            }
            setEditingTheme(null);
          }}
          editTheme={editingTheme}
          onEditComplete={() => setEditingTheme(null)}
          open={!!editingTheme}
          onOpenChange={(open) => !open && setEditingTheme(null)}
        />
      )}

      <ConfirmDialog
        open={showResetThemesDialog}
        onOpenChange={setShowResetThemesDialog}
        title="Delete Presets"
        description="Are you sure you want to delete all custom theme presets? This action cannot be undone."
        confirmText="Delete Presets"
        onConfirm={() => {
          try {
            const currentThemeIsCustom = customThemes.some(ct => ct.id === gameSettings.theme.id);
            localStorage.removeItem('tic-tac-toe-custom-themes');
            setCustomThemes([]);
            window.dispatchEvent(new Event('custom-storage-change'));
            if (currentThemeIsCustom) {
              updateSettings({ theme: defaultThemes[0] });
            }
          } catch (error) {
            console.error('Failed to delete presets:', error);
          }
        }}
        variant="destructive"
      />
    </div>
  );
}

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ open: externalOpen, onOpenChange: externalOnOpenChange }: SettingsDialogProps) {
  const { gameSettings, updateSettings, persistentStats, resetPersistentStats, updatePersistentStats } = useGame();
  const { theme, setTheme } = useTheme();
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

  const [appThemeColor, setAppThemeColor] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-app-theme-color') || '#3b82f6';
    } catch {
      return '#3b82f6';
    }
  });

  const appThemeColorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--app-theme-color', appThemeColor);
    const defaultColor = '#3b82f6';
    if (appThemeColor !== defaultColor) {
      document.documentElement.setAttribute('data-theme-customized', 'true');
    } else {
      document.documentElement.removeAttribute('data-theme-customized');
    }
  }, [appThemeColor]);

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

  const handleThemeSelect = (theme: any) => {
    updateSettings({ theme });
  };
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('s');
      if (tab && ['appearance', 'gameplay', 'effects', 'awards', 'accessibility', 'other'].includes(tab)) {
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
  const [showThemesView, setShowThemesView] = useState(false);
  const [themeSearchQuery, setThemeSearchQuery] = useState('');
  const [showCreateThemeDialog, setShowCreateThemeDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


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
  };

  const resetSettings = () => {
    updateSettings(getDefaultGameSettings());
    
    setReduceMotion(false);
    resetAccessibilitySettings();
    
    setTheme(getDefaultAppearanceTheme());
    
    const defaultColor = '#3b82f6';
    setAppThemeColor(defaultColor);
    localStorage.setItem('tic-tac-toe-app-theme-color', defaultColor);
    document.documentElement.style.setProperty('--app-theme-color', defaultColor);
    document.documentElement.removeAttribute('data-theme-customized');
    
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

  const sidebarItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'gameplay', label: 'Gameplay', icon: Layout },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'awards', label: 'Awards', icon: Trophy },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'other', label: 'Other', icon: HelpCircle },
  ];

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
                  <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mb-1.5">
                    <Sun className="h-4 w-4 text-white" />
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
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mb-1.5">
                    <Moon className="h-4 w-4 text-white" />
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
                  <div className="w-8 h-8 rounded-full bg-slate-500 flex items-center justify-center mb-1.5">
                    <Monitor className="h-4 w-4 text-white" />
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
                      className="p-1 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                      title="Reset to default colour"
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
                icon={<Users className="h-4 w-4" />}
                iconColor="bg-blue-500"
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
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="unbeatable">Unbeatable</SelectItem>
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
                    backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                  } : {}}
                  onMouseEnter={(e) => {
                    if (gameSettings.boardStyling.style === 'standard') {
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.3)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameSettings.boardStyling.style === 'standard') {
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                    }
                  }}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                    gameSettings.boardStyling.style === 'standard' ? "bg-blue-500" : "bg-muted"
                  )}>
                    <Square className={cn(
                      "h-4 w-4",
                      gameSettings.boardStyling.style === 'standard' ? "text-white" : "text-muted-foreground"
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
                    backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                  } : {}}
                  onMouseEnter={(e) => {
                    if (gameSettings.boardStyling.style === 'rounded') {
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.3)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameSettings.boardStyling.style === 'rounded') {
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                    }
                  }}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                    gameSettings.boardStyling.style === 'rounded' ? "bg-green-500" : "bg-muted"
                  )}>
                    <Circle className={cn(
                      "h-4 w-4",
                      gameSettings.boardStyling.style === 'rounded' ? "text-white" : "text-muted-foreground"
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
                      if (!newStyling.borderRadius) newStyling.borderRadius = 12;
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
                    backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                  } : {}}
                  onMouseEnter={(e) => {
                    if (gameSettings.boardStyling.style === 'custom') {
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.3)`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (gameSettings.boardStyling.style === 'custom') {
                      e.currentTarget.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.2)`;
                    }
                  }}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0",
                    gameSettings.boardStyling.style === 'custom' ? "bg-purple-500" : "bg-muted"
                  )}>
                    <SettingsIcon className={cn(
                      "h-4 w-4",
                      gameSettings.boardStyling.style === 'custom' ? "text-white" : "text-muted-foreground"
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
                subtitle="Temporarily stop tracking achievements"
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
                subtitle="Clear all statistics and start fresh"
                onClick={() => setShowResetDialog(true)}
                showChevron
                isLast
              />
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
                subtitle="Replay the introduction tour"
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
                iconColor="bg-green-500"
                title="How to Play"
                subtitle="Learn the basics and tips"
                onClick={() => setShowHowToPlayDialog(true)}
                showChevron
              />
              <SettingsRow
                icon={<span className="text-xs font-bold">i</span>}
                iconColor="bg-gray-500"
                title="Version"
                subtitle="1.0.0"
              />
            </SettingsSection>

            <SettingsSection header="RESET OPTIONS">
              <SettingsRow
                icon={<RotateCcw className="h-4 w-4" />}
                iconColor="bg-red-500"
                title="Reset All Settings"
                subtitle="Reset all game settings to default values"
                onClick={() => setShowResetSettingsDialog(true)}
                showChevron
                isFirst
              />
              <SettingsRow
                icon={<Palette className="h-4 w-4" />}
                iconColor="bg-purple-500"
                title="Delete Presets"
                subtitle="Remove all custom theme presets"
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
            "w-64 bg-[#F2F3F3] dark:bg-[#0E0E0E] border-r border-border/30 flex flex-col fixed md:relative z-50 md:z-auto h-full transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )} style={{ boxShadow: 'none', outline: 'none' }}>
            <div className="p-6 border-b border-border/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <Settings className="h-4 w-4" style={{ color: appThemeColor }} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Settings</h3>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 p-4 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <Ripple 
                    key={item.id}
                    color={`rgba(${appThemeColorRgb}, 0.2)`}
                    className="mb-2"
                  >
                    <button
                      onClick={() => {
                        setActiveSection(item.id);
                        setShowThemesView(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full group flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-200 ${
                        isActive
                          ? ''
                          : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                      }`}
                      style={isActive ? {
                        backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                        color: appThemeColor
                      } : {}}
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
                        style={isActive ? {
                          backgroundColor: `rgba(${appThemeColorRgb}, 0.3)`,
                          color: appThemeColor
                        } : {
                          backgroundColor: `rgba(${appThemeColorRgb}, 0.2)`,
                          color: appThemeColor
                        }}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
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
                    </button>
                  </Ripple>
                );
              })}
            </nav>
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
                <div className="p-6 max-w-4xl mx-auto">
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
        description="Are you sure you want to reset all awards? This action cannot be undone."
        confirmText="Reset All Awards"
        onConfirm={resetStatistics}
        variant="destructive"
      />

      <ConfirmDialog
        open={showResetSettingsDialog}
        onOpenChange={setShowResetSettingsDialog}
        title="Reset All Settings"
        description="Are you sure you want to reset all game settings? This action cannot be undone."
        confirmText="Reset All Settings"
        onConfirm={resetSettings}
        variant="destructive"
      />

      <ConfirmDialog
        open={showResetThemesDialog}
        onOpenChange={setShowResetThemesDialog}
        title="Delete Presets"
        description="Are you sure you want to delete all custom theme presets? This action cannot be undone."
        confirmText="Delete Presets"
        onConfirm={resetThemes}
        variant="destructive"
      />

      <Dialog open={showCustomBoardDialog} onOpenChange={setShowCustomBoardDialog}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-transparent border-0 shadow-none">
          <DialogContainer>
            <div className="p-5 pb-0">
              <DialogHeader className="mb-5">
                <DialogTitle className="text-center text-lg font-semibold">
                  Custom Board Styling
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-0">
                <div className="px-4 py-3 border-b border-border/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Layout className="h-4 w-4 text-[#a514c9] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-normal text-foreground leading-tight">Corner Radius</div>
                      <div className="text-[13px] text-muted-foreground leading-tight mt-0.5">{gameSettings.boardStyling.borderRadius || 12}px</div>
                    </div>
                  </div>
                  <Slider
                    value={[gameSettings.boardStyling.borderRadius || 12]}
                    onValueChange={(value) => {
                      updateSettings({
                        boardStyling: {
                          ...gameSettings.boardStyling,
                          borderRadius: value[0]
                        }
                      });
                    }}
                    min={0}
                    max={50}
                    step={1}
                    color="purple"
                    className="w-full"
                  />
                </div>
                <div className="px-4 py-3 border-b border-border/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Layout className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-normal text-foreground leading-tight">Border Width</div>
                      <div className="text-[13px] text-muted-foreground leading-tight mt-0.5">{gameSettings.boardStyling.borderWidth || 0}px</div>
                    </div>
                  </div>
                  <Slider
                    value={[gameSettings.boardStyling.borderWidth || 0]}
                    onValueChange={(value) => {
                      updateSettings({
                        boardStyling: {
                          ...gameSettings.boardStyling,
                          borderWidth: value[0]
                        }
                      });
                    }}
                    min={0}
                    max={10}
                    step={1}
                    color="orange"
                    className="w-full"
                  />
                </div>
                <SettingsRow
                  icon={<Layout className="h-4 w-4 text-muted-foreground" />}
                  iconColor=""
                  title="Border Colour"
                  subtitle={gameSettings.boardStyling.borderColor || '#000000'}
                  rightElement={
                    <ColorInput
                      value={gameSettings.boardStyling.borderColor || '#000000'}
                      onChange={(color) => {
                        updateSettings({
                          boardStyling: {
                            ...gameSettings.boardStyling,
                            borderColor: color
                          }
                        });
                      }}
                      label="Border Colour"
                    />
                  }
                />
                <SettingsRow
                  icon={<Layout className="h-4 w-4 text-muted-foreground" />}
                  iconColor=""
                  title="Use Gradient"
                  rightElement={
                    <Switch
                      checked={gameSettings.boardStyling.useGradient || false}
                      onCheckedChange={(checked) => {
                        updateSettings({
                          boardStyling: {
                            ...gameSettings.boardStyling,
                            useGradient: checked
                          }
                        });
                      }}
                      appThemeColor={appThemeColor}
                    />
                  }
                />
                {!gameSettings.boardStyling.useGradient ? (
                  <SettingsRow
                    icon={<Layout className="h-4 w-4 text-muted-foreground" />}
                    iconColor=""
                    title="Background Colour"
                    rightElement={
                      <ColorInput
                        value={gameSettings.boardStyling.backgroundColor || 'transparent'}
                        onChange={(color) => {
                          updateSettings({
                            boardStyling: {
                              ...gameSettings.boardStyling,
                              backgroundColor: color
                            }
                          });
                        }}
                        label="Background Colour"
                      />
                    }
                  />
                ) : (
                  <>
                    <SettingsRow
                      icon={<Layout className="h-4 w-4 text-muted-foreground" />}
                      iconColor=""
                      title="Gradient Colour 1"
                      subtitle={gameSettings.boardStyling.gradientColors?.[0] || '#3B82F6'}
                      rightElement={
                        <ColorInput
                          value={gameSettings.boardStyling.gradientColors?.[0] || '#3B82F6'}
                          onChange={(color) => {
                            const colors = gameSettings.boardStyling.gradientColors || ['#3B82F6', '#8B5CF6'];
                            colors[0] = color;
                            updateSettings({
                              boardStyling: {
                                ...gameSettings.boardStyling,
                                gradientColors: colors
                              }
                            });
                          }}
                          label="Gradient Colour 1"
                        />
                      }
                    />
                    <SettingsRow
                      icon={<Layout className="h-4 w-4 text-muted-foreground" />}
                      iconColor=""
                      title="Gradient Colour 2"
                      subtitle={gameSettings.boardStyling.gradientColors?.[1] || '#8B5CF6'}
                      rightElement={
                        <ColorInput
                          value={gameSettings.boardStyling.gradientColors?.[1] || '#8B5CF6'}
                          onChange={(color) => {
                            const colors = gameSettings.boardStyling.gradientColors || ['#3B82F6', '#8B5CF6'];
                            colors[1] = color;
                            updateSettings({
                              boardStyling: {
                                ...gameSettings.boardStyling,
                                gradientColors: colors
                              }
                            });
                          }}
                          label="Gradient Colour 2"
                        />
                      }
                    />
                  </>
                )}
              </div>
            </div>
            
              <div className="p-5 pt-3">
              <Button 
                  variant="outline"
                  onClick={() => {
                    const defaultStyling = {
                      style: 'custom' as const,
                      borderRadius: 12,
                      borderWidth: 0,
                      borderColor: '#000000',
                      backgroundColor: '#ffffff',
                      useGradient: false,
                      gradientColors: ['#3B82F6', '#8B5CF6'],
                    };
                    updateSettings({ boardStyling: defaultStyling });
                  }}
                  className="w-full py-2.5 rounded-xl bg-transparent border-0 font-medium text-[14px] text-red-500 hover:bg-red-500/10 hover:text-red-500 hover:border-0 hover:shadow-none active:bg-red-500/20 active:text-red-500 focus-visible:outline-none focus-visible:ring-0 border-red-500/30 transition-[background-color]"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Restore to Defaults
              </Button>
            </div>
          </DialogContainer>
        </DialogContent>
      </Dialog>

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
        description="Are you sure you want to reset this achievement? This action cannot be undone."
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