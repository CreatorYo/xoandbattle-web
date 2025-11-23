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
            isWinningCell && gameSettings.enableAnimations && gameSettings.winAnimation === 'glow' && "animate-winner-glow"
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
          isWinningCell && gameSettings.enableAnimations && gameSettings.winAnimation === 'glow' && "animate-winner-glow"
        )}
        style={{ color: gameSettings.theme.oColor }}
      >
        ○
      </span>
    );
  };

  const boardStyling = gameSettings.boardStyling;
  const cellBorderRadius = boardStyling.style === 'rounded' 
    ? (boardStyling.borderRadius || 24)
    : boardStyling.style === 'custom'
    ? (boardStyling.borderRadius || 12)
    : 12;

  const getCellBackground = (index: number) => {
    if (boardStyling.style === 'custom') {
      if (boardStyling.useGradient && boardStyling.gradientColors && boardStyling.gradientColors.length >= 2) {
        return `linear-gradient(135deg, ${boardStyling.gradientColors[0]}, ${boardStyling.gradientColors[1]})`;
      }
      if (boardStyling.backgroundColor && boardStyling.backgroundColor !== 'transparent') {
        if (gameSettings.theme.enableBoxFill && board[index]) {
          const boxFillColor = board[index] === 'X' 
            ? `${gameSettings.theme.xColor}20` 
            : `${gameSettings.theme.oColor}20`;
          return boxFillColor;
        }
        return boardStyling.backgroundColor;
      }
    }
    if (gameSettings.theme.enableBoxFill && board[index]) {
      return board[index] === 'X' 
        ? `${gameSettings.theme.xColor}20` 
        : `${gameSettings.theme.oColor}20`;
    }
    return undefined;
  };

  const getCellBackgroundImage = (index: number) => {
    if (boardStyling.style === 'custom' && boardStyling.useGradient && boardStyling.gradientColors && boardStyling.gradientColors.length >= 2) {
      if (gameSettings.theme.enableBoxFill && board[index]) {
        return undefined;
      }
      return `linear-gradient(135deg, ${boardStyling.gradientColors[0]}, ${boardStyling.gradientColors[1]})`;
    }
    return undefined;
  };

  return (
    <div 
      className={cn(
        "grid grid-cols-3 gap-3 p-6 transition-all duration-300",
        isAiThinking && "opacity-60 pointer-events-none"
      )}
      style={{ 
        borderRadius: boardStyling.style === 'custom' 
          ? `${boardStyling.borderRadius || 12}px` 
          : boardStyling.style === 'rounded'
          ? `${boardStyling.borderRadius || 24}px`
          : undefined,
      }}
    >
      {board.map((_, index) => {
        const isWinningCell = winningLine?.includes(index);
        const shouldDim = winner && winningLine && !isWinningCell;
        
        return (
          <button
            key={index}
            onClick={() => makeMove(index)}
            disabled={!!winner || !!board[index] || isAiThinking}
            className={cn(
              "game-cell w-24 h-24 sm:w-28 sm:h-28",
              "flex items-center justify-center",
              "disabled:cursor-not-allowed transition-all duration-200",
              !board[index] && !winner && !isAiThinking && "cursor-pointer hover:shadow-md",
              isWinningCell && "ring-2 ring-game-winner winning-cell-hover"
            )}
            style={{
              borderRadius: `${cellBorderRadius}px`,
              backgroundColor: getCellBackground(index),
              backgroundImage: getCellBackgroundImage(index),
              borderWidth: boardStyling.style === 'custom' && boardStyling.borderWidth !== undefined 
                ? `${boardStyling.borderWidth}px` 
                : undefined,
              borderColor: boardStyling.style === 'custom' && boardStyling.borderColor 
                ? boardStyling.borderColor 
                : undefined,
              borderStyle: boardStyling.style === 'custom' && boardStyling.borderWidth !== undefined && boardStyling.borderWidth > 0 
                ? 'solid' 
                : undefined,
              boxShadow: isWinningCell && winner 
                ? `0 0 30px ${winner === 'X' ? gameSettings.theme.xColor : gameSettings.theme.oColor}60`
                : undefined,
              opacity: shouldDim ? 0.65 : 1,
              transition: 'all 0.3s ease-in-out'
            }}
          >
            {getCellContent(index)}
          </button>
        );
      })}
      

    </div>
  );
}