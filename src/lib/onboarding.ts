const SEEN_KEY = 'xobattle-onboarding-seen';
const SEEN_EVENT = 'xobattle:onboarding-seen';
const REPLAY_EVENT = 'xobattle:replay-onboarding';

export function hasSeenOnboarding() {
  try {
    return localStorage.getItem(SEEN_KEY) === 'true';
  } catch {
    return true;
  }
}

export function markOnboardingSeen() {
  try {
    localStorage.setItem(SEEN_KEY, 'true');
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
  window.dispatchEvent(new Event(SEEN_EVENT));
}

export function subscribeToOnboarding(listener: () => void) {
  window.addEventListener(SEEN_EVENT, listener);
  return () => window.removeEventListener(SEEN_EVENT, listener);
}

export function replayOnboarding() {
  window.dispatchEvent(new Event(REPLAY_EVENT));
}

export function onReplayOnboarding(listener: () => void) {
  window.addEventListener(REPLAY_EVENT, listener);
  return () => window.removeEventListener(REPLAY_EVENT, listener);
}
