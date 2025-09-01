import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export function GameBoard() {
  const { board, makeMove, winner, winningLine, gameSettings, isAiThinking } = useGame();
  const { theme } = useTheme();

  const getCellContent = (index: number) => {
    const value = board[index];
    if (!value) return null;

    const isWinningCell = winningLine?.includes(index);
    
    const getFontSizeClass = () => {
      switch (gameSettings.gridFontSize) {
        case 'very-small': return 'text-3xl';
        case 'small': return 'text-4xl';
        case 'large': return 'text-6xl';
        case 'very-large': return 'text-7xl';
        default: return 'text-5xl';
      }
    };
    
    const baseClasses = `${getFontSizeClass()} font-bold transition-all duration-300`;
    
    if (value === 'X') {
      return (
        <span 
          className={cn(
            baseClasses,
            "text-game-x",
            gameSettings.enableAnimations && "animate-piece-appear",
            isWinningCell && gameSettings.enableAnimations && gameSettings.winAnimation === 'glow' && "animate-winner-glow",
            isWinningCell && gameSettings.enableAnimations && gameSettings.winAnimation === 'sparkle' && "animate-sparkle"
          )}
          style={{ color: gameSettings.theme.xColor }}
        >
          ×
        </span>
      );
    }

    return (
      <span 
        className={cn(
          baseClasses,
          "text-game-o",
          gameSettings.enableAnimations && "animate-piece-appear",
          isWinningCell && gameSettings.enableAnimations && gameSettings.winAnimation === 'glow' && "animate-winner-glow",
          isWinningCell && gameSettings.enableAnimations && gameSettings.winAnimation === 'sparkle' && "animate-sparkle"
        )}
        style={{ color: gameSettings.theme.oColor }}
      >
        ○
      </span>
    );
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-3 gap-3 p-6 rounded-xl transition-all duration-300",
        theme === 'light' ? '' : 'shadow-lg',
        isAiThinking && "opacity-60 pointer-events-none"
      )}
      style={{ backgroundColor: 'transparent' }}
    >
      {board.map((_, index) => (
        <button
          key={index}
          onClick={() => makeMove(index)}
          disabled={!!winner || !!board[index] || isAiThinking}
          className={cn(
            "game-cell w-24 h-24 sm:w-28 sm:h-28",
            "flex items-center justify-center rounded-lg",
            "disabled:cursor-not-allowed transition-all duration-200",
            !board[index] && !winner && !isAiThinking && "hover:scale-105 cursor-pointer hover:shadow-md",
            winningLine?.includes(index) && "ring-2 ring-game-winner hover:scale-110 winning-cell-hover"
          )}
          style={{
            backgroundColor: gameSettings.theme.enableBoxFill && board[index] 
              ? (board[index] === 'X' ? `${gameSettings.theme.xColor}20` : `${gameSettings.theme.oColor}20`)
              : undefined,
            boxShadow: winningLine?.includes(index) && winner 
              ? `0 0 30px ${winner === 'X' ? gameSettings.theme.xColor : gameSettings.theme.oColor}60`
              : undefined,
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {getCellContent(index)}
        </button>
      ))}
      
      {isAiThinking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm font-medium text-foreground">AI is thinking...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}