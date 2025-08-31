import { useState, useEffect } from 'react';
import { GameTheme } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Plus, Sparkles } from 'lucide-react';
import React from 'react';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
}

function ColorInput({ value, onChange, label }: ColorInputProps) {
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer hover:border-primary/50 transition-all duration-200 shadow-sm"
            style={{ backgroundColor: value }}
            onClick={() => colorInputRef.current?.click()}
          />
          <input
            ref={colorInputRef}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute top-0 left-0 w-12 h-12 opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#FF0000"
          className="flex-1 font-mono text-sm"
        />
      </div>
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">
                {editTheme ? (isDuplicating ? 'Duplicate Theme' : 'Edit Theme') : 'Create Custom Theme'}
              </div>
              <div className="text-sm font-normal text-muted-foreground mt-1">
                {editTheme 
                  ? (isDuplicating 
                    ? 'Customise your duplicated theme' 
                    : 'Modify your custom theme')
                  : 'Design your own theme with custom colours and effects'
                }
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-8">
          <Card className="border border-border/50 bg-transparent">
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Theme Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme-name" className="text-sm font-medium">Theme Name</Label>
                    <Input
                      id="theme-name"
                      value={newTheme.name}
                      onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My awesome theme"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme-description" className="text-sm font-medium">Description (Optional)</Label>
                    <Input
                      id="theme-description"
                      value={newTheme.description}
                      onChange={(e) => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="A brief description"
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-transparent">
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Palette className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Game Piece Colours</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ColorInput
                    value={newTheme.xColor}
                    onChange={(color) => setNewTheme(prev => ({ ...prev, xColor: color }))}
                    label="Player X Colour"
                  />
                  <ColorInput
                    value={newTheme.oColor}
                    onChange={(color) => setNewTheme(prev => ({ ...prev, oColor: color }))}
                    label="Player O Colour"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-transparent">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Box Fill Effect</h3>
                    <p className="text-sm text-muted-foreground">Add subtle background colours to game pieces</p>
                  </div>
                </div>
                <Switch
                  checked={newTheme.enableBoxFill}
                  onCheckedChange={(checked) => setNewTheme(prev => ({ ...prev, enableBoxFill: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <div className="pt-4">
            <Button 
              onClick={handleCreateTheme}
              disabled={!newTheme.name}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              {editTheme 
                ? (isDuplicating ? 'Create Duplicate Theme' : 'Update Theme')
                : 'Create Theme'
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}