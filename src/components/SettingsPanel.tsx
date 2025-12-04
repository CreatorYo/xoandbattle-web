import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun, Monitor, Bot, Users, Sparkles, Volume2, VolumeX } from 'lucide-react';

export function SettingsPanel() {
  const { gameSettings, updateSettings, gameStats } = useGame();
  const { theme, setTheme } = useTheme();

  const resetStats = () => {
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Display Mode
          </CardTitle>
          <CardDescription>
            Choose your preferred display theme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex-1 btn-hover-blue"
            >
              <Sun className="h-4 w-4 mr-2" />
              Light2
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex-1 btn-hover-blue"
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
              className="flex-1 btn-hover-blue"
            >
              <Monitor className="h-4 w-4 mr-2" />
              System
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Game Mode
          </CardTitle>
          <CardDescription>
            Switch between human vs human or AI opponent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={gameSettings.gameMode === 'human' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ gameMode: 'human' })}
              className="flex-1 btn-hover-blue"
            >
              <Users className="h-4 w-4 mr-2" />
              Human vs Human
            </Button>
            <Button
              variant={gameSettings.gameMode === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ gameMode: 'ai' })}
              className="flex-1 btn-hover-blue"
            >
              <Bot className="h-4 w-4 mr-2" />
              vs AI
            </Button>
          </div>

          {gameSettings.gameMode === 'ai' && (
            <div>
              <Label className="text-sm font-medium mb-2 block">AI Difficulty</Label>
                <Select
                  value={gameSettings.difficulty}
                  onValueChange={(value: 'easy' | 'medium' | 'hard' | 'unbeatable') => 
                    updateSettings({ difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy - Random moves</SelectItem>
                    <SelectItem value="medium">Medium - Smart moves</SelectItem>
                    <SelectItem value="hard">Hard - Very smart</SelectItem>
                    <SelectItem value="unbeatable">Unbeatable - Perfect play</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          )}
        </CardContent>
      </Card>

      Win Animations
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Win Animations
          </CardTitle>
          <CardDescription>
            Customise celebration effects when you win
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium mb-2 block">Animation Style</Label>
            <Select
              value={gameSettings.winAnimation}
              onValueChange={(value: 'none' | 'confetti' | 'sparkle' | 'glow') => 
                updateSettings({ winAnimation: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="confetti">🎉 Confetti</SelectItem>
                <SelectItem value="sparkle">✨ Sparkle</SelectItem>
                <SelectItem value="glow">🌟 Glow</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


      Game Statistics
      <Card>
        <CardHeader>
          <CardTitle>Game Statistics</CardTitle>
          <CardDescription>
            Your gaming performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-game-x">{gameStats.xWins}</div>
              <div className="text-sm text-muted-foreground">X Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-muted-foreground">{gameStats.draws}</div>
              <div className="text-sm text-muted-foreground">Draws</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-game-o">{gameStats.oWins}</div>
              <div className="text-sm text-muted-foreground">O Wins</div>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <div className="text-center text-sm text-muted-foreground mb-2">
              Total Games: {gameStats.xWins + gameStats.oWins + gameStats.draws}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetStats}
              className="w-full btn-hover-blue"
              disabled
            >
              Reset Statistics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}