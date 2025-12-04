import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateInstallScreen } from './components/UpdateInstallScreen'
import React from 'react'

const renderApp = () => {
  const root = document.getElementById("root");
  if (root) {
    createRoot(root).render(<App />);
  }
};

if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
    renderApp();
  } else {
    let appRendered = false;
    const timeout = setTimeout(() => {
      if (!appRendered) {
        console.log('Service worker timeout, rendering app anyway');
        appRendered = true;
        renderApp();
      }
    }, 2000);

    const registerAndWait = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' });
        console.log('ServiceWorker registration successful:', registration.scope);

        if (registration.active) {
          await navigator.serviceWorker.ready;
          if (!appRendered) {
            appRendered = true;
            clearTimeout(timeout);
            renderApp();
          }
          return;
        }

        if (registration.installing) {
          await new Promise((resolve) => {
            registration.installing.addEventListener('statechange', () => {
              if (registration.installing?.state === 'activated') {
                resolve(null);
              }
            });
          });
        } else if (registration.waiting) {
          await new Promise((resolve) => {
            registration.waiting.addEventListener('statechange', () => {
              if (registration.waiting?.state === 'activated') {
                resolve(null);
              }
            });
          });
        }

        await navigator.serviceWorker.ready;
        if (!appRendered) {
          appRendered = true;
          clearTimeout(timeout);
          renderApp();
        }

        let isInstalling = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!isInstalling && navigator.serviceWorker.controller) {
            isInstalling = true;
            const root = document.getElementById('root');
            if (root) {
              root.innerHTML = '';
              const installRoot = createRoot(root);
              installRoot.render(React.createElement(UpdateInstallScreen));
            }
            window.location.reload();
          }
        });
      } catch (error) {
        console.log('ServiceWorker registration failed:', error);
        if (!appRendered) {
          appRendered = true;
          clearTimeout(timeout);
          renderApp();
        }
      }
    };

    registerAndWait();
  }
} else {
  renderApp();
}
