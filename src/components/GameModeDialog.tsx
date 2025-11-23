import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Bot, Check } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import type { GameMode } from '@/contexts/GameContext';
import { Ripple } from '@/components/ui/ripple';

interface GameModeDialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GameModeDialog({ children, open: externalOpen, onOpenChange: externalOnOpenChange }: GameModeDialogProps) {
  const { gameSettings, updateSettings, resetGame } = useGame();
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.gameMode);

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = externalOnOpenChange || setInternalOpen;

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedMode(gameSettings.gameMode);
    }
    setIsOpen(open);
  };

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    updateSettings({
      gameMode: mode,
    });
    resetGame();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[420px] p-0 gap-0 bg-transparent border-0 shadow-none">
        <div className="bg-card/95 dark:bg-black/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-center text-2xl font-semibold text-foreground mb-2">
                Select Game Mode
              </DialogTitle>
              <p className="text-center text-sm text-muted-foreground">
                Choose how you want to play
              </p>
            </DialogHeader>
            
            <div className="space-y-3">
              <Ripple color="rgba(255, 255, 255, 0.1)">
                <button
                  onClick={() => handleModeSelect('human')}
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-colors text-left bg-blue-500/5 hover:bg-blue-500/10"
                >
                  <Users className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <div className="text-[15px] font-medium text-foreground">Two Player</div>
                    <div className="text-[13px] text-muted-foreground">Play with a friend</div>
                  </div>
                  {selectedMode === 'human' && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              </Ripple>
              
              <Ripple color="rgba(255, 255, 255, 0.1)">
                <button
                  onClick={() => handleModeSelect('ai')}
                  className="w-full flex items-center gap-3 px-5 py-3 rounded-xl transition-colors text-left bg-green-500/5 hover:bg-green-500/10"
                >
                  <Bot className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <div className="text-[15px] font-medium text-foreground">AI Mode</div>
                    <div className="text-[13px] text-muted-foreground">Play against computer</div>
                  </div>
                  {selectedMode === 'ai' && (
                    <Check className="h-5 w-5 text-green-500" />
                  )}
                </button>
              </Ripple>
            </div>
          </div>
          
          <div className="px-6 pb-6 pt-4">
            <Ripple color="rgba(255, 255, 255, 0.1)">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 font-medium text-[14px] text-white transition-colors"
              >
                Cancel
              </button>
            </Ripple>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}