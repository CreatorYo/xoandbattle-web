import { useEffect, useRef, useState } from 'react';
import { UpdateInstallScreen } from './UpdateInstallScreen';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function ServiceWorkerUpdate() {
  const [isInstalling, setIsInstalling] = useState(false);
  const notificationShown = useRef(false);

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(r) {
      console.log('SW Registered: ', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh && !notificationShown.current) {
      notificationShown.current = true;
    }
  }, [needRefresh]);

  const installUpdate = async () => {
    setIsInstalling(true);

    setTimeout(async () => {
      await updateServiceWorker(true);
    }, 2000);
  };

  if (isInstalling) {
    return <UpdateInstallScreen />;
  }

  return (
    <>
      {needRefresh && (
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

