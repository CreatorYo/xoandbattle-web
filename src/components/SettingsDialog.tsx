import { useState, useEffect } from 'react';
import { useGame, defaultThemes } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
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
  Accessibility,
  Database,
  Download,
  Upload,
  ChevronDown,
  Trash2,
  Play,
  Check,
  Minus,
  PartyPopper
} from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { Ripple } from '@/components/ui/ripple';

interface SettingsSectionProps {
  children: React.ReactNode;
}

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsSection = ({ children }: SettingsSectionProps) => (
  <div className="space-y-6">{children}</div>
);

export function SettingsDialog({ open: externalOpen, onOpenChange: externalOnOpenChange }: SettingsDialogProps) {
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
  const [internalOpen, setInternalOpen] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showResetSettingsDialog, setShowResetSettingsDialog] = useState(false);
  const [showResetThemesDialog, setShowResetThemesDialog] = useState(false);
  const [showResetEverythingDialog, setShowResetEverythingDialog] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalOnOpenChange || setInternalOpen;

  useEffect(() => {
    if (reduceMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
    localStorage.setItem('tic-tac-toe-reduce-motion', reduceMotion.toString());
  }, [reduceMotion]);

  useEffect(() => {
    (window as any).showSettings = () => setOpen(true);
  }, [setOpen]);

  const resetStatistics = () => {
    resetPersistentStats();
    setShowResetDialog(false);
  };

  const resetSettings = () => {
    updateSettings({
      gameMode: 'human',
      difficulty: 'medium',
      winAnimation: 'confetti',
      theme: defaultThemes[0],
      showGameStatus: true,
      enableAnimations: true,
      gridFontSize: 'medium'
    });
    setShowResetSettingsDialog(false);
  };

  const resetThemes = () => {
    localStorage.removeItem('tic-tac-toe-custom-themes');
    window.location.reload();
  };

  const resetEverything = () => {
    localStorage.clear();
    window.location.reload();
  };

  const sidebarItems = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'gameplay', label: 'Gameplay', icon: Layout },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'statistics', label: 'Statistics', icon: BarChart3 },
    { id: 'data', label: 'Data', icon: Database },
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
            
            <div className="space-y-4">
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-1">Theme</h3>
                  <p className="text-sm text-muted-foreground">Choose between light, dark, or system theme</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setTheme('light')}
                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                      theme === 'light' 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80'
                    }`}
                  >
                    <div className="p-4">
                      <div className="mb-3 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                          <Sun className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
                        <div className="h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full w-3/4"></div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-sm font-medium text-foreground">Light</span>
                      </div>
                    </div>
                    {theme === 'light' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => setTheme('dark')}
                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80'
                    }`}
                  >
                    <div className="p-4">
                      <div className="mb-3 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Moon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full"></div>
                        <div className="h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full w-3/4"></div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-sm font-medium text-foreground">Dark</span>
                      </div>
                    </div>
                    {theme === 'dark' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => setTheme('system')}
                    className={`relative cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                      theme === 'system' 
                        ? 'border-primary bg-primary/10 shadow-lg' 
                        : 'border-border/50 bg-card/50 hover:border-primary/40 hover:bg-card/80'
                    }`}
                  >
                    <div className="p-4">
                      <div className="mb-3 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Monitor className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
                        <div className="h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full w-3/4"></div>
                      </div>
                      <div className="mt-3 text-center">
                        <span className="text-sm font-medium text-foreground">
                          System {window.matchMedia('(prefers-color-scheme: dark)').matches ? '(dark)' : '(light)'}
                        </span>
                      </div>
                    </div>
                    {theme === 'system' && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
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

            <div className="space-y-4">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
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
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
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
                      <SelectItem value="easy">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">1</span>
                          </div>
                          <span>Easy</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">2</span>
                          </div>
                          <span>Medium</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="hard">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">3</span>
                          </div>
                          <span>Hard</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="unbeatable">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">4</span>
                          </div>
                          <span>Unbeatable</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between p-2">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => updateSettings({ showGameStatus: !gameSettings.showGameStatus })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      updateSettings({ showGameStatus: !gameSettings.showGameStatus });
                    }
                  }}
                  aria-label={`Toggle game status panel. Currently ${gameSettings.showGameStatus ? 'enabled' : 'disabled'}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Game Status Panel</h3>
                    <p className="text-sm text-muted-foreground">Show detailed game statistics and status</p>
                  </div>
                </div>
                <Switch
                  id="show-game-status"
                  checked={gameSettings.showGameStatus}
                  onCheckedChange={(checked) => updateSettings({ showGameStatus: checked })}
                />
              </div>
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

            <div className="p-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Win Animations</h3>
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
                      <div className="w-4 h-4 rounded-full bg-muted-foreground/30 flex items-center justify-center">
                        <Minus className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <span>None</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="confetti">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <PartyPopper className="h-3 w-3 text-yellow-500" />
                      </div>
                      <span>Confetti</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="sparkle">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Sparkles className="h-3 w-3 text-blue-500" />
                      </div>
                      <span>Sparkle</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="glow">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <Zap className="h-3 w-3 text-purple-500" />
                      </div>
                      <span>Glow</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-2">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => updateSettings({ enableAnimations: !gameSettings.enableAnimations })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      updateSettings({ enableAnimations: !gameSettings.enableAnimations });
                    }
                  }}
                  aria-label={`Toggle animations. Currently ${gameSettings.enableAnimations ? 'enabled' : 'disabled'}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Enable Animations</h3>
                    <p className="text-sm text-muted-foreground">Show fun animations and effects during gameplay</p>
                  </div>
                </div>
                <Switch
                  id="enable-animations"
                  checked={gameSettings.enableAnimations}
                  onCheckedChange={(checked) => updateSettings({ enableAnimations: checked })}
                />
              </div>

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

            <div className="flex items-center justify-between p-2">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setReduceMotion(!reduceMotion)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setReduceMotion(!reduceMotion);
                  }
                }}
                aria-label={`Toggle reduce motion. Currently ${reduceMotion ? 'enabled' : 'disabled'}`}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
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

            <div className="p-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <div className="text-sm font-bold text-primary">Aa</div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">Grid Font Size</h3>
                  <p className="text-sm text-muted-foreground">Adjust the size of X and O pieces on the game board</p>
                </div>
              </div>
              <Select 
                value={gameSettings.gridFontSize} 
                onValueChange={(value: 'very-small' | 'small' | 'medium' | 'large' | 'very-large') => updateSettings({ gridFontSize: value })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-small">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">Very Small</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="small">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Small</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <span className="text-base">Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="large">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">Large</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="very-large">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">Very Large</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

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

      case 'data':
        return (
          <SettingsSection>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-1">Data</h1>
              <p className="text-muted-foreground">Reset and manage your game data, settings, and themes</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                      <RotateCcw className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Reset All Settings</h3>
                      <p className="text-sm text-muted-foreground">Reset all game settings to default values.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowResetSettingsDialog(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset All Settings
                  </Button>
                </div>

                <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Palette className="h-4 w-4 text-primary" />
                  </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">Reset All Themes</h3>
                      <p className="text-sm text-muted-foreground">Remove all custom themes and restore defaults.</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowResetThemesDialog(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Reset All Themes
                  </Button>
                </div>
              </div>

              <div className="bg-card/50 rounded-lg border-2 border-destructive/50 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground">Reset Everything</h3>
                    <p className="text-sm text-muted-foreground">Reset all data including settings, themes, and statistics.</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowResetEverythingDialog(true)}
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset Everything
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
                  <h3 className="text-lg font-medium text-foreground mb-1">Onboarding Tour</h3>
                  <p className="text-sm text-muted-foreground">Replay the introduction tour</p>
                </div>
                <Button 
                  onClick={() => {
                    if ((window as any).showOnboardingAgain) {
                      (window as any).showOnboardingAgain();
                    }
                    setOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Show Onboarding Again
                </Button>
              </div>

              <div className="bg-card/50 rounded-lg border border-border/50 p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-foreground mb-1">Version Information</h3>
                  <p className="text-sm text-muted-foreground">Version and app details</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium text-foreground">Version</span>
                    <span className="text-sm text-muted-foreground font-mono">1.0.0</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm font-medium text-foreground">Platform</span>
                    <span className="text-sm text-muted-foreground">X&O Battle Web</span>
                  </div>
                </div>
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
        <DialogContent className="max-w-6xl w-[95vw] h-[85vh] p-0 gap-0 overflow-hidden md:overflow-auto bg-background/95 backdrop-blur-md dark:bg-[#080808] border-border/50">
        <div className="flex h-full">
          <div className="w-64 bg-muted/20 border-r border-border/30 flex flex-col" style={{ boxShadow: 'none', outline: 'none' }}>
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
                  <Ripple key={item.id} color={isActive ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.3)'} className="mb-2">
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full group flex items-center gap-4 p-3 rounded-lg text-left transition-all duration-200 ${
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
                  </Ripple>
                );
              })}
            </nav>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto">
              <div className="p-8 max-w-4xl mx-auto">
                              <div>
                {renderContent()}
              </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>

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
              Are you sure you want to reset all statistics? This action <b>cannot</b> be undone.
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

      <Dialog open={showResetSettingsDialog} onOpenChange={setShowResetSettingsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-destructive" />
              Reset All Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to reset all game settings? This action <b>cannot</b> be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowResetSettingsDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetSettings}
              >
                Reset All Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetThemesDialog} onOpenChange={setShowResetThemesDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-destructive" />
              Reset All Themes
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to reset all custom themes? This action <b>cannot</b> be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowResetThemesDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetThemes}
              >
                Reset All Themes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showResetEverythingDialog} onOpenChange={setShowResetEverythingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Reset Everything
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              This action will restore all settings to their default values and <b>cannot</b> be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setShowResetEverythingDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={resetEverything}
              >
                Reset Everything
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}