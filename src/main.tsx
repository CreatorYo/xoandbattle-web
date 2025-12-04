import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UpdateInstallScreen } from './components/UpdateInstallScreen'
import React from 'react'

if ('serviceWorker' in navigator) {
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
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
