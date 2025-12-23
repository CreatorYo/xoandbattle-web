import { useState, useEffect, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { playMoveSound, playWinSound, playDrawSound, playErrorSound } from '@/lib/sounds';

export function GameBoard() {
  const { board, makeMove, winner, winningLine, gameSettings, isAiThinking } = useGame();
  const { theme } = useTheme();
  const [focusedCell, setFocusedCell] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevWinnerRef = useRef<typeof winner>(null);
  const prevBoardRef = useRef<typeof board>(board);
  const soundPlayedRef = useRef<{ type: 'move' | 'win' | 'draw' | null; boardHash: string }>({ type: null, boardHash: '' });

  const getCellContent = (index: number) => {
    const value = board[index];
    if (!value) return null;

    const isWinningCell = winningLine?.includes(index);
    
    const xSymbol = gameSettings.theme.xSymbol || '×';
    const oSymbol = gameSettings.theme.oSymbol || '○';
    
    const isEmojiX = xSymbol !== '×' && /[\p{Emoji}]/u.test(xSymbol);
    const isEmojiO = oSymbol !== '○' && /[\p{Emoji}]/u.test(oSymbol);
    const hasCustomSymbols = isEmojiX || isEmojiO;
    
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
    const shouldAnimate = gameSettings.enableAnimations && !hasCustomSymbols;
    
    if (value === 'X') {
      return (
        <span 
          className={cn(
            baseClasses,
            "text-game-x",
            shouldAnimate && "animate-piece-appear",
            isWinningCell && shouldAnimate && gameSettings.winAnimation === 'glow' && "animate-winner-glow"
          )}
          style={{ color: gameSettings.theme.xColor }}
        >
          {xSymbol}
        </span>
      );
    }

    return (
      <span 
        className={cn(
          baseClasses,
          "text-game-o",
          shouldAnimate && "animate-piece-appear",
          isWinningCell && shouldAnimate && gameSettings.winAnimation === 'glow' && "animate-winner-glow"
        )}
        style={{ color: gameSettings.theme.oColor }}
      >
        {oSymbol}
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

  useEffect(() => {
    if (!gameSettings.enableSounds) {
      prevWinnerRef.current = winner;
      prevBoardRef.current = [...board];
      return;
    }

    const boardHash = board.join('');
    const prevBoardHash = prevBoardRef.current.join('');
    const hasWinner = winner && !prevWinnerRef.current;
    const isDraw = !winner && board.every(cell => cell !== null) && !prevBoardRef.current.every(cell => cell !== null);
    const hasNewMove = boardHash !== prevBoardHash && !isAiThinking;

    if (hasWinner && soundPlayedRef.current.type !== 'win') {
      playWinSound();
      soundPlayedRef.current = { type: 'win', boardHash };
    } else if (isDraw && soundPlayedRef.current.type !== 'draw') {
      playDrawSound();
      soundPlayedRef.current = { type: 'draw', boardHash };
    } else if (hasNewMove && soundPlayedRef.current.type !== 'move' && soundPlayedRef.current.boardHash !== boardHash) {
      playMoveSound();
      soundPlayedRef.current = { type: 'move', boardHash };
    }

    prevWinnerRef.current = winner;
    prevBoardRef.current = [...board];
  }, [board, winner, gameSettings.enableSounds, isAiThinking]);

  useEffect(() => {
    if (board.every(cell => cell === null)) {
      soundPlayedRef.current = { type: null, boardHash: '' };
    }
  }, [board]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (winner || isAiThinking) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const arrowKeyMap: Record<string, number> = {
        'ArrowUp': -3,
        'ArrowDown': 3,
        'ArrowLeft': -1,
        'ArrowRight': 1,
      };

      if (arrowKeyMap[e.key]) {
        e.preventDefault();
        const currentFocus = focusedCell ?? 0;
        let newFocus = currentFocus + arrowKeyMap[e.key];

        if (e.key === 'ArrowUp' && currentFocus < 3) newFocus = currentFocus + 6;
        if (e.key === 'ArrowDown' && currentFocus >= 6) newFocus = currentFocus - 6;
        if (e.key === 'ArrowLeft' && currentFocus % 3 === 0) newFocus = currentFocus + 2;
        if (e.key === 'ArrowRight' && (currentFocus + 1) % 3 === 0) newFocus = currentFocus - 2;

        newFocus = Math.max(0, Math.min(8, newFocus));
        setFocusedCell(newFocus);
        cellRefs.current[newFocus]?.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedCell !== null && !board[focusedCell] && !winner) {
          makeMove(focusedCell);
          if (gameSettings.enableSounds) {
            playMoveSound();
          }
        } else if (focusedCell !== null && board[focusedCell]) {
          if (gameSettings.enableSounds) {
            playErrorSound();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, board, winner, isAiThinking, makeMove, gameSettings.enableSounds]);

  useEffect(() => {
    if (winner || board.every(cell => cell !== null)) {
      setFocusedCell(null);
    }
  }, [winner, board]);

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
            ref={(el) => { cellRefs.current[index] = el; }}
            onClick={() => {
              if (!board[index] && !winner && !isAiThinking) {
                makeMove(index);
                if (gameSettings.enableSounds) {
                  playMoveSound();
                }
              } else if (gameSettings.enableSounds) {
                playErrorSound();
              }
            }}
            onFocus={() => setFocusedCell(index)}
            onBlur={() => {
              if (document.activeElement !== cellRefs.current[index]) {
                setFocusedCell(null);
              }
            }}
            disabled={!!winner || !!board[index] || isAiThinking}
            tabIndex={focusedCell === index ? 0 : -1}
            aria-label={board[index] ? `Cell ${index + 1}, ${board[index]}` : `Cell ${index + 1}, empty`}
            className={cn(
              "game-cell w-24 h-24 sm:w-28 sm:h-28",
              "flex items-center justify-center",
              "disabled:cursor-not-allowed transition-all duration-100",
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
              transition: 'all 0.1s ease-in-out'
            }}
          >
            {getCellContent(index)}
          </button>
        );
      })}
      

    </div>
  );
}