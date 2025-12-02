import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const checkPWA = () => {
  if (typeof window === 'undefined') return false;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  return isStandalone || isIOSStandalone || isFullscreen;
};

export function PWALaunchScreen() {
  const isPWA = useMemo(() => checkPWA(), []);
  const [isVisible, setIsVisible] = useState(isPWA);
  const [shouldRender, setShouldRender] = useState(isPWA);

  useEffect(() => {
    if (!isPWA) {
      setShouldRender(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 800);

    const removeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 1100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [isPWA]);

  if (!shouldRender || !isPWA) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[99999] flex items-center justify-center transition-opacity duration-300 ease-out",
        "bg-white dark:bg-black",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <img
          src="/assets/XO_Battle_Logo_Transparent.png"
          alt="X&O Battle"
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64"
          style={{
            animation: 'fadeInScale 0.5s ease-out',
          }}
        />
      </div>
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
