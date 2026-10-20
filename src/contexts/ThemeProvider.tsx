import { useLayoutEffect, useState, type ReactNode } from 'react';
import { ThemeContext, type ResolvedTheme, type Theme } from '@/contexts/ThemeContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import { withoutTransitions } from '@/lib/motion';

const STORAGE_KEY = 'tic-tac-toe-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

function loadTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(loadTheme);
  const systemDark = useMediaQuery(DARK_QUERY);
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useLayoutEffect(() => {
    const root = document.documentElement;
    const other = resolvedTheme === 'dark' ? 'light' : 'dark';
    if (root.classList.contains(resolvedTheme) && !root.classList.contains(other)) return;

    withoutTransitions(() => {
      root.classList.remove(other);
      root.classList.add(resolvedTheme);
    });
  }, [resolvedTheme]);

  const setTheme = (next: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
    setThemeState(next);
  };

  return <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext.Provider>;
}
