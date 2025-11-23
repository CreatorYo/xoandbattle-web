import { GameSettings } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ColorInput } from './ColorInput';
import { RotateCcw } from 'lucide-react';

interface CustomBoardStylingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameSettings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  appThemeColor: string;
}

export function CustomBoardStylingDialog({
  open,
  onOpenChange,
  gameSettings,
  updateSettings,
  appThemeColor
}: CustomBoardStylingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-semibold">
            Custom Board Styling
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 pt-2">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">Corner Radius</div>
              <div className="text-sm text-muted-foreground font-mono">{gameSettings.boardStyling.borderRadius ?? 12}px</div>
            </div>
            <Slider
              value={[gameSettings.boardStyling.borderRadius ?? 12]}
              onValueChange={(value) => {
                updateSettings({
                  boardStyling: {
                    ...gameSettings.boardStyling,
                    style: 'custom' as const,
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

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">Border Width</div>
              <div className="text-sm text-muted-foreground font-mono">{gameSettings.boardStyling.borderWidth ?? 0}px</div>
            </div>
            <Slider
              value={[gameSettings.boardStyling.borderWidth ?? 0]}
              onValueChange={(value) => {
                updateSettings({
                  boardStyling: {
                    ...gameSettings.boardStyling,
                    style: 'custom' as const,
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

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">Border Colour</div>
            <ColorInput
              value={gameSettings.boardStyling.borderColor || '#000000'}
              onChange={(color) => {
                updateSettings({
                  boardStyling: {
                    ...gameSettings.boardStyling,
                    style: 'custom' as const,
                    borderColor: color
                  }
                });
              }}
              label="Border Colour"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-foreground">Use Gradient</div>
              <Switch
                checked={gameSettings.boardStyling.useGradient || false}
                onCheckedChange={(checked) => {
                  updateSettings({
                    boardStyling: {
                      ...gameSettings.boardStyling,
                      style: 'custom' as const,
                      useGradient: checked
                    }
                  });
                }}
                appThemeColor={appThemeColor}
              />
          </div>

          {!gameSettings.boardStyling.useGradient ? (
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-foreground">Background Colour</div>
              <ColorInput
                value={gameSettings.boardStyling.backgroundColor || 'transparent'}
                onChange={(color) => {
                  updateSettings({
                    boardStyling: {
                      ...gameSettings.boardStyling,
                      style: 'custom' as const,
                      backgroundColor: color
                    }
                  });
                }}
                label="Background Colour"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">Gradient Colour 1</div>
                  <ColorInput
                    value={gameSettings.boardStyling.gradientColors?.[0] || '#3B82F6'}
                    onChange={(color) => {
                      const colors = gameSettings.boardStyling.gradientColors || ['#3B82F6', '#8B5CF6'];
                      colors[0] = color;
                      updateSettings({
                        boardStyling: {
                          ...gameSettings.boardStyling,
                          style: 'custom' as const,
                          gradientColors: colors
                        }
                      });
                    }}
                    label="Gradient Colour 1"
                  />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">Gradient Colour 2</div>
                  <ColorInput
                    value={gameSettings.boardStyling.gradientColors?.[1] || '#8B5CF6'}
                    onChange={(color) => {
                      const colors = gameSettings.boardStyling.gradientColors || ['#3B82F6', '#8B5CF6'];
                      colors[1] = color;
                      updateSettings({
                        boardStyling: {
                          ...gameSettings.boardStyling,
                          style: 'custom' as const,
                          gradientColors: colors
                        }
                      });
                    }}
                    label="Gradient Colour 2"
                  />
              </div>
            </div>
          )}

          <div className="pt-2">
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
              disabled={
                gameSettings.boardStyling.style === 'custom' &&
                (gameSettings.boardStyling.borderRadius ?? 12) === 12 &&
                (gameSettings.boardStyling.borderWidth ?? 0) === 0 &&
                (gameSettings.boardStyling.borderColor || '#000000') === '#000000' &&
                (gameSettings.boardStyling.backgroundColor || 'transparent') === '#ffffff' &&
                (gameSettings.boardStyling.useGradient || false) === false &&
                JSON.stringify(gameSettings.boardStyling.gradientColors || ['#3B82F6', '#8B5CF6']) === JSON.stringify(['#3B82F6', '#8B5CF6'])
              }
              className="w-full py-2.5 rounded-lg font-medium text-sm text-red-500 bg-red-500/10 hover:bg-red-500/15 hover:text-red-500 active:bg-red-500/20 active:text-red-500 focus-visible:outline-none focus-visible:ring-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-500/10 disabled:hover:text-red-500 border-0"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restore to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

