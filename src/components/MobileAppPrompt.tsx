import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Smartphone, X, Sparkles, GamepadIcon } from 'lucide-react';

interface MobileAppPromptProps {
  onContinue: () => void;
}

export function MobileAppPrompt({ onContinue }: MobileAppPromptProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleContinue = () => {
    setIsOpen(false);
    onContinue();
  };

  const handleAppStore = () => {
    // In a real app, this would redirect to the app store
    window.open('https://apps.apple.com', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20">
        <div className="text-center space-y-6 p-2">
          {/* App Icon */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <GamepadIcon className="w-10 h-10 text-primary-foreground" />
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Better on the app
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Experience more on the <span className="font-semibold text-primary">X&O Battle</span> app with custom board styles and more!
            </p>
          </div>

          {/* Features */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Exclusive board styles</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4 text-primary" />
              <span>Optimized mobile experience</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GamepadIcon className="w-4 h-4 text-primary" />
              <span>Enhanced gameplay features</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleAppStore}
              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
              size="lg"
            >
              Get on App Store
            </Button>
            
            <Button 
              onClick={handleContinue}
              variant="outline"
              className="w-full border-muted-foreground/20 hover:bg-muted/50"
            >
              Continue playing here
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}