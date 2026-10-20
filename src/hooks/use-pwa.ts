import { useSyncExternalStore } from 'react';

const STANDALONE_QUERY = '(display-mode: standalone)';

export function isRunningAsPWA() {
  const isStandalone = window.matchMedia(STANDALONE_QUERY).matches;
  const isIOSStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
  return isStandalone || isIOSStandalone || isFullscreen;
}

function subscribe(onChange: () => void) {
  const query = window.matchMedia(STANDALONE_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export function useIsPWA() {
  return useSyncExternalStore(subscribe, isRunningAsPWA);
}
