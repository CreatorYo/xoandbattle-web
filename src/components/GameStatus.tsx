import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Bot, BarChart3 } from 'lucide-react';

export function GameStatus() {
  const { winner, currentPlayer, resetGame, gameSettings, gameStats, board } = useGame();

  const getStatusMessage = () => {
    if (winner) {
      return (
        <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl border border-yellow-500/30">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span className="text-lg font-bold text-yellow-600">Player {winner} Wins!</span>
        </div>
      );
    }

    const isDraw = !winner && board.every(cell => cell !== null);

    if (isDraw) {
      return (
        <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/30">
          <span className="text-lg font-bold text-blue-600">It's a Draw!</span>
        </div>
      );
    }

    return (
      <p className="text-sm font-medium text-muted-foreground">
        {gameSettings.gameMode === 'ai' ? <Bot className="h-4 w-4 inline mr-2 text-muted-foreground" /> : <Users className="h-4 w-4 inline mr-2 text-muted-foreground" />}
        Player {currentPlayer}'s Turn
      </p>
    );
  };

  return (
    <Card className="w-full bg-background/80 backdrop-blur-sm border-border/50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5 text-primary" />
          Game Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          {getStatusMessage()}
        </div>

        <div className="bg-muted/30 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Game Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-game-x mb-1">{gameStats.xWins}</div>
              <div className="text-xs text-muted-foreground font-medium">X Wins</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">{gameStats.draws}</div>
              <div className="text-xs text-muted-foreground font-medium">Draws</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-game-o mb-1">{gameStats.oWins}</div>
              <div className="text-xs text-muted-foreground font-medium">O Wins</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}