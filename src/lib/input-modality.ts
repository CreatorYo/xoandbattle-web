const NAVIGATION_KEYS = new Set(['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);

export function trackInputModality() {
  const root = document.documentElement;

  window.addEventListener(
    'pointerdown',
    () => {
      root.dataset.modality = 'pointer';
    },
    true
  );

  window.addEventListener(
    'keydown',
    (event) => {
      if (NAVIGATION_KEYS.has(event.key)) root.dataset.modality = 'keyboard';
    },
    true
  );
}
