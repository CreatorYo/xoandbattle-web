import { createContext, useContext } from 'react';

interface SettingsNavValue {
  subPageId: string | null;
  subPageContainer: HTMLElement | null;
  openSubPage: (id: string, title: string) => void;
}

export const SettingsNavContext = createContext<SettingsNavValue | undefined>(undefined);

export function useSettingsNav() {
  const context = useContext(SettingsNavContext);
  if (!context) {
    throw new Error('useSettingsNav must be used within a SettingsDialog');
  }
  return context;
}
