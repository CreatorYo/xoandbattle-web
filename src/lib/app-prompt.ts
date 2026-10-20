const DISMISSED_KEY = 'mobile-app-prompt-dismissed';

export function isAppPromptDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) !== null;
  } catch {
    return true;
  }
}

export function dismissAppPrompt() {
  try {
    localStorage.setItem(DISMISSED_KEY, 'true');
  } catch (error) {
    console.error('Failed to save app prompt state:', error);
  }
}
