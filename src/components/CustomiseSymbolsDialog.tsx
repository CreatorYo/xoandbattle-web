import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';

interface CustomiseSymbolsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xSymbol: string;
  oSymbol: string;
  onSymbolsChange: (xSymbol: string, oSymbol: string) => void;
  appThemeColor?: string;
}

export function CustomiseSymbolsDialog({ 
  open, 
  onOpenChange, 
  xSymbol, 
  oSymbol, 
  onSymbolsChange,
  appThemeColor = '#3b82f6'
}: CustomiseSymbolsDialogProps) {
  const [localXSymbol, setLocalXSymbol] = useState(xSymbol);
  const [localOSymbol, setLocalOSymbol] = useState(oSymbol);

  useEffect(() => {
    if (open) {
      setLocalXSymbol(xSymbol);
      setLocalOSymbol(oSymbol);
    }
  }, [open, xSymbol, oSymbol]);

  const handleSave = () => {
    onSymbolsChange(localXSymbol.trim() || '×', localOSymbol.trim() || '○');
    onOpenChange(false);
  };

  const handleResetX = () => {
    setLocalXSymbol('×');
  };

  const handleResetO = () => {
    setLocalOSymbol('○');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Customise Symbols</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Player X Symbol</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={localXSymbol}
                  onChange={(e) => setLocalXSymbol(e.target.value)}
                  placeholder="×"
                  maxLength={2}
                  inputMode="text"
                  className="h-12 text-center text-3xl font-medium bg-muted/30 border-border/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:outline-none"
                  onFocus={(e) => {
                    e.target.style.outline = 'none';
                    e.target.style.boxShadow = 'none';
                    if ('virtualKeyboardPolicy' in navigator) {
                      (navigator as any).virtualKeyboardPolicy = 'manual';
                    }
                  }}
                />
                <div 
                  className={`transition-all duration-300 ease-in-out flex items-center ${localXSymbol.trim() !== '×' && localXSymbol.trim() !== '' ? 'w-12 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
                  style={{ minWidth: localXSymbol.trim() !== '×' && localXSymbol.trim() !== '' ? '3rem' : '0' }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetX}
                    className="h-12 w-12 p-0 shrink-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:outline-none"
                    title="Reset to default"
                  >
                    <RotateCcw className="h-4 w-4 text-red-500 hover:text-red-600 transition-colors" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Player O Symbol</Label>
              <div className="flex items-center gap-2">
                <Input
                  value={localOSymbol}
                  onChange={(e) => setLocalOSymbol(e.target.value)}
                  placeholder="○"
                  maxLength={2}
                  inputMode="text"
                  className="h-12 text-center text-3xl font-medium bg-muted/30 border-border/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:outline-none"
                />
                <div 
                  className={`transition-all duration-300 ease-in-out flex items-center ${localOSymbol.trim() !== '○' && localOSymbol.trim() !== '' ? 'w-12 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}
                  style={{ minWidth: localOSymbol.trim() !== '○' && localOSymbol.trim() !== '' ? '3rem' : '0' }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetO}
                    className="h-12 w-12 p-0 shrink-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:outline-none"
                    title="Reset to default"
                  >
                    <RotateCcw className="h-4 w-4 text-red-500 hover:text-red-600 transition-colors" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus:ring-0 focus:outline-none hover:ring-0 hover:outline-none active:ring-0 active:outline-none"
              onMouseEnter={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.boxShadow = 'none';
                const currentBorder = window.getComputedStyle(e.currentTarget).borderColor;
                e.currentTarget.setAttribute('data-original-border', currentBorder);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.boxShadow = 'none';
                const originalBorder = e.currentTarget.getAttribute('data-original-border');
                if (originalBorder) {
                  e.currentTarget.style.borderColor = originalBorder;
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
              style={{
                backgroundColor: appThemeColor,
                color: '#ffffff',
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

