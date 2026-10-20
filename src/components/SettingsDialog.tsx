import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { ChevronLeft } from 'lucide-react';
import { useIsPWA } from '@/hooks/use-pwa';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn, isTypingOrMenuTarget } from '@/lib/utils';
import { prefersReducedMotion } from '@/lib/motion';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ALL_SECTIONS,
  SECTION_GROUPS,
  getSectionMeta,
  isModalSection,
  type PageSectionId,
  type SectionId,
} from './settings/sections';
import { searchSettings, type SearchableSetting } from './settings/search-index';
import { revealSetting } from './settings/reveal-setting';
import { readSectionFromUrl, useSectionUrl } from './settings/settings-url';
import { SettingsNavContext } from './settings/settings-nav';
import { SettingsNavBar } from './settings/SettingsNavBar';
import { SettingsSidebar } from './settings/SettingsSidebar';
import { SettingsSectionContent } from './settings/SettingsSectionContent';
import { SettingsDoneButton } from './settings/SettingsDoneButton';
import { ThemesSheet } from './settings/ThemesSheet';

const isIOSDevice = () => /iPad|iPhone|iPod/.test(window.navigator.userAgent);

const isSliding = (element: HTMLElement | null) =>
  !prefersReducedMotion() &&
  (element?.getAnimations().some((animation) => animation.playState === 'running') ?? false);

const WIDE_LAYOUT_QUERY = '(min-width: 48rem)';

const PAGE_CLASS =
  'mx-auto flex min-h-full w-full max-w-[640px] flex-col px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[calc(var(--safe-top)+3.75rem)] md:px-10 md:pb-12 md:pt-[4.25rem]';

const PAGE_EDGE_CLASS = '[--edge-top-size:calc(var(--safe-top)+3.75rem)] md:[--edge-top-size:4.5rem]';

interface SubPageState {
  id: string;
  title: string;
  closing: boolean;
}

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const isPWA = useIsPWA();
  const isWideLayout = useMediaQuery(WIDE_LAYOUT_QUERY);
  const showAppSection = isPWA && !isIOSDevice();

  const [deepLinkedSection] = useState(readSectionFromUrl);
  const startsDeepLinked = open && deepLinkedSection !== null;
  const deepLinkedPage = deepLinkedSection && !isModalSection(deepLinkedSection) ? deepLinkedSection : null;
  const [activeSection, setActiveSection] = useState<PageSectionId>(deepLinkedPage ?? 'appearance');
  const [mobileView, setMobileView] = useState<'list' | 'section'>(open && deepLinkedPage ? 'section' : 'list');
  const [themesOpen, setThemesOpen] = useState(open && deepLinkedSection === 'themes');
  const [navTransition, setNavTransition] = useState<'push' | 'pop' | null>(null);
  const [animateEntrance, setAnimateEntrance] = useState(!startsDeepLinked);
  const [wasOpen, setWasOpen] = useState(open);
  const [query, setQuery] = useState('');
  const [jumpRequest, setJumpRequest] = useState<{ setting: SearchableSetting; nonce: number } | null>(null);
  const [subPage, setSubPage] = useState<SubPageState | null>(null);
  const [subPageContainer, setSubPageContainer] = useState<HTMLDivElement | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionPaneRef = useRef<HTMLElement>(null);
  const subPagePaneRef = useRef<HTMLDivElement>(null);
  const subPageScrollRef = useRef<HTMLDivElement>(null);
  const subPageReturnFocus = useRef<HTMLElement | null>(null);

  if (wasOpen !== open) {
    setWasOpen(open);
    setThemesOpen(false);
    setJumpRequest(null);
    if (open) {
      setMobileView('list');
      setNavTransition(null);
      setQuery('');
      setSubPage(null);
    } else {
      setAnimateEntrance(true);
    }
  }

  const currentSection = activeSection === 'app' && !showAppSection ? 'appearance' : activeSection;
  const currentMeta = getSectionMeta(currentSection);
  const subPageId = subPage?.id ?? null;
  const showingSubPage = subPage !== null && !subPage.closing;
  const showSection = isWideLayout || mobileView === 'section' || navTransition !== null;
  const themesRevealRequest = jumpRequest && isModalSection(jumpRequest.setting.section) ? jumpRequest : null;

  useLayoutEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [currentSection]);

  useLayoutEffect(() => {
    if (subPageId && subPageScrollRef.current) subPageScrollRef.current.scrollTop = 0;
  }, [subPageId]);

  useEffect(() => {
    if (subPageId) {
      subPageContainer?.focus({ preventScroll: true });
      return;
    }
    subPageReturnFocus.current?.focus({ preventScroll: true });
    subPageReturnFocus.current = null;
  }, [subPageId, subPageContainer]);

  useSectionUrl(open ? (themesOpen ? 'themes' : currentSection) : null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const isFind = event.key.toLowerCase() === 'f' && (event.ctrlKey || event.metaKey);
      const isSlash = event.key === '/' && !isTypingOrMenuTarget(event.target);
      if (!isFind && !isSlash) return;
      if (document.querySelectorAll('[role="dialog"], [role="alertdialog"]').length > 1) return;
      event.preventDefault();
      setMobileView('list');
      setNavTransition(null);
      requestAnimationFrame(() => searchRef.current?.focus());
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  useEffect(() => {
    const viewport = contentRef.current;
    if (!jumpRequest || isModalSection(jumpRequest.setting.section) || !viewport) return;
    const smooth = !prefersReducedMotion() && !isSliding(sectionPaneRef.current);
    return revealSetting(viewport, [jumpRequest.setting.id, jumpRequest.setting.fallbackId], smooth);
  }, [jumpRequest]);

  const visibleGroups = useMemo(
    () =>
      SECTION_GROUPS.map((group) => ({
        ...group,
        sections: group.sections.filter((section) => section.id !== 'app' || showAppSection),
      })),
    [showAppSection],
  );

  const availableSections = useMemo(
    () => new Set(ALL_SECTIONS.filter((section) => section.id !== 'app' || showAppSection).map((section) => section.id)),
    [showAppSection],
  );
  const results = useMemo(() => searchSettings(query, availableSections), [query, availableSections]);

  const selectSection = (id: SectionId) => {
    if (isSliding(sectionPaneRef.current)) return;
    if (isModalSection(id)) {
      setThemesOpen(true);
      return;
    }
    const slideIn = (mobileView === 'list' || navTransition === 'pop') && !isWideLayout && !prefersReducedMotion();
    setActiveSection(id);
    setMobileView('section');
    setNavTransition(slideIn ? 'push' : null);
    setSubPage(null);
    subPageReturnFocus.current = null;
  };

  const showSectionList = () => {
    if (isSliding(sectionPaneRef.current)) return;
    if (prefersReducedMotion()) setMobileView('list');
    else setNavTransition('pop');
  };

  const openSubPage = useCallback((id: string, title: string) => {
    subPageReturnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSubPage({ id, title, closing: false });
  }, []);

  const closeSettings = useCallback(() => onOpenChange(false), [onOpenChange]);

  const navValue = useMemo(
    () => ({ subPageId, subPageContainer, openSubPage }),
    [subPageId, subPageContainer, openSubPage]
  );

  const closeSubPage = () => {
    if (isSliding(subPagePaneRef.current)) return;
    if (prefersReducedMotion()) setSubPage(null);
    else setSubPage((current) => current && { ...current, closing: true });
  };

  const handleThemesOpenChange = (next: boolean) => {
    setThemesOpen(next);
    if (!next) setJumpRequest(null);
  };

  const openResult = (setting: SearchableSetting) => {
    if (isSliding(sectionPaneRef.current)) return;
    selectSection(setting.section);
    setJumpRequest({ setting, nonce: Date.now() });
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 flex justify-center scrim md:items-center md:p-6',
            animateEntrance && 'data-[state=open]:before:animate-scrim-in'
          )}
        >
          <DialogPrimitive.Content
            ref={panelRef}
            aria-describedby={undefined}
            data-receded={themesOpen ? '' : undefined}
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              panelRef.current?.focus({ preventScroll: true });
            }}
            onEscapeKeyDown={(event) => {
              if (query) {
                event.preventDefault();
                setQuery('');
              } else if (showingSubPage) {
                event.preventDefault();
                closeSubPage();
              }
            }}
            className={cn(
              'relative flex h-dvh w-full overflow-hidden bg-background text-foreground outline-none',
              'md:h-[min(760px,calc(100dvh-3rem))] md:max-w-[1040px] md:rounded-[2rem] md:elev-panel',
              'data-[state=closed]:animate-sheet-out md:data-[state=closed]:animate-dialog-out',
              animateEntrance && 'data-[state=open]:animate-sheet-in md:data-[state=open]:animate-dialog-in',
              'max-sm:origin-top max-sm:transition-[scale,translate] max-sm:duration-[400ms] max-sm:ease-[cubic-bezier(0.32,0.72,0,1)]',
              'max-sm:data-receded:translate-y-(--safe-top) max-sm:data-receded:scale-[0.92] max-sm:data-receded:rounded-[2rem]'
            )}
          >
            <DialogPrimitive.Title className="sr-only">Settings</DialogPrimitive.Title>

            <SettingsSidebar
              className={cn(
                mobileView === 'list' || navTransition ? 'flex' : 'hidden',
                navTransition === 'push' && 'max-md:animate-push-back',
                navTransition === 'pop' && 'max-md:animate-pop-back'
              )}
              groups={visibleGroups}
              currentSection={currentSection}
              showGetApp={!showAppSection}
              query={query}
              onQueryChange={setQuery}
              searchRef={searchRef}
              results={results}
              onSelectSection={selectSection}
              onSelectResult={openResult}
            />

            <main
              ref={sectionPaneRef}
              onAnimationEnd={(event) => {
                if (event.target !== event.currentTarget || !navTransition) return;
                if (navTransition === 'pop') setMobileView('list');
                setNavTransition(null);
              }}
              className={cn(
                'relative min-w-0 flex-1 flex-col overflow-hidden md:flex',
                'max-md:absolute max-md:inset-0 max-md:z-10 max-md:bg-background',
                mobileView === 'section' ? 'flex' : 'hidden',
                navTransition === 'push' && 'max-md:animate-push-in',
                navTransition === 'pop' && 'max-md:animate-push-out'
              )}
            >
              <SettingsNavBar
                className="pt-(--safe-top) md:px-5 md:pt-5"
                leading={
                  <Button
                    variant="glass"
                    size="icon"
                    aria-label={showingSubPage ? `Back to ${currentMeta.label}` : 'Back to Settings'}
                    onClick={showingSubPage ? closeSubPage : showSectionList}
                    className={cn(!showingSubPage && 'md:invisible')}
                  >
                    <ChevronLeft className="size-5" strokeWidth={2.5} />
                  </Button>
                }
                trailing={<SettingsDoneButton />}
              >
                <h2 className="min-w-0 truncate text-center text-[17px] font-semibold md:invisible">
                  {showingSubPage ? subPage.title : currentMeta.label}
                </h2>
              </SettingsNavBar>

              <ScrollArea
                ref={contentRef}
                inert={subPage !== null}
                rootClassName={cn(
                  PAGE_EDGE_CLASS,
                  subPage && (subPage.closing ? 'animate-pop-back' : 'animate-push-back')
                )}
                className="overscroll-contain"
              >
                {showSection && (
                  <div key={currentSection} className={cn(PAGE_CLASS, 'md:animate-fade-in')}>
                    <SettingsNavContext.Provider value={navValue}>
                      <SettingsSectionContent section={currentSection} onCloseSettings={closeSettings} />
                    </SettingsNavContext.Provider>
                  </div>
                )}
              </ScrollArea>

              <div
                ref={subPagePaneRef}
                hidden={subPage === null}
                onAnimationEnd={(event) => {
                  if (event.target === event.currentTarget && subPage?.closing) setSubPage(null);
                }}
                className={cn(
                  'absolute inset-0 z-[5] flex-col bg-background',
                  subPage?.closing ? 'animate-push-out' : 'animate-push-in',
                  subPage !== null && 'flex'
                )}
              >
                <ScrollArea
                  ref={subPageScrollRef}
                  rootClassName={PAGE_EDGE_CLASS}
                  className="overscroll-contain"
                >
                  <div
                    ref={setSubPageContainer}
                    role="region"
                    aria-label={subPage?.title}
                    tabIndex={-1}
                    className={cn(PAGE_CLASS, 'outline-none')}
                  />
                </ScrollArea>
              </div>
            </main>

            <ThemesSheet open={themesOpen} onOpenChange={handleThemesOpenChange} revealRequest={themesRevealRequest} />
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
