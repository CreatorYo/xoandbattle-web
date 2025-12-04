import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const initializeStatusBarColor = () => {
  try {
    const isSynced = localStorage.getItem('tic-tac-toe-status-bar-synced') === 'true';
    let colorToUse: string;
    
    if (isSynced) {
      const accentColor = localStorage.getItem('tic-tac-toe-app-theme-color') || '#3b82f6';
      colorToUse = accentColor;
      localStorage.setItem('tic-tac-toe-status-bar-color', accentColor);
    } else {
      colorToUse = localStorage.getItem('tic-tac-toe-status-bar-color') || '#000000';
    }
    
    let lightMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: light)"]') as HTMLMetaElement;
    let darkMeta = document.querySelector('meta[name="theme-color"][media="(prefers-color-scheme: dark)"]') as HTMLMetaElement;
    
    if (!lightMeta) {
      lightMeta = document.createElement('meta');
      lightMeta.name = 'theme-color';
      lightMeta.setAttribute('media', '(prefers-color-scheme: light)');
      document.head.appendChild(lightMeta);
    }
    if (!darkMeta) {
      darkMeta = document.createElement('meta');
      darkMeta.name = 'theme-color';
      darkMeta.setAttribute('media', '(prefers-color-scheme: dark)');
      document.head.appendChild(darkMeta);
    }
    
    lightMeta.content = colorToUse;
    darkMeta.content = colorToUse;

    const generalMeta = document.querySelector('meta[name="theme-color"]:not([media])') as HTMLMetaElement;
    if (generalMeta) {
      generalMeta.content = colorToUse;
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = colorToUse;
      document.head.appendChild(meta);
    }
  } catch (error) {
    console.error('Failed to initialize status bar color:', error);
  }
};

initializeStatusBarColor();

createRoot(document.getElementById("root")!).render(<App />);
