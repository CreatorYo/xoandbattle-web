import { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { SettingsDialog } from './SettingsDialog';
import { useGame } from '@/contexts/GameContext';
import { useUIVisibility } from '@/hooks/use-ui-visibility';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Sparkles, RotateCcw, Gamepad2, Settings } from 'lucide-react';
import { GameModeDialog } from './GameModeDialog';

function TurnIndicator() {
  const { winner, currentPlayer, gameSettings, board } = useGame();
  
  if (winner) {
    return null;
  }
  
  const isDraw = board.every(cell => cell !== null) && !winner;
  if (isDraw) {
    return null;
  }
  
  const playerColor = currentPlayer === 'X' ? gameSettings.theme.xColor : gameSettings.theme.oColor;
  
  return (
    <p className="text-base font-semibold" style={{ color: playerColor }}>
      Please proceed with your turn Player {currentPlayer}
    </p>
  );
}

export function GameLayout() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gameModeOpen, setGameModeOpen] = useState(false);
  const { isUIVisible, toggleUIVisibility } = useUIVisibility();
  const { resetGame, gameSettings, winner, currentPlayer, board } = useGame();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isUIVisible || settingsOpen || gameModeOpen) return;

      if (event.key.toLowerCase() === 'r' && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        resetGame();
      } else if (event.key.toLowerCase() === 's' && !event.ctrlKey) {
        event.preventDefault();
        setGameModeOpen(true);
      } else if (event.key === ',' && event.ctrlKey) {
        event.preventDefault();
        setSettingsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUIVisible, settingsOpen, gameModeOpen, resetGame]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">      

      {!isUIVisible && (
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={toggleUIVisibility}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-md border-border/50 shadow-xl hover:bg-background transition-all duration-300 hover:scale-105"
            title="Show UI (Ctrl+/ or Cmd+/)"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show UI
          </Button>
        </div>
      )}

              <div className={`container mx-auto px-6 py-8 max-w-6xl relative z-10 ${!gameSettings.showGameStatus ? 'pt-32' : ''}`}>
        <div className="text-center mb-8">
          <div className="mb-4">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Tic Tac Toe
            </h1>
          </div>
          <p className="text-muted-foreground text-base mb-4 max-w-md mx-auto">
            Play against AI or a friend
          </p>
          <TurnIndicator />
        </div>

        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center">
            <GameBoard />
          </div>
          
          {isUIVisible && !gameSettings.showGameStatus && (
            <div className="text-center space-y-6">
              {winner ? (
                <div className="text-2xl font-bold" style={{ color: winner === 'X' ? gameSettings.theme.xColor : gameSettings.theme.oColor }}>
                  Player {winner} Wins!
                </div>
              ) : board.every(cell => cell !== null) ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-500 mb-2">
                    It's a draw!
                  </div>
                  <div className="text-sm text-gray-400">
                    Good luck next time
                  </div>
                </div>
              ) : null}
              
              <div className="space-y-3">
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={resetGame} 
                    variant="outline"
                    size="sm"
                    className="w-12 h-12 p-0 rounded-full bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 transition-all duration-200 shadow-lg hover:shadow-red-500/25 hover:scale-105"
                    title="Reset Game"
                  >
                    <RotateCcw className="!h-5 !w-5 text-red-500" />
                  </Button>
                  
                  <GameModeDialog open={gameModeOpen} onOpenChange={setGameModeOpen}>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 p-0 rounded-full bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                      title="Change Game Mode"
                    >
                      <Gamepad2 className="!h-5 !w-5 text-blue-500" />
                    </Button>
                  </GameModeDialog>

                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-12 h-12 p-0 rounded-full bg-green-500/10 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/20 transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-105"
                    onClick={() => setSettingsOpen(true)}
                    title="Settings"
                  >
                    <Settings className="!h-5 !w-5 text-green-500" />
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {isUIVisible && gameSettings.showGameStatus && (
            <div className="w-full max-w-md">
              <div className="space-y-6">
                <GameStatus />
                
                <div className="space-y-3">
                  <div className="flex gap-3 justify-center">
                    <Button 
                      onClick={resetGame} 
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 p-0 rounded-full bg-red-500/10 border-red-500/30 hover:border-red-500/50 hover:bg-red-500/20 transition-all duration-200 shadow-lg hover:shadow-red-500/25 hover:scale-105"
                    >
                      <RotateCcw className="!h-5 !w-5 text-red-500" />
                    </Button>
                    
                    <GameModeDialog>
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-12 h-12 p-0 rounded-full bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50 hover:bg-blue-500/20 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 hover:scale-105"
                      >
                        <Gamepad2 className="!h-5 !w-5 text-blue-500" />
                      </Button>
                    </GameModeDialog>

                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-12 h-12 p-0 rounded-full bg-green-500/10 border-green-500/30 hover:border-green-500/50 hover:bg-green-500/20 transition-all duration-200 shadow-lg hover:shadow-green-500/25 hover:scale-105"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="!h-5 !w-5 text-green-500" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}