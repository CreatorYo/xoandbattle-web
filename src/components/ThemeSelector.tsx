import { useState, useEffect } from 'react';
import { useGame, defaultThemes, GameTheme } from '@/contexts/GameContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, Check, Grid3X3, List } from 'lucide-react';
import { CreateThemeDialog } from './CreateThemeDialog';
import { ThemeContextMenu } from './ThemeContextMenu';

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

  const allThemes = [...defaultThemes, ...customThemes];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tic-tac-toe-custom-themes');
      if (saved) {
        setCustomThemes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load custom themes:', error);
    }
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

  const handleThemeSelect = (theme: GameTheme) => {
    updateSettings({ theme });
  };

  const handleCreateTheme = (themeData: Omit<GameTheme, 'id'>) => {
    if (editingTheme) {
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
      };
      setCustomThemes(prev => [...prev, theme]);
    }
  };

  const handleDuplicateTheme = (theme: GameTheme) => {
    const duplicatedTheme: GameTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      name: `${theme.name} Copy`,
    };
    setEditingTheme(duplicatedTheme);
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
          return (
            <ThemeContextMenu
              key={theme.id}
              theme={theme}
              isCustom={isCustom}
              onDuplicate={handleDuplicateTheme}
              onEdit={handleEditTheme}
              onDelete={handleDeleteTheme}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg group ${
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
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
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
          );
        })}
      </div>
    </div>
  );
}
