const RELOAD_KEY = 'xobattle-chunk-reload';
const RELOAD_COOLDOWN = 10_000;

export function recoverFromStaleChunks() {
  window.addEventListener('vite:preloadError', (event) => {
    try {
      const lastReload = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
      if (Date.now() - lastReload < RELOAD_COOLDOWN) return;
      sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
    } catch {
      return;
    }
    event.preventDefault();
    window.location.reload();
  });
}
