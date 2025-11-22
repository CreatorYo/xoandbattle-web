import { useState, useEffect, useRef } from 'react';
import { useGame, defaultThemes, GameTheme } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Grid3X3, List, MoreVertical, Info, Copy, Edit, Trash2 } from 'lucide-react';
import { CreateThemeDialog } from './CreateThemeDialog';
import { ThemeContextMenu } from './ThemeContextMenu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function ThemeSelector() {
  const { gameSettings, updateSettings } = useGame();
  const [customThemes, setCustomThemes] = useState<GameTheme[]>([]);
  const [editingTheme, setEditingTheme] = useState<GameTheme | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    try {
      return (localStorage.getItem('tic-tac-toe-theme-view-mode') as 'grid' | 'list') || 'grid';
    } catch {
      return 'grid';
    }
  });
  const [showInfo, setShowInfo] = useState<GameTheme | null>(null);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const allThemes = [...defaultThemes, ...customThemes];

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
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tic-tac-toe-custom-themes') {
        loadThemes();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const handleCustomStorageChange = () => {
      loadThemes();
    };
    
    window.addEventListener('custom-storage-change', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom-storage-change', handleCustomStorageChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(customThemes));
    } catch (error) {
      console.error('Failed to save custom themes:', error);
    }
  }, [customThemes]);

  useEffect(() => {
    try {
      localStorage.setItem('tic-tac-toe-theme-view-mode', viewMode);
    } catch (error) {
      console.error('Failed to save view mode:', error);
    }
  }, [viewMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        const buttonElement = event.target as Element;
        
        if (menuElement && !menuElement.contains(event.target as Node) && 
            !buttonElement.closest('button')) {
          closeMenu(openMenuId);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  const handleThemeSelect = (theme: GameTheme) => {
    updateSettings({ theme });
  };

  const handleCreateTheme = (themeData: Omit<GameTheme, 'id'>) => {
    if (editingTheme) {
      const isExistingCustomTheme = customThemes.some(theme => theme.id === editingTheme.id);
      
      if (isExistingCustomTheme) {
        const updatedThemes = customThemes.map(theme =>
          theme.id === editingTheme.id ? { ...themeData, id: editingTheme.id } : theme
        );
        setCustomThemes(updatedThemes);

        if (gameSettings.theme.id === editingTheme.id) {
          updateSettings({ theme: { ...themeData, id: editingTheme.id } });
        }
      } else {
        const theme: GameTheme = {
          id: `custom-${Date.now()}`,
          ...themeData,
          name: `${editingTheme.name} Copy`,
        };
        setCustomThemes(prev => [...prev, theme]);
      }
    } else {
      const theme: GameTheme = {
        id: `custom-${Date.now()}`,
        ...themeData,
      };
      setCustomThemes(prev => [...prev, theme]);
    }
  };

  const handleDuplicateTheme = (theme: GameTheme) => {
    setEditingTheme(theme);
    setDialogOpen(true);
  };

  const handleEditTheme = (theme: GameTheme) => {
    setEditingTheme(theme);
  };

  const handleDeleteTheme = (themeId: string) => {
    const updatedThemes = customThemes.filter(theme => theme.id !== themeId);
    setCustomThemes(updatedThemes);

    if (gameSettings.theme.id === themeId) {
      updateSettings({ theme: defaultThemes[0] });
    }
  };

  const handleEditComplete = () => {
    setEditingTheme(null);
  };

  const handleCopyColor = async (color: string, colorType: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(colorType);
      setTimeout(() => setCopiedColor(null), 1000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  const openMenu = (themeId: string) => {
    setOpenMenuId(themeId);
  };

  const closeMenu = (themeId: string) => {
    setOpenMenuId(null);
  };

  const toggleMenu = (themeId: string) => {
    if (openMenuId === themeId) {
      closeMenu(themeId);
    } else {
      if (openMenuId) {
        closeMenu(openMenuId);
      }
      openMenu(themeId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Themes</h3>
          <p className="text-sm text-muted-foreground">Choose from preset themes or create your own</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border/50 p-1 bg-muted/20">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="h-8 px-3"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <CreateThemeDialog
            onCreateTheme={handleCreateTheme}
            editTheme={editingTheme}
            onEditComplete={handleEditComplete}
            key={editingTheme?.id || 'new'}
          />
        </div>
      </div>

      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'flex flex-col gap-6'
        }
      >
        {allThemes.map(theme => {
          const isCustom = customThemes.some(ct => ct.id === theme.id);
          const isMenuOpen = openMenuId === theme.id;
          
          return (
            <div key={theme.id} className="relative group">
              <div className={`absolute top-2 right-2 transition-opacity duration-200 z-10 ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-transparent hover:shadow-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMenu(theme.id);
                    }}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                  
                  <div 
                    ref={(el) => (menuRefs.current[theme.id] = el)}
                    className={`absolute right-0 top-full mt-0.5 w-44 bg-background border border-border rounded-md shadow-lg z-20 transition-all duration-200 origin-top-right ${
                      isMenuOpen 
                        ? 'opacity-100 scale-100' 
                        : 'opacity-0 scale-95 pointer-events-none'
                    }`}
                  >
                    <div className="py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInfo(theme);
                          closeMenu(theme.id);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-blue-500/10 hover:text-blue-600 flex items-center gap-2 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                        View Info
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDuplicateTheme(theme);
                          closeMenu(theme.id);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-blue-500/10 hover:text-blue-600 flex items-center gap-2 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                          </button>
                      {isCustom && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditTheme(theme);
                              closeMenu(theme.id);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-blue-500/10 hover:text-blue-600 flex items-center gap-2 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTheme(theme.id);
                              closeMenu(theme.id);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-destructive hover:bg-destructive/10 hover:text-destructive flex items-center gap-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <ThemeContextMenu
                theme={theme}
                isCustom={isCustom}
                onDuplicate={handleDuplicateTheme}
                onEdit={handleEditTheme}
                onDelete={handleDeleteTheme}
              >
                <Card
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    gameSettings.theme.id === theme.id
                      ? 'ring-2 ring-primary shadow-lg bg-primary/5'
                      : 'hover:ring-2 hover:ring-primary/20 hover:bg-muted/20'
                  } ${viewMode === 'grid' ? 'p-4' : 'p-3'}`}
                  onClick={() => handleThemeSelect(theme)}
                >
                  <div
                    className={
                      viewMode === 'grid'
                        ? 'space-y-3'
                        : 'flex items-center justify-between gap-16'
                    }
                  >
                    <div
                      className={
                        viewMode === 'grid' ? 'space-y-3' : 'flex-1 min-w-0'
                      }
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold group-hover:text-primary transition-colors">
                          {theme.name}
                        </h4>
                        {viewMode === 'grid' && gameSettings.theme.id === theme.id && (
                          <div className={`w-5 h-5 rounded-full bg-primary flex items-center justify-center transition-opacity duration-200 ${
                            isMenuOpen ? 'opacity-0' : 'group-hover:opacity-0'
                          }`}>
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                      <p
                        className={`text-sm text-muted-foreground ${
                          viewMode === 'grid'
                            ? 'line-clamp-2'
                            : 'line-clamp-1'
                        }`}
                      >
                        {theme.description}
                      </p>
                    </div>

                    {viewMode === 'list' && (
                      <div className="flex items-center gap-12">
                        <div className={`flex gap-2 transition-opacity duration-200 ${
                          isMenuOpen ? 'opacity-0' : 'group-hover:opacity-0'
                        }`}>
                          <div
                            className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 shadow-sm"
                            style={{ backgroundColor: theme.xColor }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 shadow-sm"
                            style={{ backgroundColor: theme.oColor }}
                          />
                        </div>
                      </div>
                    )}

                    {viewMode === 'grid' && (
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          <div
                            className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 shadow-sm"
                            style={{ backgroundColor: theme.xColor }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border-2 border-muted-foreground/20 shadow-sm"
                            style={{ backgroundColor: theme.oColor }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </ThemeContextMenu>
            </div>
          );
        })}
      </div>

      {showInfo && (
        <Dialog open={!!showInfo} onOpenChange={() => setShowInfo(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Theme Information
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{showInfo.name}</h3>
                {showInfo.description && (
                  <p className="text-sm text-muted-foreground mt-1">{showInfo.description}</p>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Player Colours</h4>
                <div className="space-y-3">
                  <div 
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 transition-all duration-200 group"
                    onClick={() => handleCopyColor(showInfo.xColor, 'x')}
                  >
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-border transition-all duration-200 group-hover:scale-110"
                        style={{ backgroundColor: showInfo.xColor }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Player X</div>
                      <div className="text-sm font-mono text-muted-foreground">{showInfo.xColor}</div>
                    </div>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {copiedColor === 'x' ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">Copied!</span>
                      ) : (
                        'Click to copy'
                      )}
                    </div>
                  </div>

                  <div 
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 transition-all duration-200 group"
                    onClick={() => handleCopyColor(showInfo.oColor, 'o')}
                  >
                    <div className="relative">
                      <div 
                        className="w-8 h-8 rounded-full border-2 border-border transition-all duration-200 group-hover:scale-110"
                        style={{ backgroundColor: showInfo.oColor }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Player O</div>
                      <div className="text-sm font-mono text-muted-foreground">{showInfo.oColor}</div>
                    </div>
                    <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {copiedColor === 'o' ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">Copied!</span>
                      ) : (
                        'Click to copy'
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {showInfo.enableBoxFill && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">Box Fill Effect Enabled</span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
