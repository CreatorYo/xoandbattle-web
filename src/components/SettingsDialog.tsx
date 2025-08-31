import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Palette, 
  Layout, 
  BarChart3, 
  Zap, 
  HelpCircle,
  Bot,
  Users,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  Accessibility
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

interface SettingsSectionProps {
  children: React.ReactNode;
}

const SettingsSection = ({ children }: SettingsSectionProps) => (
  <div className="space-y-6">{children}</div>
);

export function SettingsDialog() {
  const { gameSettings, updateSettings, persistentStats, resetPersistentStats } = useGame();
  const { theme, setTheme } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(() => {
    try {
      return localStorage.getItem('tic-tac-toe-reduce-motion') === 'true';
    } catch {
      return false;
    }
  });

  const handleThemeSelect = (theme: any) => {
    updateSettings({ theme });
  };
  const [activeSection, setActiveSection] = useState('appearance');
  const [open, setOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Apply reduce motion class to body
  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    localStorage.setItem('tic-tac-toe-reduce-motion', reduceMotion.toString());
  }, [reduceMotion]);

  const resetStatistics = () => {
    resetPersistentStats();
    setShowResetDialog(false);
  };

  const sidebarItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'gameplay', label: 'Gameplay', icon: Layout },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Appearance</h1>
              <p className="text-muted-foreground">Customise the look and feel of your game</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-1">App Theme</h3>
                  <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="flex flex-col items-center gap-2 h-16"
                  >
                    <Sun className="h-4 w-4" />
                    <span className="text-xs">Light</span>
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="flex flex-col items-center gap-2 h-16"
                  >
                    <Moon className="h-4 w-4" />
                    <span className="text-xs">Dark</span>
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="flex flex-col items-center gap-2 h-16"
                  >
                    <Monitor className="h-4 w-4" />
                    <span className="text-xs">System</span>
                  </Button>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <ThemeSelector />
              </div>
            </div>
          </SettingsSection>
        );


      case 'gameplay':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Gameplay</h1>
              <p className="text-muted-foreground">Configure game modes and AI difficulty</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Game Mode</h3>
                    <p className="text-sm text-muted-foreground">Choose your opponent type</p>
                  </div>
                </div>
                <Select 
                  value={gameSettings.gameMode} 
                  onValueChange={(value: 'human' | 'ai') => updateSettings({ gameMode: value })}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="human">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Human vs Human
                      </div>
                    </SelectItem>
                    <SelectItem value="ai">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Human vs AI
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {gameSettings.gameMode === 'ai' && (
                <div className="bg-card/50 rounded-lg border border-border/50 p-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">AI Difficulty</h3>
                      <p className="text-sm text-muted-foreground">Adjust the challenge level</p>
                    </div>
                  </div>
                  <Select 
                    value={gameSettings.difficulty} 
                    onValueChange={(value: any) => updateSettings({ difficulty: value })}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                      <SelectItem value="unbeatable">Unbeatable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </SettingsSection>
        );

      case 'effects':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Effects & Animations</h1>
              <p className="text-muted-foreground">Customise victory celebrations and animations</p>
            </div>

            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Win Celebrations</h3>
                  <p className="text-sm text-muted-foreground">Choose how victories are celebrated</p>
                </div>
              </div>
              <Select 
                value={gameSettings.winAnimation} 
                onValueChange={(value: any) => updateSettings({ winAnimation: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <span>None</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="confetti">
                    <div className="flex items-center gap-2">
                      <span>Confetti</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sparkle">
                    <div className="flex items-center gap-2">
                      <span>Sparkle</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="glow">
                    <div className="flex items-center gap-2">
                      <span>Glow</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </SettingsSection>
        );

      case 'accessibility':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Accessibility</h1>
              <p className="text-muted-foreground">Customise your game for better usability</p>
            </div>

            <div className="bg-card/50 rounded-lg border border-border/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Accessibility className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Reduce Motion</h3>
                    <p className="text-sm text-muted-foreground">Disable animations and transitions</p>
                  </div>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={reduceMotion}
                  onCheckedChange={(checked) => setReduceMotion(checked)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Disabling animations and transitions can improve performance and reduce motion sickness for some users.
              </p>
            </div>
          </SettingsSection>
        );

      case 'statistics':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Statistics</h1>
              <p className="text-muted-foreground">View your game performance and manage data</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-foreground mb-1">Game Performance</h3>
                  <p className="text-sm text-muted-foreground">Your current statistics</p>
                </div>
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl font-bold text-red-500">{persistentStats.xWins}</div>
                    </div>
                    <div className="text-sm font-medium text-foreground">X Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl font-bold text-muted-foreground">{persistentStats.draws}</div>
                    </div>
                    <div className="text-sm font-medium text-foreground">Draws</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                      <div className="text-2xl font-bold text-green-500">{persistentStats.oWins}</div>
                    </div>
                    <div className="text-sm font-medium text-foreground">O Wins</div>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-1">Reset Data</h3>
                  <p className="text-sm text-muted-foreground">Clear all statistics and start fresh</p>
                </div>
                <Button 
                  onClick={() => setShowResetDialog(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset All Statistics
                </Button>
              </div>
            </div>
          </SettingsSection>
        );


      case 'help':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Help & Support</h1>
              <p className="text-muted-foreground">Get help and learn how to play</p>
            </div>

            <div className="space-y-6">
              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-1">How to Play</h3>
                  <p className="text-sm text-muted-foreground">Learn the basics of Tic-Tac-Toe</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-foreground">Click on any empty cell to place your mark</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-foreground">Get three in a row (horizontal, vertical, or diagonal) to win</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-foreground">Choose AI mode to play against the computer</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-foreground">Customise themes and animations in Appearance settings</p>
                  </div>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-1">About</h3>
                  <p className="text-sm text-muted-foreground">Information about this application</p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A modern Tic-Tac-Toe game with customizable themes, AI opponents, and smooth animations.
                  Built with React and Tailwind CSS for the ultimate gaming experience.
                </p>
              </div>
            </div>
          </SettingsSection>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="btn-hover-blue">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 overflow-hidden md:overflow-auto bg-background/95 backdrop-blur-md border-border/50">
        <div className="flex h-full">
          {/* Ultra Clean Sidebar */}
          <div className="w-64 bg-muted/20 border-r border-border/30 flex flex-col">
            <div className="p-6 border-b border-border/20">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <Settings className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg">Settings</h3>
                </div>
              </div>
            </div>
            
            <nav className="flex-1 p-4 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full group flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-200 mb-2 ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-500/30 text-blue-700 dark:text-blue-300' 
                        : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm ${isActive ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                        {item.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Ultra Clean Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 max-w-4xl mx-auto">
                <div className="animate-fade-in">
                  {renderContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

      {/* Reset Statistics Confirmation Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-destructive" />
              Reset Statistics
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to reset all statistics? This action cannot be undone and will permanently delete all your game data.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowResetDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetStatistics}
              >
                Reset All Statistics
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}