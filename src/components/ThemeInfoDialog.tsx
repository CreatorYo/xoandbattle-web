import { useState } from 'react';
import { GameTheme } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ThemeInfoDialogProps {
  theme: GameTheme | null;
  isCustom: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeInfoDialog({ theme, isCustom, open, onOpenChange }: ThemeInfoDialogProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  if (!theme) return null;

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) {
        setCopiedColor(null);
      }
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold">
            {theme.name}
          </DialogTitle>
          {isCustom && theme.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {theme.description}
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Player Colours
            </h4>
            <div className="space-y-2">
              <div 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group border border-border/20"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(theme.xColor);
                    setCopiedColor('x');
                    setTimeout(() => setCopiedColor(null), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">Player X</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{theme.xColor}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {copiedColor === 'x' ? (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Copied!</span>
                  ) : (
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                  )}
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-border/50 transition-all duration-200 flex-shrink-0 group-hover:scale-110" 
                    style={{ backgroundColor: theme.xColor }}
                  />
                </div>
              </div>
              <div 
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group border border-border/20"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(theme.oColor);
                    setCopiedColor('o');
                    setTimeout(() => setCopiedColor(null), 2000);
                  } catch (err) {
                    console.error('Failed to copy:', err);
                  }
                }}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">Player O</div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{theme.oColor}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {copiedColor === 'o' ? (
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">Copied!</span>
                  ) : (
                    <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">Copy</span>
                  )}
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-border/50 transition-all duration-200 flex-shrink-0 group-hover:scale-110" 
                    style={{ backgroundColor: theme.oColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

