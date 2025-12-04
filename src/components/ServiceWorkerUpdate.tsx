import { useEffect } from 'react';

export function ServiceWorkerUpdate() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;

        const hasCachedFiles = async () => {
          const cacheNames = await caches.keys();
          return cacheNames.some(name => name.includes('xobattle'));
        };

        const cached = await hasCachedFiles();

        if (reg.waiting && cached) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
          window.location.reload();
          return;
        }

        reg.addEventListener('updatefound', async () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', async () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              const cached = await hasCachedFiles();
              if (cached) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });

        reg.update();
      } catch (error) {
        console.error('Error checking for updates:', error);
      }
    };

    checkForUpdates();

    const interval = setInterval(() => {
      checkForUpdates();
    }, 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return null;
}

