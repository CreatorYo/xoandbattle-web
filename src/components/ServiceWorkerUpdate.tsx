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

    const checkForUpdates = () => {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        if (reg.waiting && !notificationShown.current) {
          notificationShown.current = true;
          setUpdateAvailable(true);
          return;
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller && !notificationShown.current) {
              notificationShown.current = true;
              setUpdateAvailable(true);
            }
          });
        });

        reg.update();
      });
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

