import { useEffect, useState } from 'react';
import { isRunningAsPWA } from '@/hooks/use-pwa';
import { cn } from '@/lib/utils';

export function PWALaunchScreen() {
  const [phase, setPhase] = useState<'visible' | 'fading' | 'gone'>(() => (isRunningAsPWA() ? 'visible' : 'gone'));

  useEffect(() => {
    if (!isRunningAsPWA()) return;
    const fadeTimer = window.setTimeout(() => setPhase('fading'), 800);
    const removeTimer = window.setTimeout(() => setPhase('gone'), 1100);
    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (phase === 'gone') return null;

  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-[99999] flex items-center justify-center bg-background transition-opacity duration-300 ease-out',
        phase === 'fading' && 'pointer-events-none opacity-0'
      )}
    >
      <img
        src="/assets/XO_Battle_Logo_Transparent.png"
        alt=""
        width={256}
        height={256}
        fetchPriority="high"
        draggable={false}
        className="size-48 animate-launch sm:size-56 md:size-64"
      />
    </div>
  );
}
