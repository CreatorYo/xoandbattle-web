import { useState, useEffect } from 'react';

export function useUIVisibility() {
  const [isUIVisible, setIsUIVisible] = useState(() => {
    try {
      const saved = localStorage.getItem('tic-tac-toe-ui-visible');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleUIVisibility = () => {
    const newValue = !isUIVisible;
    setIsUIVisible(newValue);
    localStorage.setItem('tic-tac-toe-ui-visible', JSON.stringify(newValue));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        toggleUIVisibility();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUIVisible]);

  return { isUIVisible, toggleUIVisibility };
}
