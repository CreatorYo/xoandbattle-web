import { useMediaQuery } from '@/hooks/use-media-query';

const isMobileUserAgent = /android|iphone|ipad|ipod/i.test(window.navigator.userAgent);

export function useIsMobile() {
  const isSmallScreen = useMediaQuery('(max-width: 768px)');
  return isMobileUserAgent || isSmallScreen;
}
