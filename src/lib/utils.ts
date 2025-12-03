import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAppStoreUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://apps.apple.com/us/app/x-o-battle/id6745736399';
  }
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const isWindows = userAgent.includes('windows');
  
  if (isWindows) {
    return 'https://apps.microsoft.com/detail/9nk0184bmx07?hl=en-GB&gl=GB';
  }
  
  return 'https://apps.apple.com/us/app/x-o-battle/id6745736399';
}
