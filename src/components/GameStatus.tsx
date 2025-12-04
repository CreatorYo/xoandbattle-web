import { useGame } from '@/contexts/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Bot } from 'lucide-react';

export function GameStatus() {
  const { winner, currentPlayer, gameSettings, gameStats, board, isAiThinking } = useGame();

  const getStatusMessage = () => {
    if (winner) {
      const isAiWin = gameSettings.gameMode === 'ai' && winner === 'O';
      return (
        <span className={`text-base font-semibold ${winner === 'X' ? 'text-game-x' : 'text-game-o'}`}>
          {isAiWin ? 'AI Wins!' : `Player ${winner} Wins!`}
        </span>
      );
    }

    const isDraw = !winner && board.every(cell => cell !== null);

    if (isDraw) {
      return (
        <span className="text-base font-semibold text-muted-foreground">It's a Draw!</span>
      );
    }

    return (
      <div className="flex items-center justify-center gap-2">
        {gameSettings.gameMode === 'ai' ? (
          <Bot className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Users className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-sm text-muted-foreground">Player {currentPlayer}'s Turn</span>
      </div>
    );
  };

  return (
    <Card className="w-full bg-card border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2.5 min-w-0">
            {gameSettings.gameMode === 'ai' ? (
              <Bot className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            )}
            <span className="text-sm text-foreground whitespace-nowrap">
              {winner 
                ? (gameSettings.gameMode === 'ai' && winner === 'O' ? 'AI Wins!' : `Player ${winner} Wins!`)
                : (!winner && board.every(cell => cell !== null) 
                  ? "It's a Draw!" 
                  : gameSettings.gameMode === 'ai'
                    ? (isAiThinking ? "AI's turn" : currentPlayer === 'X' ? 'Your turn' : "AI's turn")
                  : `Player ${currentPlayer}'s Turn`)
              }
            </span>
          </div>
          
          <div className="flex items-center gap-5 flex-shrink-0">
            <div className="text-center min-w-[32px]">
              <div className="text-lg font-bold leading-tight" style={{ color: gameSettings.theme.xColor }}>{gameStats.xWins}</div>
              <div className="text-xs text-muted-foreground mt-1">X</div>
            </div>
            <div className="text-center min-w-[32px]">
              <div className="text-lg font-bold text-muted-foreground leading-tight">{gameStats.draws}</div>
              <div className="text-xs text-muted-foreground mt-1">-</div>
            </div>
            <div className="text-center min-w-[32px]">
              <div className="text-lg font-bold leading-tight" style={{ color: gameSettings.theme.oColor }}>{gameStats.oWins}</div>
              <div className="text-xs text-muted-foreground mt-1">{gameSettings.gameMode === 'ai' ? 'AI' : 'O'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}