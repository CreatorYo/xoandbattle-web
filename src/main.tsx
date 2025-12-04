import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateInstallScreen } from './components/UpdateInstallScreen'
import React from 'react'

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

const renderRefreshScreen = () => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: var(--background, #fff); color: var(--foreground, #000); font-family: system-ui, -apple-system, sans-serif;">
        <div style="text-align: center; padding: 2rem;">
          <h1 style="font-size: 1.5rem; margin-bottom: 1rem;">Please refresh the page.</h1>
        </div>
      </div>
    `;
  }
};

if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
    renderApp();
  } else {
    const timeout = setTimeout(() => {
      renderRefreshScreen();
    }, 5000);

    const clearTimeoutAndRender = () => {
      clearTimeout(timeout);
      renderApp();
    };

    navigator.serviceWorker.ready.then(clearTimeoutAndRender).catch(() => {
      clearTimeout(timeout);
      renderApp();
    });
    
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);

        if (registration.active) {
          clearTimeout(timeout);
          renderApp();
        }

        let isInstalling = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!isInstalling && navigator.serviceWorker.controller) {
            isInstalling = true;
            clearTimeout(timeout);
            const root = document.getElementById('root');
            if (root) {
              root.innerHTML = '';
              const installRoot = createRoot(root);
              installRoot.render(React.createElement(UpdateInstallScreen));
            }
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
        clearTimeout(timeout);
        renderApp();
      });
  }
} else {
  renderApp();
}
