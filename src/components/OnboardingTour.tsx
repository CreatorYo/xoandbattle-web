import { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft, Play, Users, Bot, Palette, Settings, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to X&O Battle Web!',
    description: 'Let\'s take a quick tour to get you familiar with the game.',
    icon: Play,
    position: 'center'
  },
  {
    id: 'game-modes',
    title: 'Game Modes',
    description: 'Choose between playing with a friend or challenging our AI opponent.',
    icon: Users,
    target: 'game-mode-section',
    position: 'bottom'
  },
  {
    id: 'themes',
    title: 'Custom Themes',
    description: 'Personalize your game with beautiful themes and create your own.',
    icon: Palette,
    target: 'themes-section',
    position: 'top'
  },
  {
    id: 'settings',
    title: 'Settings & Customization',
    description: 'Fine-tune your experience with comprehensive settings and preferences.',
    icon: Settings,
    target: 'settings-section',
    position: 'right'
  },
  {
    id: 'ai-opponent',
    title: 'AI Opponent',
    description: 'Challenge our intelligent AI with multiple difficulty levels.',
    icon: Bot,
    target: 'ai-section',
    position: 'left'
  }
];

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // Function to show onboarding again (can be called from other components)
  const showOnboardingAgain = () => {
    localStorage.removeItem('xobattle-onboarding-seen');
    setCurrentStep(0);
    setIsVisible(true);
  };

  // Expose the function globally so other components can access it
  useEffect(() => {
    (window as any).showOnboardingAgain = showOnboardingAgain;
  }, []);

  useEffect(() => {
    // Check if user has seen the onboarding tour before
    const hasSeenTour = localStorage.getItem('xobattle-onboarding-seen');
    
    if (!hasSeenTour) {
      setIsVisible(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    completeTour();
  };

  const completeTour = () => {
    localStorage.setItem('xobattle-onboarding-seen', 'true');
    setIsVisible(false);
  };

  const getStepPosition = (position: string) => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-4';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-4';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-4';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-4';
      case 'center':
        return 'inset-0 flex items-center justify-center';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-4';
    }
  };

  if (!isVisible) return null;

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
      
      {/* Tour Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <currentTourStep.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{currentTourStep.title}</h2>
                  <p className="text-blue-100 text-sm">{currentStep + 1} of {tourSteps.length}</p>
                </div>
              </div>
              <button
                onClick={skipTour}
                className="text-white/80 hover:text-white transition-colors"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">
              {currentTourStep.description}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={isFirstStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center gap-2"
              >
                {isLastStep ? 'Get Started' : 'Next'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Skip Button */}
          <div className="px-6 pb-4 text-center">
            <button
              onClick={skipTour}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
            >
              Skip tour
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
