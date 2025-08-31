import { useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { SettingsDialog } from './SettingsDialog';
import { useGame } from '@/contexts/GameContext';
import { useUIVisibility } from '@/hooks/use-ui-visibility';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

function TurnIndicator() {
  const { winner, currentPlayer, gameSettings, board } = useGame();
  
  if (winner) {
    return null; // GameStatus will handle winner display
  }
  
  const isDraw = board.every(cell => cell !== null) && !winner;
  if (isDraw) {
    return null; // Don't show draw message
  }
  
  const playerColor = currentPlayer === 'X' ? gameSettings.theme.xColor : gameSettings.theme.oColor;
  
  return (
    <p className="text-sm font-semibold" style={{ color: playerColor }}>
      Please proceed with your turn, Player {currentPlayer}
    </p>
  );
}

export function GameLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { isUIVisible, toggleUIVisibility } = useUIVisibility();

  return (
    <div className="min-h-screen bg-background relative">      
      {/* Floating UI Toggle Button - Only show when UI is hidden */}
      {!isUIVisible && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={toggleUIVisibility}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border/50 shadow-lg hover:bg-background/90"
            title="Show UI (Ctrl+/ or Cmd+/)"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show UI
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header - Always visible */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Tic-Tac-Toe
          </h1>
          <p className="text-muted-foreground text-sm mb-2">
            Play against AI or with friends
          </p>
          <TurnIndicator />
        </div>

        {/* Game Content */}
        <div className="flex flex-col items-center space-y-8">
          {/* Game Board */}
          <GameBoard />
          
          {/* Game Status - Only show if UI is visible */}
          {isUIVisible && <GameStatus />}

          {/* Settings Controls - Only show if UI is visible */}
          {isUIVisible && (
            <div className="flex gap-3">
              <SettingsDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}