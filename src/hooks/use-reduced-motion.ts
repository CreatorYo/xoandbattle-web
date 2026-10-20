import { usePreferences } from '@/contexts/PreferencesContext';
import { useMediaQuery } from '@/hooks/use-media-query';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';

export function useSystemReducedMotion() {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}

export function useReducedMotion() {
  const { reduceMotion } = usePreferences();
  const system = useSystemReducedMotion();
  return reduceMotion || system;
}
