import { useState, useEffect } from 'react';
import { GameTheme } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Sparkles, ChevronRight, Copy, Smile } from 'lucide-react';
import { CustomiseSymbolsDialog } from './CustomiseSymbolsDialog';
import React from 'react';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  appThemeColor?: string;
}

function ColorInput({ value, onChange, label, appThemeColor = '#3b82f6' }: ColorInputProps) {
  const colorInputRef = React.useRef<HTMLInputElement>(null);
  
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
  
  const colorRgb = hexToRgb(value);
  const colorRgbString = `${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}`;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div
          className="w-8 h-8 rounded-lg border border-border/50 cursor-pointer transition-all duration-200"
          style={{ backgroundColor: value }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = appThemeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '';
          }}
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
        className="h-8 text-xs font-mono bg-background/50 border-2 border-border/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
        onFocus={(e) => {
          e.target.style.borderColor = `rgba(${colorRgbString}, 0.3)`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '';
        }}
      />
    </div>
  );
}

interface CreateThemeDialogProps {
  onCreateTheme: (theme: Omit<GameTheme, 'id'>) => void;
  editTheme?: GameTheme | null;
  onEditComplete?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  appThemeColor?: string;
}

export function CreateThemeDialog({ onCreateTheme, editTheme, onEditComplete, open: externalOpen, onOpenChange: externalOnOpenChange, appThemeColor = '#3b82f6' }: CreateThemeDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;
  const [isDuplicating, setIsDuplicating] = useState(false);
  const descriptionTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  
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
    xColor: '#1A73E8',
    oColor: '#EA4335',
    boardBg: '#FFFFFF',
    enableBoxFill: false,
    xSymbol: '×',
    oSymbol: '○',
  });
  const [symbolsDialogOpen, setSymbolsDialogOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('tic-tac-toe-advanced-section-open', advancedOpen.toString());
    } catch (error) {
      console.error('Failed to save advanced section state:', error);
    }
  }, [advancedOpen]);

  useEffect(() => {
    if (editTheme) {
      const isDuplicating = /\(x\d+\)$/.test(editTheme.name);
      setIsDuplicating(isDuplicating);
      setNewTheme({
        name: editTheme.name,
        description: editTheme.description,
        xColor: editTheme.xColor,
        oColor: editTheme.oColor,
        boardBg: editTheme.boardBg,
        enableBoxFill: editTheme.enableBoxFill,
        xSymbol: editTheme.xSymbol || '×',
        oSymbol: editTheme.oSymbol || '○',
      });
      setOpen(true);
    } else {
      setIsDuplicating(false);
      setNewTheme({
        name: '',
        description: '',
        xColor: '#1A73E8',
        oColor: '#EA4335',
        boardBg: '#FFFFFF',
        enableBoxFill: false,
        xSymbol: '×',
        oSymbol: '○',
      });
    }
    if (descriptionTextareaRef.current) {
      setTimeout(() => {
        if (descriptionTextareaRef.current) {
          descriptionTextareaRef.current.style.height = 'auto';
          descriptionTextareaRef.current.style.height = `${Math.min(descriptionTextareaRef.current.scrollHeight, 200)}px`;
        }
      }, 0);
    }
  }, [editTheme, open]);

  const handleCreateTheme = () => {
    if (!newTheme.name) return;
    
    const theme: Omit<GameTheme, 'id'> = {
      name: newTheme.name,
      description: newTheme.description || '',
      xColor: newTheme.xColor!,
      oColor: newTheme.oColor!,
      boardBg: newTheme.boardBg!,
      enableBoxFill: newTheme.enableBoxFill!,
      xSymbol: newTheme.xSymbol || '×',
      oSymbol: newTheme.oSymbol || '○',
    };

    onCreateTheme(theme);
    
    setNewTheme({
      name: '',
      description: '',
      xColor: '#1A73E8',
      oColor: '#EA4335',
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
        xColor: '#1A73E8',
        oColor: '#EA4335',
        boardBg: '#FFFFFF',
        enableBoxFill: false,
        xSymbol: '×',
        oSymbol: '○',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-lg font-semibold text-center">
            {editTheme ? (isDuplicating ? 'Duplicate Preset' : 'Edit Preset') : 'Create Preset'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
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
              className={`h-10 bg-background/50 border-2 border-border/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none ${
                newTheme.name.length >= 35 ? 'border-red-500 focus-visible:border-red-500' : 
                newTheme.name.length >= 28 ? 'border-yellow-500 focus-visible:border-yellow-500' : ''
              }`}
              style={newTheme.name.length < 28 ? {
                '--focus-color': appThemeColor,
              } as React.CSSProperties & { '--focus-color': string } : {}}
              onFocus={(e) => {
                if (newTheme.name.length < 28) {
                  e.target.style.borderColor = `rgba(${appThemeColorRgb}, 0.3)`;
                }
              }}
              onBlur={(e) => {
                if (newTheme.name.length < 28) {
                  e.target.style.borderColor = '';
                }
              }}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Colours</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Player X</span>
                <ColorInput
                  value={newTheme.xColor}
                  onChange={(color) => setNewTheme(prev => ({ ...prev, xColor: color }))}
                  label=""
                  appThemeColor={appThemeColor}
                />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-muted-foreground">Player O</span>
                <ColorInput
                  value={newTheme.oColor}
                  onChange={(color) => setNewTheme(prev => ({ ...prev, oColor: color }))}
                  label=""
                  appThemeColor={appThemeColor}
                />
              </div>
            </div>
          </div>



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
                    ref={descriptionTextareaRef}
                    id="theme-description"
                    value={newTheme.description}
                    onChange={(e) => {
                      if (e.target.value.length <= 200) {
                        setNewTheme(prev => ({ ...prev, description: e.target.value }))
                        if (descriptionTextareaRef.current) {
                          descriptionTextareaRef.current.style.height = 'auto';
                          descriptionTextareaRef.current.style.height = `${Math.min(descriptionTextareaRef.current.scrollHeight, 200)}px`;
                        }
                      }
                    }}
                    placeholder="Describe your theme..."
                    rows={3}
                    className={`w-full p-3 text-sm bg-background/50 border-2 border-border/50 rounded-lg focus:outline-none focus:ring-0 resize-none overflow-hidden ${
                      newTheme.description.length >= 200 ? 'border-red-500 focus:border-red-500' : 
                      newTheme.description.length >= 160 ? 'border-yellow-500 focus:border-yellow-500' : ''
                    }`}
                    style={{ minHeight: '72px', maxHeight: '200px' }}
                    onFocus={(e) => {
                      if (newTheme.description.length < 160) {
                        e.target.style.borderColor = `rgba(${appThemeColorRgb}, 0.3)`;
                      }
                    }}
                    onBlur={(e) => {
                      if (newTheme.description.length < 160) {
                        e.target.style.borderColor = '';
                      }
                    }}
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center">
                      <Sparkles className="h-3 w-3" style={{ color: appThemeColor }} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-medium text-foreground">Box Fill Effect</Label>
                    </div>
                  </div>
                  <Switch
                    checked={newTheme.enableBoxFill}
                    onCheckedChange={(checked) => setNewTheme(prev => ({ ...prev, enableBoxFill: checked }))}
                    appThemeColor={appThemeColor}
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSymbolsDialogOpen(true)}
                  className="w-full justify-start gap-3 h-auto py-3 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:outline-none hover:!text-foreground [&_*]:hover:!text-inherit"
                >
                  <Smile className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">Customise Symbols</div>
                    <div className="text-xs text-muted-foreground">
                      {newTheme.xSymbol || '×'} and {newTheme.oSymbol || '○'}
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <CustomiseSymbolsDialog
            open={symbolsDialogOpen}
            onOpenChange={setSymbolsDialogOpen}
            xSymbol={newTheme.xSymbol || '×'}
            oSymbol={newTheme.oSymbol || '○'}
            onSymbolsChange={(xSymbol, oSymbol) => {
              setNewTheme(prev => ({ ...prev, xSymbol, oSymbol }));
            }}
            appThemeColor={appThemeColor}
          />

          <div className="pt-2">
            <Button 
              onClick={handleCreateTheme}
              disabled={!newTheme.name}
              className="w-full h-10 text-sm font-medium"
              style={(() => {
                const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(appThemeColor);
                if (rgb) {
                  const r = parseInt(rgb[1], 16);
                  const g = parseInt(rgb[2], 16);
                  const b = parseInt(rgb[3], 16);
                  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                  const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
                  return {
                    backgroundColor: appThemeColor,
                    color: textColor,
                  };
                }
                return {
                  backgroundColor: appThemeColor,
                  color: '#ffffff',
                };
              })()}
              onMouseEnter={(e) => {
                const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(appThemeColor);
                if (rgb) {
                  const r = parseInt(rgb[1], 16);
                  const g = parseInt(rgb[2], 16);
                  const b = parseInt(rgb[3], 16);
                  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                  const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
                  e.currentTarget.style.backgroundColor = `rgba(${r}, ${g}, ${b}, 0.9)`;
                  e.currentTarget.style.color = textColor;
                }
              }}
              onMouseLeave={(e) => {
                const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(appThemeColor);
                if (rgb) {
                  const r = parseInt(rgb[1], 16);
                  const g = parseInt(rgb[2], 16);
                  const b = parseInt(rgb[3], 16);
                  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                  const textColor = luminance > 0.5 ? '#000000' : '#ffffff';
                  e.currentTarget.style.backgroundColor = appThemeColor;
                  e.currentTarget.style.color = textColor;
                }
              }}
            >
              {editTheme && isDuplicating ? (
                <Copy className="h-4 w-4 mr-2" style={{ color: 'inherit' }} />
              ) : (
                <Plus className="h-4 w-4 mr-2" style={{ color: 'inherit' }} />
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