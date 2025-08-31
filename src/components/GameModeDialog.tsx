import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Bot, Gamepad2 } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import type { GameMode, Difficulty } from '@/contexts/GameContext';

interface GameModeDialogProps {
  children: React.ReactNode;
}

export function GameModeDialog({ children }: GameModeDialogProps) {
  const { gameSettings, updateSettings, resetGame } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<GameMode>(gameSettings.gameMode);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(gameSettings.difficulty);

  // Update local state when dialog opens to reflect current settings
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSelectedMode(gameSettings.gameMode);
      setSelectedDifficulty(gameSettings.difficulty);
    }
    setIsOpen(open);
  };

  const handleModeChange = () => {
    updateSettings({
      gameMode: selectedMode,
      difficulty: selectedDifficulty,
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
          {/* Game Mode Selection */}
          <div className="grid grid-cols-2 gap-3">
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                selectedMode === 'human' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedMode('human')}
            >
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">Two Players</h3>
                <p className="text-sm text-muted-foreground">Play with a friend</p>
              </CardContent>
            </Card>
            
            <Card 
              className={`cursor-pointer transition-all border-2 ${
                selectedMode === 'ai' 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-muted-foreground/50'
              }`}
              onClick={() => setSelectedMode('ai')}
            >
              <CardContent className="p-4 text-center">
                <Bot className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">vs AI</h3>
                <p className="text-sm text-muted-foreground">Play against computer</p>
              </CardContent>
            </Card>
          </div>

          {/* AI Difficulty Selection */}
          {selectedMode === 'ai' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">AI Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={(value) => setSelectedDifficulty(value as Difficulty)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - Random moves</SelectItem>
                  <SelectItem value="medium">Medium - Some strategy</SelectItem>
                  <SelectItem value="hard">Hard - Good strategy</SelectItem>
                  <SelectItem value="unbeatable">Unbeatable - Perfect play</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleModeChange} className="flex-1">
              Switch Mode
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}