import { useGame } from '@/contexts/GameContext';
import { cn } from '@/lib/utils';

export function GameBoard() {
  const { board, makeMove, winner, winningLine, gameSettings, isAiThinking } = useGame();

  const getCellContent = (index: number) => {
    const value = board[index];
    if (!value) return null;

    const isWinningCell = winningLine?.includes(index);
    const baseClasses = "text-5xl font-bold transition-all duration-300";
    
    if (value === 'X') {
      return (
        <span 
          className={cn(
            baseClasses,
            "text-game-x animate-piece-appear",
            isWinningCell && gameSettings.winAnimation === 'glow' && "animate-winner-glow",
            isWinningCell && gameSettings.winAnimation === 'sparkle' && "animate-sparkle"
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
          "text-game-o animate-piece-appear",
          isWinningCell && gameSettings.winAnimation === 'glow' && "animate-winner-glow",
          isWinningCell && gameSettings.winAnimation === 'sparkle' && "animate-sparkle"
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
        "grid grid-cols-3 gap-3 p-6 rounded-xl shadow-lg border bg-board-bg border-board-border transition-all duration-300",
        isAiThinking && "opacity-60 pointer-events-none"
      )}
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
            winningLine?.includes(index) && "ring-2 ring-game-winner shadow-winner"
          )}
          style={{
            backgroundColor: gameSettings.theme.enableBoxFill && board[index] 
              ? (board[index] === 'X' ? `${gameSettings.theme.xColor}20` : `${gameSettings.theme.oColor}20`)
              : undefined
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