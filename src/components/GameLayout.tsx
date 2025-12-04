import { useState, useEffect } from 'react';
import { GameBoard } from './GameBoard';
import { GameStatus } from './GameStatus';
import { SettingsDialog } from './SettingsDialog';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useUIVisibility } from '@/hooks/use-ui-visibility';
import { useIsPWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { Ripple } from '@/components/ui/ripple';
import { Eye, RotateCcw, Gamepad2, Settings } from 'lucide-react';
import { GameModeDialog } from './GameModeDialog';
import { cn } from '@/lib/utils';

function TurnIndicator() {
  const { winner, currentPlayer, gameSettings, board, isAiThinking } = useGame();
  
  if (winner) {
    return null;
  }
  
  const isDraw = board.every(cell => cell !== null) && !winner;
  if (isDraw) {
    return null;
  }
  
  if (gameSettings.gameMode === 'ai') {
    if (isAiThinking) {
      return (
        <p className="text-base font-semibold" style={{ color: gameSettings.theme.oColor }}>
          AI is thinking...t
        </p>
      );
    }
    return (
      <p className="text-base font-semibold" style={{ color: gameSettings.theme.xColor }}>
        You're X and AI is O2tt
      </p>
    );
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
  const { theme, setTheme } = useTheme();
  const isPWA = useIsPWA();

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
      } else if (event.key.toLowerCase() === 't' && event.altKey && event.shiftKey) {
        event.preventDefault();
        if (theme === 'light') {
          setTheme('dark');
        } else if (theme === 'dark') {
          setTheme('system');
        } else {
          setTheme('light');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUIVisible, settingsOpen, gameModeOpen, resetGame, theme, setTheme]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">      

      {!isUIVisible && (
        <div className="fixed top-6 right-6 z-50">
          <Button
            onClick={toggleUIVisibility}
            variant="outline"
            size="sm"
            className="bg-background/90 backdrop-blur-md border-border/50 shadow-xl hover:bg-background transition-all duration-300 hover:scale-105"
            title="Show UI"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show UI
          </Button>
        </div>
      )}

      <div className={cn(
        "container mx-auto px-6 py-8 max-w-6xl relative z-10 pt-40",
        isPWA && "pt-48"
      )}>
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

        {isUIVisible && !gameSettings.showGameStatus && (winner || board.every(cell => cell !== null)) && (
          <div className="text-center mb-6">
            {winner ? (
              <div 
                className="text-3xl font-bold animate-in fade-in-0 zoom-in-95 duration-500 ease-out" 
                style={{ color: winner === 'X' ? gameSettings.theme.xColor : gameSettings.theme.oColor }}
              >
                {gameSettings.gameMode === 'ai' && winner === 'O' ? 'AI Wins!' : `Player ${winner} Wins!`}
              </div>
            ) : board.every(cell => cell !== null) ? (
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-500">
                  It's a Draw!
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center">
            <GameBoard />
          </div>
          
          {isUIVisible && !gameSettings.showGameStatus && (
            <div className="text-center space-y-6">
              
              <div className="space-y-3">
                <div className="flex gap-3 justify-center">
                  <Ripple className="w-12 h-12 rounded-full" color="rgba(239, 68, 68, 0.3)">
                  <Button 
                    onClick={resetGame} 
                    variant="outline"
                    size="sm"
                      className="w-12 h-12 p-0 rounded-full bg-red-500/10 border-0 hover:bg-red-500/20 transition-all duration-200"
                    title="Reset Game"
                  >
                    <RotateCcw className="!h-5 !w-5 text-red-500" />
                  </Button>
                  </Ripple>
                  
                  <GameModeDialog open={gameModeOpen} onOpenChange={setGameModeOpen}>
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Button 
                      variant="outline"
                      size="sm"
                        className="w-12 h-12 p-0 rounded-full bg-blue-500/10 border-0 hover:bg-blue-500/20 transition-all duration-200 relative z-10"
                      title="Change Game Mode"
                        onMouseDown={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const size = Math.max(rect.width, rect.height);
                          const x = e.clientX - rect.left - size / 2;
                          const y = e.clientY - rect.top - size / 2;
                          const ripple = document.createElement('span');
                          ripple.className = 'absolute rounded-full animate-ripple pointer-events-none';
                          ripple.style.cssText = `
                            left: ${x}px;
                            top: ${y}px;
                            width: ${size}px;
                            height: ${size}px;
                            background-color: rgba(59, 130, 246, 0.3);
                            transform: scale(0);
                            animation-duration: 600ms;
                            z-index: 0;
                          `;
                          e.currentTarget.parentElement?.appendChild(ripple);
                          setTimeout(() => ripple.remove(), 600);
                        }}
                    >
                      <Gamepad2 className="!h-5 !w-5 text-blue-500" />
                    </Button>
                    </div>
                  </GameModeDialog>

                  <Ripple className="w-12 h-12 rounded-full" color="rgba(34, 197, 94, 0.3)">
                  <Button 
                    variant="outline"
                    size="sm"
                      className="w-12 h-12 p-0 rounded-full bg-green-500/10 border-0 hover:bg-green-500/20 transition-all duration-200"
                    onClick={() => setSettingsOpen(true)}
                    title="Settings"
                  >
                    <Settings className="!h-5 !w-5 text-green-500" />
                  </Button>
                  </Ripple>
                </div>
              </div>
            </div>
          )}
          
          {isUIVisible && gameSettings.showGameStatus && (
            <div className={`fixed bottom-6 ${gameSettings.gameStatusPosition === 'left' ? 'left-6' : 'right-6'} z-40 max-w-sm`}>
                <GameStatus />
            </div>
          )}
                
          {isUIVisible && gameSettings.showGameStatus && (
            <div className="text-center space-y-6 mt-8">
                <div className="space-y-3">
                  <div className="flex gap-3 justify-center">
                    <Ripple className="w-12 h-12 rounded-full" color="rgba(239, 68, 68, 0.3)">
                    <Button 
                      onClick={resetGame} 
                      variant="outline"
                      size="sm"
                        className="w-12 h-12 p-0 rounded-full bg-red-500/10 border-0 hover:bg-red-500/20 transition-all duration-200"
                    >
                      <RotateCcw className="!h-5 !w-5 text-red-500" />
                    </Button>
                    </Ripple>
                    
                    <GameModeDialog>
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Button 
                        variant="outline"
                        size="sm"
                          className="w-12 h-12 p-0 rounded-full bg-blue-500/10 border-0 hover:bg-blue-500/20 transition-all duration-200 relative z-10"
                          onMouseDown={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const size = Math.max(rect.width, rect.height);
                            const x = e.clientX - rect.left - size / 2;
                            const y = e.clientY - rect.top - size / 2;
                            const ripple = document.createElement('span');
                            ripple.className = 'absolute rounded-full animate-ripple pointer-events-none';
                            ripple.style.cssText = `
                              left: ${x}px;
                              top: ${y}px;
                              width: ${size}px;
                              height: ${size}px;
                              background-color: rgba(59, 130, 246, 0.3);
                              transform: scale(0);
                              animation-duration: 600ms;
                              z-index: 0;
                            `;
                            e.currentTarget.parentElement?.appendChild(ripple);
                            setTimeout(() => ripple.remove(), 600);
                          }}
                      >
                        <Gamepad2 className="!h-5 !w-5 text-blue-500" />
                      </Button>
                      </div>
                    </GameModeDialog>

                    <Ripple className="w-12 h-12 rounded-full" color="rgba(34, 197, 94, 0.3)">
                    <Button 
                      variant="outline"
                      size="sm"
                        className="w-12 h-12 p-0 rounded-full bg-green-500/10 border-0 hover:bg-green-500/20 transition-all duration-200"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="!h-5 !w-5 text-green-500" />
                    </Button>
                    </Ripple>
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