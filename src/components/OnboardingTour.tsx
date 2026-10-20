import { useRef, useState, type ComponentType } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModesHero, SettingsHero, ThemesHero, WelcomeHero } from '@/components/OnboardingHeroes';
import { cn } from '@/lib/utils';

const STABILITY_NOTE = 'The web version may not be as stable as the official app.';

interface TourStep {
  id: string;
  title: string;
  description: string;
  Hero: ComponentType;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to X&O Battle Web',
    description: 'Tic-tac-toe, made for the web. Here’s a quick look around before you play.',
    Hero: WelcomeHero,
  },
  {
    id: 'game-modes',
    title: 'Play Your Way',
    description: 'Challenge a friend on the same device, or take on the AI across four difficulty levels.',
    Hero: ModesHero,
  },
  {
    id: 'themes',
    title: 'Make It Yours',
    description: 'Pick a built-in theme or create presets with your own colours and symbols.',
    Hero: ThemesHero,
  },
  {
    id: 'settings',
    title: 'Tuned to You',
    description: 'Adjust sound, animations, accessibility and more in Settings whenever you like.',
    Hero: SettingsHero,
  },
];

interface OnboardingTourProps {
  open: boolean;
  fadeIn: boolean;
  onComplete: () => void;
}

export function OnboardingTour({ open, fadeIn, onComplete }: OnboardingTourProps) {
  const [step, setStep] = useState(0);
  const [wasOpen, setWasOpen] = useState(open);
  const contentRef = useRef<HTMLDivElement>(null);

  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setStep(0);
  }

  const current = TOUR_STEPS[step];
  const isFirst = step === 0;
  const isLast = step === TOUR_STEPS.length - 1;

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onComplete();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-background',
            'bg-[radial-gradient(120%_65%_at_50%_0%,color-mix(in_oklab,var(--brand)_16%,transparent),transparent_70%)]',
            'data-[state=closed]:animate-fade-out',
            fadeIn && 'data-[state=open]:animate-fade-in'
          )}
        >
          <DialogPrimitive.Content
            ref={contentRef}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              contentRef.current?.focus();
            }}
            className="flex h-dvh w-full flex-col pb-[env(safe-area-inset-bottom)] pt-[env(safe-area-inset-top)] text-foreground outline-none"
          >
            <div className="flex h-16 shrink-0 items-center justify-end px-4 sm:px-6">
              {!isLast && (
                <Button variant="glass" size="pill" onClick={onComplete}>
                  Skip
                </Button>
              )}
            </div>

            <ScrollArea className="flex flex-col items-center px-6">
              <div key={current.id} className="my-auto flex w-full max-w-md animate-fade-in flex-col items-center">
                <div inert className="flex h-56 w-full items-center justify-center sm:h-72">
                  <current.Hero />
                </div>

                <div className="mt-6 flex min-h-40 flex-col items-center text-center">
                  <DialogPrimitive.Title className="text-balance text-[30px] font-bold leading-tight tracking-tight sm:text-4xl">
                    {current.title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-3 max-w-sm text-pretty text-[17px] leading-relaxed text-muted-foreground">
                    {current.description}
                  </DialogPrimitive.Description>
                </div>
              </div>
            </ScrollArea>

            <div className="mx-auto flex w-full max-w-md shrink-0 flex-col items-center gap-5 px-6 pb-6 pt-2">
              <div aria-hidden className="flex items-center gap-1.5">
                {TOUR_STEPS.map((tourStep, index) => (
                  <span
                    key={tourStep.id}
                    className={cn(
                      'h-2 rounded-full transition-[width,background-color] duration-300',
                      index === step ? 'w-6 bg-brand' : 'w-2 bg-foreground/20'
                    )}
                  />
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                Step {step + 1} of {TOUR_STEPS.length}
              </p>

              <div className="flex w-full flex-col gap-1">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={() => (isLast ? onComplete() : setStep(step + 1))}
                >
                  {isLast ? 'Start Playing' : 'Continue'}
                </Button>
                {isFirst ? (
                  <p className="flex h-12 items-center justify-center">
                    <span className="text-balance text-center text-[13px] leading-snug text-muted-foreground">
                      <Info className="mr-1.5 inline size-3.5 align-[-0.15em]" />
                      {STABILITY_NOTE}
                    </span>
                  </p>
                ) : (
                  <Button variant="ghost-muted" size="lg" className="w-full" onClick={() => setStep(step - 1)}>
                    Back
                  </Button>
                )}
              </div>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
