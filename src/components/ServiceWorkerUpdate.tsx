import { useEffect, useRef, useState } from 'react';
import { UpdateInstallScreen } from './UpdateInstallScreen';

export function ServiceWorkerUpdate() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const notificationShown = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    const checkForUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        setRegistration(reg);

        const checkCache = async () => {
          const cacheNames = await caches.keys();
          const hasCache = cacheNames.some(name => name.includes('xobattle'));
          return hasCache;
        };

        const hasCachedFiles = await checkCache();

        if (reg.waiting && hasCachedFiles && !notificationShown.current) {
          notificationShown.current = true;
          setUpdateAvailable(true);
          return;
        }

        reg.addEventListener('updatefound', async () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', async () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              const hasCached = await checkCache();
              if (hasCached && !notificationShown.current) {
                notificationShown.current = true;
                setUpdateAvailable(true);
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

  const installUpdate = () => {
    if (!registration) return;

    setIsInstalling(true);

    setTimeout(() => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    }, 2000);
  };

  if (isInstalling) {
    return <UpdateInstallScreen />;
  }

  return (
    <>
      {updateAvailable && (
        <button
          onClick={installUpdate}
          className="fixed top-4 left-4 z-50 inline-flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 text-sm font-medium shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Install Update
        </button>
      )}
    </>
  );
}

