import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateInstallScreen } from './components/UpdateInstallScreen'
import React from 'react'

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(<App />);
};

if ('serviceWorker' in navigator) {
  if (navigator.serviceWorker.controller) {
    renderApp();
  } else {
    navigator.serviceWorker.ready.then(() => {
      renderApp();
    });
    
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('ServiceWorker registration successful:', registration.scope);

        if (registration.active) {
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
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed:', error);
        renderApp();
      });
  }
} else {
  renderApp();
}
