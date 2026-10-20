import type { WinAnimation } from '@/contexts/GameContext';

type Celebration = Extract<WinAnimation, 'confetti' | 'sparkle'>;

const SPARKLE_COLORS = ['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFE66D', '#FF6B9D', '#C44569'];

const CONFETTI_ORIGINS = [
  { x: 0, y: 0.3 },
  { x: 0.25, y: 0.2 },
  { x: 0.5, y: 0.3 },
  { x: 0.75, y: 0.2 },
  { x: 1, y: 0.3 },
];

export function isCelebration(animation: WinAnimation): animation is Celebration {
  return animation === 'confetti' || animation === 'sparkle';
}

export async function playCelebration(kind: Celebration) {
  const { default: confetti } = await import('canvas-confetti');

  if (kind === 'confetti') {
    CONFETTI_ORIGINS.forEach((origin, index) => {
      window.setTimeout(() => {
        confetti({ particleCount: 50, angle: 90, spread: 70, origin });
        confetti({ particleCount: 50, angle: 45 + index * 30, spread: 55, origin });
        confetti({ particleCount: 50, angle: 135 - index * 30, spread: 55, origin });
      }, index * 50);
    });
    return;
  }

  for (let i = 0; i < 150; i++) {
    window.setTimeout(() => {
      confetti({
        particleCount: 1,
        angle: Math.random() * 360,
        spread: Math.random() * 50 + 30,
        origin: { x: Math.random(), y: Math.random() * 0.5 + 0.2 },
        colors: [SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]],
        shapes: ['star'],
        gravity: 0.6 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 2,
        ticks: 150 + Math.random() * 80,
        decay: 0.93 + Math.random() * 0.03,
        startVelocity: 18 + Math.random() * 22,
        scalar: 0.8 + Math.random() * 0.4,
      });
    }, i * 7);
  }
  window.setTimeout(() => {
    confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: SPARKLE_COLORS, shapes: ['star'] });
    confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: SPARKLE_COLORS, shapes: ['star'] });
  }, 120);
}
