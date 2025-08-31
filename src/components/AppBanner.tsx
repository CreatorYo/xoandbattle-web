import { useState, useEffect } from 'react';
import { X, Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BannerMessage {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  dismissible: boolean;
}

const defaultMessages: BannerMessage[] = [
  {
    id: 'welcome',
    type: 'info',
    title: 'Welcome to Tic-Tac-Toe Pro!',
    message: 'Enjoy the modern gaming experience with AI opponents and custom themes.',
    dismissible: true,
  },
  {
    id: 'ai-mode',
    type: 'success',
    title: 'AI Mode Available',
    message: 'Challenge yourself against AI opponents with different difficulty levels.',
    dismissible: true,
  },
];

export function AppBanner() {
  const [messages, setMessages] = useState<BannerMessage[]>(defaultMessages);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (messages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [messages.length]);

  const dismissMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
    if (currentIndex >= messages.length - 1) {
      setCurrentIndex(0);
    }
  };

  if (messages.length === 0) return null;

  const currentMessage = messages[currentIndex];

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <Trophy className="h-5 w-5" />;
      case 'warning':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  return (
    <div className="app-banner px-4 py-3 text-sm font-medium flex items-center justify-between animate-slide-up">
      <div className="flex items-center gap-3">
        {getIcon(currentMessage.type)}
        <div>
          <span className="font-semibold">{currentMessage.title}</span>
          <span className="ml-2 opacity-90">{currentMessage.message}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {messages.length > 1 && (
          <div className="flex gap-1">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
        
        {currentMessage.dismissible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissMessage(currentMessage.id)}
            className="h-6 w-6 p-0 text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}