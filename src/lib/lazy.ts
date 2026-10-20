import { lazy, type FunctionComponent } from 'react';

export function lazyWithPreload<P extends object>(load: () => Promise<{ default: FunctionComponent<P> }>) {
  let pending: Promise<{ default: FunctionComponent<P> }> | null = null;

  const preload = () => {
    pending ??= load().catch((error: unknown) => {
      pending = null;
      throw error;
    });
    return pending;
  };

  return Object.assign(lazy(preload), { preload });
}

export function whenIdle(callback: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(callback, { timeout: 2500 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 1200);
  return () => window.clearTimeout(id);
}
