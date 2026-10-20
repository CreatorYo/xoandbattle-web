import { useState, useEffect, useRef } from 'react';
import { useGame, type GameSettings } from '@/contexts/GameContext';
import { cn, isModalOpen, isTypingOrMenuTarget } from '@/lib/utils';
import { playMoveSound, playWinSound, playLoseSound, playDrawSound, playErrorSound } from '@/lib/sounds';
import { DEFAULT_O_SYMBOL, DEFAULT_X_SYMBOL, getSymbols } from '@/lib/symbols';

const FONT_SIZE_CLASSES: Record<GameSettings['gridFontSize'], string> = {
  'very-small': 'text-3xl',
  small: 'text-4xl',
  medium: 'text-5xl',
  large: 'text-6xl',
  'very-large': 'text-7xl',
};

const ARROW_OFFSETS: Record<string, number> = {
  ArrowUp: -3,
  ArrowDown: 3,
  ArrowLeft: -1,
  ArrowRight: 1,
};

const isEmoji = (symbol: string, fallback: string) =>
  symbol !== fallback && /\p{Extended_Pictographic}/u.test(symbol);

function moveFocus(current: number, key: string) {
  if (key === 'ArrowUp' && current < 3) return current + 6;
  if (key === 'ArrowDown' && current >= 6) return current - 6;
  if (key === 'ArrowLeft' && current % 3 === 0) return current + 2;
  if (key === 'ArrowRight' && current % 3 === 2) return current - 2;
  return Math.max(0, Math.min(8, current + ARROW_OFFSETS[key]));
}

export function GameBoard() {
  const { board, makeMove, currentPlayer, winner, winningLine, gameSettings, isAiThinking } = useGame();
  const [focusedCell, setFocusedCell] = useState<number | null>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const prevWinnerRef = useRef<typeof winner>(null);
  const prevBoardRef = useRef<typeof board>(board);

  const { theme, boardStyling, enableSounds } = gameSettings;
  const symbols = getSymbols(theme);
  const shouldAnimate =
    gameSettings.enableAnimations &&
    !isEmoji(symbols.x, DEFAULT_X_SYMBOL) &&
    !isEmoji(symbols.o, DEFAULT_O_SYMBOL);

  const isCustom = boardStyling.style === 'custom';
  const cellBorderRadius =
    boardStyling.style === 'standard' ? 12 : (boardStyling.borderRadius ?? (isCustom ? 12 : 24));
  const gradient =
    isCustom && boardStyling.useGradient && boardStyling.gradientColors && boardStyling.gradientColors.length >= 2
      ? `linear-gradient(135deg, ${boardStyling.gradientColors[0]}, ${boardStyling.gradientColors[1]})`
      : undefined;
  const customBackground =
    isCustom && boardStyling.backgroundColor !== 'transparent' ? boardStyling.backgroundColor : undefined;
  const borderWidth = isCustom ? boardStyling.borderWidth : undefined;
  const winnerColor = winner === 'X' ? theme.xColor : theme.oColor;

  const getCellFill = (index: number) => {
    const value = board[index];
    if (theme.enableBoxFill && value) {
      return { backgroundColor: `${value === 'X' ? theme.xColor : theme.oColor}20` };
    }
    if (gradient) return { backgroundImage: gradient };
    return { backgroundColor: customBackground };
  };

  const playCell = (index: number) => {
    if (winner || isAiThinking) return;
    if (board[index]) {
      if (enableSounds) playErrorSound();
      return;
    }
    makeMove(index);
    if (enableSounds) playMoveSound(currentPlayer === 'O' ? 'O' : 'X');
  };

  useEffect(() => {
    const prevBoard = prevBoardRef.current;
    const prevWinner = prevWinnerRef.current;
    prevBoardRef.current = board;
    prevWinnerRef.current = winner;

    if (!enableSounds) return;

    const isAiMode = gameSettings.gameMode === 'ai';
    if (isAiMode && board.some((cell, index) => cell === 'O' && prevBoard[index] !== 'O')) {
      playMoveSound('O');
    }

    if (winner && !prevWinner) {
      if (isAiMode && winner === 'O') playLoseSound();
      else playWinSound();
    } else if (!winner && board.every(Boolean) && !prevBoard.every(Boolean)) {
      playDrawSound();
    }
  }, [board, winner, enableSounds, gameSettings.gameMode]);

  const isOver = !!winner || board.every((cell) => cell !== null);
  if (isOver && focusedCell !== null) {
    setFocusedCell(null);
  }

  const firstEmptyCell = board.findIndex((cell) => cell === null);
  const tabStop = focusedCell ?? (firstEmptyCell === -1 ? 0 : firstEmptyCell);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (winner || isAiThinking) return;
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      if (isModalOpen() || isTypingOrMenuTarget(event.target)) return;

      const target = event.target;
      const isBoardTarget =
        target === document.body ||
        target === document.documentElement ||
        cellRefs.current.some((cell) => cell === target);
      if (!isBoardTarget) return;

      if (event.key in ARROW_OFFSETS) {
        event.preventDefault();
        const next = focusedCell === null ? tabStop : moveFocus(focusedCell, event.key);
        setFocusedCell(next);
        cellRefs.current[next]?.focus();
      } else if ((event.key === 'Enter' || event.key === ' ') && focusedCell !== null) {
        event.preventDefault();
        playCell(focusedCell);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div
      className={cn(
        'grid grid-cols-3 gap-3 p-4 transition-opacity duration-300 sm:p-6',
        isAiThinking && 'opacity-60'
      )}
    >
      {board.map((value, index) => {
        const isWinningCell = !!winningLine?.includes(index);
        const shouldDim = !!winner && !!winningLine && !isWinningCell;
        const isPlayable = !value && !winner && !isAiThinking;

        return (
          <button
            key={index}
            ref={(element) => {
              cellRefs.current[index] = element;
            }}
            type="button"
            onClick={() => playCell(index)}
            onFocus={() => setFocusedCell(index)}
            onBlur={() => {
              if (document.activeElement !== cellRefs.current[index]) {
                setFocusedCell(null);
              }
            }}
            aria-disabled={!isPlayable}
            tabIndex={tabStop === index ? 0 : -1}
            aria-label={value ? `Cell ${index + 1}, ${value}` : `Cell ${index + 1}, empty`}
            className={cn(
              'game-cell flex size-[min(88px,calc((100vw_-_104px)/3))] items-center justify-center sm:size-24',
              'transition-[background-color,box-shadow,opacity,scale] duration-100 ease-in-out',
              'outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand',
              isPlayable ? 'cursor-pointer active:scale-[0.97]' : 'cursor-not-allowed',
              shouldDim && 'opacity-65'
            )}
            style={{
              ...getCellFill(index),
              borderRadius: `${cellBorderRadius}px`,
              borderWidth: borderWidth !== undefined ? `${borderWidth}px` : undefined,
              borderColor: isCustom ? boardStyling.borderColor : undefined,
              borderStyle: borderWidth ? 'solid' : undefined,
              boxShadow: isWinningCell && winner ? `0 0 0 2px ${winnerColor}, 0 0 28px ${winnerColor}60` : undefined,
            }}
          >
            {value && (
              <span
                data-mark={value === 'X' ? symbols.x : symbols.o}
                className={cn(
                  FONT_SIZE_CLASSES[gameSettings.gridFontSize] ?? 'text-5xl',
                  'font-bold',
                  shouldAnimate && 'animate-piece-appear',
                  isWinningCell && shouldAnimate && gameSettings.winAnimation === 'glow' && 'winner-glow'
                )}
                style={{ color: value === 'X' ? theme.xColor : theme.oColor }}
              >
                {value === 'X' ? symbols.x : symbols.o}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
