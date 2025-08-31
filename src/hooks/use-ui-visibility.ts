import { useState, useEffect } from 'react';

export function useUIVisibility() {
  const [isUIVisible, setIsUIVisible] = useState(() => {
    // Load from localStorage on initialization
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
    // Save to localStorage
    localStorage.setItem('tic-tac-toe-ui-visible', JSON.stringify(newValue));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+/ (Windows/Linux) or Cmd+/ (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        event.preventDefault();
        toggleUIVisibility();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUIVisible]);

  return { isUIVisible, toggleUIVisibility };
}
