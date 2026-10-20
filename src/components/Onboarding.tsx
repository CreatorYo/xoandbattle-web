import { Suspense, useCallback, useEffect, useState } from 'react';
import { lazyWithPreload, whenIdle } from '@/lib/lazy';
import { hasSeenOnboarding, markOnboardingSeen, onReplayOnboarding } from '@/lib/onboarding';
import { cn } from '@/lib/utils';

const OnboardingTour = lazyWithPreload(async () => ({ default: (await import('./OnboardingTour')).OnboardingTour }));

const SPLASH_HOLD = 1400;
const SPLASH_FADE = 300;

type SplashPhase = 'hidden' | 'visible' | 'leaving';

export function Onboarding() {
  const [splash, setSplash] = useState<SplashPhase>(() => (hasSeenOnboarding() ? 'hidden' : 'visible'));
  const [tour, setTour] = useState<{ open: boolean; fadeIn: boolean } | null>(null);

  const completeTour = useCallback(() => {
    markOnboardingSeen();
    setTour((current) => current && { ...current, open: false });
  }, []);

  useEffect(
    () =>
      onReplayOnboarding(() => {
        OnboardingTour.preload().then(
          () => setTour({ open: true, fadeIn: true }),
          (error: unknown) => console.error('Failed to load the tour:', error)
        );
      }),
    []
  );

  useEffect(
    () =>
      whenIdle(() => {
        OnboardingTour.preload().then(
          () => setTour((current) => current ?? { open: false, fadeIn: true }),
          () => undefined
        );
      }),
    []
  );

  useEffect(() => {
    if (splash === 'hidden') return;

    let cancelled = false;
    let timer = 0;

    if (splash === 'visible') {
      const hold = new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, SPLASH_HOLD);
      });
      const tourReady = OnboardingTour.preload().then(() => {
        if (!cancelled) setTour((current) => current ?? { open: false, fadeIn: false });
      });
      Promise.all([hold, tourReady]).then(
        () => {
          if (cancelled) return;
          setTour({ open: true, fadeIn: false });
          setSplash('leaving');
        },
        () => {
          if (!cancelled) setSplash('leaving');
        }
      );
    } else {
      timer = window.setTimeout(() => setSplash('hidden'), SPLASH_FADE);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      cancelled = true;
      markOnboardingSeen();
      setSplash('hidden');
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [splash]);

  return (
    <>
      {splash !== 'hidden' && (
        <div
          aria-hidden
          className={cn(
            'fixed inset-0 z-[60] flex select-none items-center justify-center bg-background px-6 transition-opacity duration-300 ease-out',
            splash === 'leaving' && 'opacity-0'
          )}
        >
          <h1
            data-text="Welcome to X&O Battle Web"
            className="text-shine animate-fade-in text-center text-4xl font-bold tracking-tight sm:text-6xl"
          >
            Welcome to X&amp;O Battle <span className="text-brand">Web</span>
          </h1>
        </div>
      )}

      {tour && (
        <Suspense fallback={null}>
          <OnboardingTour open={tour.open} fadeIn={tour.fadeIn} onComplete={completeTour} />
        </Suspense>
      )}
    </>
  );
}
