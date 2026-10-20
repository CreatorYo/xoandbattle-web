export function revealSetting(viewport: HTMLElement, ids: (string | undefined)[], smooth: boolean) {
  const element = ids
    .map((id) => (id ? viewport.querySelector<HTMLElement>(`[data-setting-id="${id}"]`) : null))
    .find((candidate) => candidate !== null);
  if (!element) return undefined;

  const offset = element.getBoundingClientRect().top - viewport.getBoundingClientRect().top;
  viewport.scrollTo({
    top: viewport.scrollTop + offset - (viewport.clientHeight - element.offsetHeight) / 2,
    behavior: smooth ? 'smooth' : 'auto',
  });

  element.setAttribute('data-setting-highlight', '');
  const timer = window.setTimeout(() => element.removeAttribute('data-setting-highlight'), 1600);
  return () => {
    window.clearTimeout(timer);
    element.removeAttribute('data-setting-highlight');
  };
}
