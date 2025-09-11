import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bot, Gamepad2 } from 'lucide-react';
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

  const handleModeChange = () => {
    updateSettings({
      gameMode: selectedMode,
    });
    resetGame();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Switch Game Mode
          </DialogTitle>
          <DialogDescription>
            Choose between playing with another player or against AI
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-3">
            <Ripple color={selectedMode === 'human' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)'}>
              <Card 
                className={`cursor-pointer transition-all border-2 select-none ${
                  selectedMode === 'human' 
                    ? 'border-blue-600 bg-blue-100/70 dark:bg-blue-950/30' 
                    : 'border-transparent bg-blue-100/60 dark:bg-blue-950/10 hover:bg-blue-100/80 dark:hover:bg-blue-950/20'
                }`}
                onClick={() => setSelectedMode('human')}
              >
                <CardContent className="p-4 text-center">
                  <Users className={`h-8 w-8 mx-auto mb-2 ${
                    selectedMode === 'human' ? 'text-blue-500 dark:text-blue-400' : 'text-blue-400 dark:text-blue-500'
                  }`} />
                  <h3 className="font-semibold">Two Players</h3>
                  <p className="text-sm text-muted-foreground">Play with a friend</p>
                </CardContent>
              </Card>
            </Ripple>
            
            <Ripple color={selectedMode === 'ai' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}>
              <Card 
                className={`cursor-pointer transition-all border-2 select-none ${
                  selectedMode === 'ai' 
                    ? 'border-green-600 bg-green-100/70 dark:bg-green-950/30' 
                    : 'border-transparent bg-green-100/60 dark:bg-green-950/10 hover:bg-green-100/80 dark:hover:bg-green-950/20'
                }`}
                onClick={() => setSelectedMode('ai')}
              >
                <CardContent className="p-4 text-center">
                  <Bot className={`h-8 w-8 mx-auto mb-2 ${
                    selectedMode === 'ai' ? 'text-green-500 dark:text-green-400' : 'text-green-400 dark:text-green-500'
                  }`} />
                  <h3 className="font-semibold">vs AI</h3>
                  <p className="text-sm text-muted-foreground">Play against computer</p>
                </CardContent>
              </Card>
            </Ripple>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleModeChange} 
              className={`flex-1 ${
                selectedMode === 'ai' 
                  ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                  : ''
              }`}
            >
              Switch Mode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}