export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const MOVING_ANIMATIONS = new Set([
  'sheet-in',
  'sheet-out',
  'dialog-in',
  'dialog-out',
  'push-in',
  'push-out',
  'push-back',
  'pop-back',
]);

function markMoving(event: AnimationEvent) {
  if (event.pseudoElement || !MOVING_ANIMATIONS.has(event.animationName)) return;
  if (event.target instanceof HTMLElement) {
    event.target.toggleAttribute('data-moving', event.type === 'animationstart');
  }
}

function markScaling(event: TransitionEvent) {
  if (event.pseudoElement || event.propertyName !== 'scale') return;
  if (event.target instanceof HTMLElement) {
    event.target.toggleAttribute('data-moving', event.type === 'transitionrun');
  }
}

export function trackMovingAnimations() {
  window.addEventListener('animationstart', markMoving, true);
  window.addEventListener('animationend', markMoving, true);
  window.addEventListener('animationcancel', markMoving, true);
  window.addEventListener('transitionrun', markScaling, true);
  window.addEventListener('transitionend', markScaling, true);
  window.addEventListener('transitioncancel', markScaling, true);
}

function systemPrefersReducedMotion(): boolean {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function prefersReducedMotion(): boolean {
  return document.documentElement.classList.contains('reduce-motion') || systemPrefersReducedMotion();
}

export function withoutTransitions(apply: () => void) {
  const style = document.createElement('style');
  style.textContent = '*,*::before,*::after{-webkit-transition:none!important;transition:none!important}';
  document.head.appendChild(style);

  apply();

  void window.getComputedStyle(document.body).opacity;
  window.setTimeout(() => style.remove(), 1);
}
