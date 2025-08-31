import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GameModeDialog } from './GameModeDialog';
import { RotateCcw, Trophy, Users, Bot, Gamepad2 } from 'lucide-react';

export function GameStatus() {
  const { winner, currentPlayer, resetGame, gameSettings, gameStats, board } = useGame();

  const getStatusMessage = () => {
    if (winner) {
      return (
        <div className="flex items-center gap-2 text-game-winner font-semibold">
          <Trophy className="h-5 w-5" />
          <span>Player {winner} Wins!</span>
        </div>
      );
    }

    const isDraw = !winner && board.every(cell => cell !== null);

    if (isDraw) {
      return <span className="text-muted-foreground font-medium">It's a Draw!</span>;
    }

    return (
      <div className="flex items-center gap-2 font-medium">
        {gameSettings.gameMode === 'ai' ? <Bot className="h-5 w-5" /> : <Users className="h-5 w-5" />}
        <span>Player {currentPlayer}'s Turn</span>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            {getStatusMessage()}
          </div>

          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg text-game-x">{gameStats.xWins}</div>
              <div className="text-muted-foreground">X</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-muted-foreground">{gameStats.draws}</div>
              <div className="text-muted-foreground">Draws</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg text-game-o">{gameStats.oWins}</div>
              <div className="text-muted-foreground">O</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={resetGame} 
              variant="outline"
              size="sm"
              className="flex items-center gap-2 btn-hover-blue"
            >
              <RotateCcw className="h-4 w-4" />
              New Game
            </Button>
            
            <GameModeDialog>
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2 btn-hover-blue"
              >
                <Gamepad2 className="h-4 w-4" />
                Switch Mode
              </Button>
            </GameModeDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}