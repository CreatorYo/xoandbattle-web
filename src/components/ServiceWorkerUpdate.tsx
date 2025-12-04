import { useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { RefreshCw } from 'lucide-react';

export function ServiceWorkerUpdate() {
  const notificationShown = useRef(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((reg) => {
      const checkForUpdate = () => {
        if (reg.waiting && !notificationShown.current) {
          notificationShown.current = true;
          showUpdateNotification(reg);
          return;
        }

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller && !notificationShown.current) {
              notificationShown.current = true;
              showUpdateNotification(reg);
            }
          });
        });
      };

      checkForUpdate();

      const interval = setInterval(() => {
        reg.update();
      }, 60000);

      return () => {
        clearInterval(interval);
      };
    });
  }, []);

  const showUpdateNotification = (reg: ServiceWorkerRegistration) => {
    const reloadToUpdate = () => {
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    };

    toast({
      title: 'New Version Available',
      description: 'A new version of the app is available. Click to reload and update.',
      variant: 'default',
      duration: 0,
      action: (
        <ToastAction altText="Reload to update" onClick={reloadToUpdate}>
          <RefreshCw className="h-3 w-3 mr-1" />
          Reload
        </ToastAction>
      ),
    });
  };

  return null;
}
