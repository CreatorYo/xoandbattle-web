import { useState, useEffect } from 'react';
import { useGame, defaultThemes, GameTheme } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check } from 'lucide-react';
import { CreateThemeDialog } from './CreateThemeDialog';
import { ThemeContextMenu } from './ThemeContextMenu';

export function ThemeSelector() {
  const { gameSettings, updateSettings } = useGame();
  const [customThemes, setCustomThemes] = useState<GameTheme[]>([]);
  const [editingTheme, setEditingTheme] = useState<GameTheme | null>(null);
  
  const allThemes = [...defaultThemes, ...customThemes];

  // Load custom themes from localStorage on component mount
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

  // Save custom themes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('tic-tac-toe-custom-themes', JSON.stringify(customThemes));
    } catch (error) {
      console.error('Failed to save custom themes:', error);
    }
  }, [customThemes]);

  const handleThemeSelect = (theme: GameTheme) => {
    updateSettings({ theme });
  };

  const handleCreateTheme = (themeData: Omit<GameTheme, 'id'>) => {
    if (editingTheme) {
      // Edit existing theme
      const updatedThemes = customThemes.map(theme => 
        theme.id === editingTheme.id 
          ? { ...themeData, id: editingTheme.id }
          : theme
      );
      setCustomThemes(updatedThemes);
      
      // Update current theme if it's the one being edited
      if (gameSettings.theme.id === editingTheme.id) {
        updateSettings({ theme: { ...themeData, id: editingTheme.id } });
      }
    } else {
      // Create new theme
      const theme: GameTheme = {
        id: `custom-${Date.now()}`,
        ...themeData,
      };
      setCustomThemes(prev => [...prev, theme]);
    }
  };

  const handleDuplicateTheme = (theme: GameTheme) => {
    // Create a duplicated theme object for editing (don't add to customThemes yet)
    const duplicatedTheme: GameTheme = {
      ...theme,
      id: `custom-${Date.now()}`,
      name: `${theme.name} Copy`,
    };
    
    // Open the CreateThemeDialog with the duplicated theme data for editing
    setEditingTheme(duplicatedTheme);
  };

  const handleEditTheme = (theme: GameTheme) => {
    setEditingTheme(theme);
  };

  const handleDeleteTheme = (themeId: string) => {
    // Remove the theme from custom themes
    const updatedThemes = customThemes.filter(theme => theme.id !== themeId);
    setCustomThemes(updatedThemes);
    
    // If the deleted theme was active, switch to default
    if (gameSettings.theme.id === themeId) {
      updateSettings({ theme: defaultThemes[0] });
    }
  };

  const handleEditComplete = () => {
    setEditingTheme(null);
  };

  const ThemePreview = ({ theme, isSelected = false }: { theme: GameTheme; isSelected?: boolean }) => (
    <div className="relative">
      <div 
        className="w-full h-24 rounded-lg p-3 grid grid-cols-3 gap-2 border-2 transition-all duration-200"
        style={{ 
          backgroundColor: theme.boardBg,
          borderColor: isSelected ? theme.primary : 'transparent'
        }}
      >
        <div 
          className="rounded-md flex items-center justify-center font-bold text-lg border border-border/20"
          style={{ 
            backgroundColor: theme.enableBoxFill ? `${theme.xColor}20` : 'transparent',
            color: theme.xColor,
            borderColor: `${theme.xColor}30`
          }}
        >
          ×
        </div>
        <div 
          className="rounded-md flex items-center justify-center font-bold text-lg border border-border/20"
          style={{ 
            backgroundColor: theme.enableBoxFill ? `${theme.oColor}20` : 'transparent',
            color: theme.oColor,
            borderColor: `${theme.oColor}30`
          }}
        >
          ○
        </div>
        <div className="rounded-md border border-border/40"></div>
        <div 
          className="rounded-md flex items-center justify-center font-bold text-lg border border-border/20"
          style={{ 
            backgroundColor: theme.enableBoxFill ? `${theme.oColor}20` : 'transparent',
            color: theme.oColor,
            borderColor: `${theme.oColor}30`
          }}
        >
          ○
        </div>
        <div 
          className="rounded-md flex items-center justify-center font-bold text-lg border border-border/20"
          style={{ 
            backgroundColor: theme.enableBoxFill ? `${theme.xColor}20` : 'transparent',
            color: theme.xColor,
            borderColor: `${theme.xColor}30`
          }}
        >
          ×
        </div>
        <div className="rounded-md border border-border/40"></div>
      </div>
      
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: theme.primary }}>
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
      
      <div className="flex justify-center gap-1 mt-2">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }}></div>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }}></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Themes</h3>
          <p className="text-sm text-muted-foreground">Choose from preset themes or create your own</p>
        </div>
        <CreateThemeDialog 
          onCreateTheme={handleCreateTheme} 
          editTheme={editingTheme}
          onEditComplete={handleEditComplete}
          key={editingTheme?.id || 'new'} // Force re-render when editing different theme
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allThemes.map((theme) => {
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
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg p-4 group ${
                  gameSettings.theme.id === theme.id 
                    ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
                    : 'hover:ring-2 hover:ring-primary/20 hover:bg-muted/20'
                }`}
                onClick={() => handleThemeSelect(theme)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold group-hover:text-primary transition-colors">{theme.name}</h4>
                    {gameSettings.theme.id === theme.id && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {theme.description}
                  </p>
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
                    <div className="flex gap-1">
                      {theme.enableBoxFill && (
                        <Badge variant="outline" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Effects
                        </Badge>
                      )}
                      {isCustom && (
                        <Badge variant="secondary" className="text-xs">
                          Custom
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </ThemeContextMenu>
          );
        })}
      </div>
    </div>
  );
}