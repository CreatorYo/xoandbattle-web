import { useEffect } from 'react';
import { parseSectionParam, type SectionId } from './sections';

const SECTION_PARAM = 's';

export function readSectionFromUrl() {
  return parseSectionParam(new URLSearchParams(window.location.search).get(SECTION_PARAM));
}

export function useSectionUrl(section: SectionId | null) {
  useEffect(() => {
    const url = new URL(window.location.href);
    if (section) url.searchParams.set(SECTION_PARAM, section);
    else url.searchParams.delete(SECTION_PARAM);
    if (url.href !== window.location.href) {
      window.history.replaceState(window.history.state, '', url);
    }
  }, [section]);
}
