import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateInstallScreen } from './components/UpdateInstallScreen'
import React from 'react'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);

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
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
