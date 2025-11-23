import { useState, useEffect } from 'react';
import { useGame, defaultThemes, GameTheme } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { CreateThemeDialog } from './CreateThemeDialog';
import { ThemeInfoDialog } from './ThemeInfoDialog';
import { cn } from '@/lib/utils';
import { 
  ChevronDown,
  RotateCcw,
  Search,
  Plus,
  MoreVertical,
  Info,
  Copy as CopyIcon,
  Edit,
  Check,
  Trash2,
  GripVertical
} from 'lucide-react';

interface ThemesNavigationViewProps {
  onBack: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  appThemeColor: string;
}

export function ThemesNavigationView({ onBack, searchQuery, onSearchChange, appThemeColor }: ThemesNavigationViewProps) {
  const { gameSettings, updateSettings } = useGame();
  const [customThemes, setCustomThemes] = useState<GameTheme[]>([]);
  const [hoveredThemeId, setHoveredThemeId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showInfoDialog, setShowInfoDialog] = useState<GameTheme | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTheme, setEditingTheme] = useState<GameTheme | null>(null);
  const [showResetThemesDialog, setShowResetThemesDialog] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isReorderMode, setIsReorderMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tic-tac-toe-reorder-mode') === 'true';
    } catch {
      return false;
    }
  });

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

  useEffect(() => {
    try {
      localStorage.setItem('tic-tac-toe-reorder-mode', isReorderMode.toString());
    } catch (error) {
      console.error('Failed to save reorder mode:', error);
    }
  }, [isReorderMode]);

  useEffect(() => {
    const handleReorderModeReset = () => {
      setIsReorderMode(false);
    };
    
    window.addEventListener('reorder-mode-reset', handleReorderModeReset);
    
    return () => {
      window.removeEventListener('reorder-mode-reset', handleReorderModeReset);
    };
  }, []);

  useEffect(() => {
    const pressedKeys = new Set<string>();
    let rKeyHeld = false;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      pressedKeys.add(key);
      
      if (key === 'r') {
        if (pressedKeys.size > 1) return;
        
        if (rKeyHeld) return;
        
        const activeElement = document.activeElement;
        const isInputFocused = activeElement && (
          activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.getAttribute('contenteditable') === 'true'
        );
        
        if (!isInputFocused) {
          rKeyHeld = true;
          setIsReorderMode(prev => !prev);
        }
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      pressedKeys.delete(key);
      
      if (key === 'r') {
        rKeyHeld = false;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = '0.5';
      }
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newThemes = [...customThemes];
    const draggedTheme = newThemes[draggedIndex];
    newThemes.splice(draggedIndex, 1);
    newThemes.splice(dropIndex, 0, draggedTheme);
    
    setCustomThemes(newThemes);
    try {
      localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(newThemes));
      window.dispatchEvent(new Event('custom-storage-change'));
    } catch (error) {
      console.error('Failed to save custom themes:', error);
    }
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '';
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between mb-4 md:mb-6 px-1">
        <div className="flex items-center gap-3">
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
                  onClick={() => setIsReorderMode(!isReorderMode)}
                  style={{ ['--hover-bg' as any]: `rgba(${appThemeColorRgb}, 0.2)` }} 
                  className="dark:hover:bg-[var(--hover-bg)]"
                >
                  <GripVertical className="h-4 w-4 mr-2" />
                  {isReorderMode ? 'Disable Reorder' : 'Reorder Presets'}
                </DropdownMenuItem>
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
                                See Details
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
                      See Details
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
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Custom Presets{customThemes.length > 0 ? ` (${customThemes.length})` : ''}
          </h3>
            {customThemes.length >= 10 && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 rounded-md flex-shrink-0 opacity-100"
                 title="Create Preset"
                style={{ color: appThemeColor }}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  target.style.backgroundColor = `rgba(${appThemeColorRgb}, 0.15)`;
                  target.style.color = appThemeColor;
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  target.style.backgroundColor = '';
                  target.style.color = appThemeColor;
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
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
                {customThemesFiltered.map((theme, filteredIndex) => {
                  const originalIndex = customThemes.findIndex(t => t.id === theme.id);
                  const isSelected = gameSettings.theme.id === theme.id;
                  const isHovered = hoveredThemeId === theme.id;
                  const isMenuOpen = openMenuId === theme.id;
                  const isDragging = draggedIndex === originalIndex;
                  const isDragOver = dragOverIndex === originalIndex;
                  return (
                    <ContextMenu key={theme.id}>
                      <ContextMenuTrigger asChild>
                        <div
                          draggable={isReorderMode && !searchQuery}
                          onDragStart={(e) => {
                            if (isReorderMode && !searchQuery) {
                              handleDragStart(e, originalIndex);
                            }
                          }}
                          onDragOver={(e) => {
                            if (isReorderMode && !searchQuery) {
                              handleDragOver(e, originalIndex);
                            }
                          }}
                          onDragLeave={(e) => {
                            if (isReorderMode && !searchQuery) {
                              handleDragLeave(e);
                            }
                          }}
                          onDrop={(e) => {
                            if (isReorderMode && !searchQuery) {
                              handleDrop(e, originalIndex);
                            }
                          }}
                          onDragEnd={(e) => {
                            if (isReorderMode && !searchQuery) {
                              handleDragEnd(e);
                            }
                          }}
                          onClick={(e) => {
                            if (draggedIndex === null) {
                              updateSettings({ theme });
                            }
                          }}
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
                            filteredIndex !== customThemesFiltered.length - 1 && "border-b border-border/30",
                            isDragging && "opacity-50 scale-95",
                            isDragOver && "bg-muted/50 border-t-2 translate-y-0"
                          )}
                          style={{ 
                            transition: isDragging 
                              ? 'opacity 0.2s ease, transform 0.2s ease' 
                              : 'background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                            transform: isDragging ? 'scale(0.95)' : 'scale(1)',
                            cursor: isReorderMode && !searchQuery ? 'grab' : 'pointer',
                            ...(isDragOver && { 
                              borderTopColor: appThemeColor,
                              borderTopWidth: '2px',
                              transform: 'translateY(-2px)'
                            }),
                            ...(isDragging && {
                              zIndex: 1000
                            })
                          }}
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {isReorderMode && !searchQuery && (
                              <div 
                                className="flex items-center gap-1.5 flex-shrink-0 cursor-grab active:cursor-grabbing transition-opacity"
                                onMouseDown={(e) => e.stopPropagation()}
                                style={{ opacity: isDragging ? 0.3 : 1 }}
                              >
                                <GripVertical className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground transition-colors" />
                              </div>
                            )}
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
                                    See Details
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
                          See Details
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

      <ThemeInfoDialog
        theme={showInfoDialog}
        isCustom={showInfoDialog ? customThemes.some(ct => ct.id === showInfoDialog.id) : false}
        open={!!showInfoDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowInfoDialog(null);
          }
        }}
      />

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

