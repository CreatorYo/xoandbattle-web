import { useState } from 'react';
import { GameTheme } from '@/contexts/GameContext';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Copy, Edit, Trash2, Info, Check } from 'lucide-react';

interface ThemeContextMenuProps {
  theme: GameTheme;
  isCustom: boolean;
  onDuplicate: (theme: GameTheme) => void;
  onEdit: (theme: GameTheme) => void;
  onDelete: (themeId: string) => void;
  children: React.ReactNode;
}

export function ThemeContextMenu({ theme, isCustom, onDuplicate, onEdit, onDelete, children }: ThemeContextMenuProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleCopyColor = async (color: string, colorType: string) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(colorType);
      setTimeout(() => setCopiedColor(null), 1000);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>{children}</ContextMenuTrigger>
        <ContextMenuContent className="bg-background/95 backdrop-blur border-border/50 shadow-2xl">
          <ContextMenuItem onClick={() => setShowInfo(true)} className="flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors">
            <Info className="w-4 h-4" />
            See Details
          </ContextMenuItem>
          <ContextMenuItem onClick={() => onDuplicate(theme)} className="flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors">
            <Copy className="w-4 h-4" />
            Duplicate
          </ContextMenuItem>
          {isCustom && (
            <>
              <ContextMenuItem onClick={() => onEdit(theme)} className="flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors">
                <Edit className="w-4 h-4" />
                Edit
              </ContextMenuItem>
              <ContextMenuItem 
                onClick={() => onDelete(theme.id)} 
                className="flex items-center gap-2 text-destructive hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Theme Information
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{theme.name}</h3>
              {theme.description && (
                <p className="text-sm text-muted-foreground mt-1">{theme.description}</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-sm">Player Colours</h4>
              <div className="space-y-3">
                <div 
                  className="flex items-center gap-3 p-3 rounded-lg border border-border/50 cursor-pointer hover:bg-muted/30 transition-all duration-200 group"
                  onClick={() => handleCopyColor(theme.xColor, 'x')}
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-border transition-all duration-200 group-hover:scale-110"
                      style={{ backgroundColor: theme.xColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Player X</div>
                    <div className="text-sm font-mono text-muted-foreground">{theme.xColor}</div>
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
                  onClick={() => handleCopyColor(theme.oColor, 'o')}
                >
                  <div className="relative">
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-border transition-all duration-200 group-hover:scale-110"
                      style={{ backgroundColor: theme.oColor }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">Player O</div>
                    <div className="text-sm font-mono text-muted-foreground">{theme.oColor}</div>
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

            {theme.enableBoxFill && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-muted-foreground">Box Fill Effect Enabled</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}