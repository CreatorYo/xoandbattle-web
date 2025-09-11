import { useState, useEffect } from 'react';
import { GameTheme } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Plus, Sparkles, ChevronRight, Copy } from 'lucide-react';
import React from 'react';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorInput({ value, onChange, label }: ColorInputProps) {
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-200"
          style={{ backgroundColor: value }}
          onClick={() => colorInputRef.current?.click()}
        />
        <input
          ref={colorInputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute top-0 left-0 w-8 h-8 opacity-0 cursor-pointer"
        />
      </div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#FF0000"
        className="h-8 text-xs font-mono bg-background/50 border-border/50 focus:border-primary/50"
      />
    </div>
  );
}

interface CreateThemeDialogProps {
  onCreateTheme: (theme: Omit<GameTheme, 'id'>) => void;
  editTheme?: GameTheme | null;
  onEditComplete?: () => void;
}

export function CreateThemeDialog({ onCreateTheme, editTheme, onEditComplete }: CreateThemeDialogProps) {
  const [open, setOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-advanced-section-open') === 'true';
    } catch {
      return false;
    }
  });
  const [newTheme, setNewTheme] = useState<Partial<GameTheme>>({
    name: '',
    description: '',
    primary: '#3B82F6',
    secondary: '#EF4444',
    accent: '#F59E0B',
    xColor: '#EF4444',
    oColor: '#22C55E',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
  });

  // Save advanced section state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tic-tac-toe-advanced-section-open', advancedOpen.toString());
    } catch (error) {
      console.error('Failed to save advanced section state:', error);
    }
  }, [advancedOpen]);

  useEffect(() => {
    if (editTheme) {
      setIsDuplicating(editTheme.name.includes('Copy'));
      setNewTheme({
        name: editTheme.name,
        description: editTheme.description,
        primary: editTheme.primary,
        secondary: editTheme.secondary,
        accent: editTheme.accent,
        xColor: editTheme.xColor,
        oColor: editTheme.oColor,
        boardBg: editTheme.boardBg,
        enableBoxFill: editTheme.enableBoxFill,
      });
      setOpen(true);
    } else {
      setIsDuplicating(false);
      setNewTheme({
        name: '',
        description: '',
        primary: '#3B82F6',
        secondary: '#EF4444',
        accent: '#F59E0B',
        xColor: '#EF4444',
        oColor: '#22C55E',
        boardBg: '#FFFFFF',
        enableBoxFill: false,
      });
    }
  }, [editTheme]);

  const handleCreateTheme = () => {
    if (!newTheme.name) return;
    
    const theme: Omit<GameTheme, 'id'> = {
      name: newTheme.name,
      description: newTheme.description || '',
      primary: newTheme.primary!,
      secondary: newTheme.secondary!,
      accent: newTheme.accent!,
      xColor: newTheme.xColor!,
      oColor: newTheme.oColor!,
      boardBg: newTheme.boardBg!,
      enableBoxFill: newTheme.enableBoxFill!,
    };

    onCreateTheme(theme);
    
    setNewTheme({
      name: '',
      description: '',
      primary: '#3B82F6',
      secondary: '#EF4444',
      accent: '#F59E0B',
      xColor: '#EF4444',
      oColor: '#22C55E',
      boardBg: '#FFFFFF',
      enableBoxFill: false,
    });
    
    if (editTheme && onEditComplete) {
      onEditComplete();
    }
    
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      if (onEditComplete) {
        onEditComplete();
      }
      
      setNewTheme({
        name: '',
        description: '',
        primary: '#3B82F6',
        secondary: '#EF4444',
        accent: '#F59E0B',
        xColor: '#EF4444',
        oColor: '#22C55E',
        boardBg: '#FFFFFF',
        enableBoxFill: false,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-none hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:bg-blue-500/20 dark:hover:text-blue-400 transition-all duration-300">
          <Plus className="h-4 w-4" />
          Create Theme
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-lg font-semibold text-center">
            {editTheme ? (isDuplicating ? 'Duplicate Theme' : 'Edit Theme') : 'Create Theme'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Theme Name */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-name" className="text-sm font-medium text-foreground">Name</Label>
              <span className={`text-xs ${
                newTheme.name.length >= 35 ? 'text-red-500' : 
                newTheme.name.length >= 28 ? 'text-yellow-500' : 
                'text-muted-foreground'
              }`}>
                {newTheme.name.length}/35
              </span>
            </div>
            <Input
              id="theme-name"
              value={newTheme.name}
              onChange={(e) => {
                if (e.target.value.length <= 35) {
                  setNewTheme(prev => ({ ...prev, name: e.target.value }))
                }
              }}
              placeholder="Name"
              className={`h-10 bg-background/50 border-border/50 ${
                newTheme.name.length >= 35 ? 'border-red-500 focus:border-red-500' : 
                newTheme.name.length >= 28 ? 'border-yellow-500 focus:border-yellow-500' : 
                'focus:border-primary'
              }`}
            />
          </div>

          {/* Colours */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Colours</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Player X</span>
                <ColorInput
                  value={newTheme.xColor}
                  onChange={(color) => setNewTheme(prev => ({ ...prev, xColor: color }))}
                  label=""
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Player O</span>
                <ColorInput
                  value={newTheme.oColor}
                  onChange={(color) => setNewTheme(prev => ({ ...prev, oColor: color }))}
                  label=""
                />
              </div>
            </div>
          </div>



          {/* Advanced Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setAdvancedOpen(!advancedOpen)}>
              <div className={`w-4 h-4 transition-transform duration-300 ease-in-out ${advancedOpen ? 'rotate-90' : ''}`}>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">Advanced</span>
            </div>
            
            <div 
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                advancedOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="space-y-4 pl-6 border-l border-border/30 pt-2">
                {/* Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-description" className="text-sm font-medium text-foreground">Description</Label>
                    <span className={`text-xs ${
                      newTheme.description.length >= 200 ? 'text-red-500' : 
                      newTheme.description.length >= 160 ? 'text-yellow-500' : 
                      'text-muted-foreground'
                    }`}>
                      {newTheme.description.length}/200
                    </span>
                  </div>
                  <textarea
                    id="theme-description"
                    value={newTheme.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setNewTheme(prev => ({ ...prev, description: e.target.value }))
                      }
                    }}
                    placeholder="Describe your theme..."
                    rows={3}
                    className={`w-full p-3 text-sm bg-background/50 border border-border/50 rounded-lg focus:outline-none resize-none ${
                      newTheme.description.length >= 200 ? 'border-red-500 focus:border-red-500' : 
                      newTheme.description.length >= 160 ? 'border-yellow-500 focus:border-yellow-500' : 
                      'focus:border-primary'
                    }`}
                  />
                </div>

                {/* Box Fill Effect */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-3 w-3 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">Box Fill Effect</Label>
                    </div>
                  </div>
                  <Switch
                    checked={newTheme.enableBoxFill}
                    onCheckedChange={(checked) => setNewTheme(prev => ({ ...prev, enableBoxFill: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Create Button */}
          <div className="pt-2">
            <Button 
              onClick={handleCreateTheme}
              disabled={!newTheme.name}
              className="w-full h-10 text-sm font-medium bg-primary hover:bg-primary/90"
            >
              {editTheme && isDuplicating ? (
                <Copy className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {editTheme 
                ? (isDuplicating ? 'Duplicate' : 'Update')
                : 'Create'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}