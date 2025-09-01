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
    description: 'Let\'s take a quick tour to get you familiar with the game. Please **note** that this is different from the official app experience.',
    icon: Play,
    position: 'center'
  },
  {
    id: 'game-modes',
    title: 'Game Modes',
    description: 'Choose between playing with a friend or challenging our computer opponent.',
    icon: Users,
    target: 'game-mode-section',
    position: 'bottom'
  },
  {
    id: 'themes',
    title: 'Custom Themes',
    description: 'Make your game look amazing with beautiful themes and create your own.',
    icon: Palette,
    target: 'themes-section',
    position: 'top'
  },
  {
    id: 'settings',
    title: 'Settings & Customisation',
    description: 'Change your game to exactly how you like it with lots of options.',
    icon: Settings,
    target: 'settings-section',
    position: 'right'
  }
];

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeFading, setWelcomeFading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);

  const showOnboardingAgain = () => {
    localStorage.removeItem('xobattle-onboarding-seen');
    setCurrentStep(0);
    setIsVisible(true);
  };

  useEffect(() => {
    (window as any).showOnboardingAgain = showOnboardingAgain;
  }, []);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('xobattle-onboarding-seen');
    
    if (!hasSeenTour) {
      setShowWelcome(true);
      setTimeout(() => {
        setWelcomeFading(true);
        setTimeout(() => {
          setShowWelcome(false);
          setWelcomeFading(false);
          setIsVisible(true);
        }, 1000);
      }, 2500);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showWelcome) {
          setShowWelcome(false);
          setWelcomeFading(false);
          setIsVisible(false);
          localStorage.setItem('xobattle-onboarding-seen', 'true');
        } else if (isVisible) {
          completeTour();
        }
      }
    };

    if (showWelcome || isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showWelcome, isVisible]);

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

  if (!isVisible && !showWelcome) return null;

  const currentTourStep = tourSteps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <>
      {showWelcome && (
        <div 
          className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-all duration-1000 ease-in-out flex items-center justify-center ${
            welcomeFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white dark:text-[#eee] mb-4 tracking-tight">
              Welcome to X&O Battle{' '}
              <span style={{ color: '#0972c3' }}>Web</span>
            </h1>
          </div>
        </div>
      )}

      {isVisible && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-all duration-500 ease-out animate-fade-in" />
          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
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
                  {!isLastStep && (
                    <button
                      onClick={skipTour}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      <SkipForward className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="text-gray-600 dark:text-gray-300 text-center leading-relaxed mb-6">
                  {currentTourStep.description.split('**').map((part, index) => 
                    index % 2 === 0 ? (
                      <span key={index}>{part}</span>
                    ) : (
                      <strong key={index} className="font-bold">{part}</strong>
                    )
                  )}
                </div>

                <div className="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                  />
                </div>

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

              {!isLastStep && (
                <div className="px-6 pb-4 text-center">
                  <button
                    onClick={skipTour}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
                  >
                    Skip tour
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
