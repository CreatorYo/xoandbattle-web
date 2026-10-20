import type { RefObject } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SearchField } from '@/components/ui/search-field';
import { SettingsIcon } from '@/components/ui/settings';
import { pressableRowClassName } from '@/components/ui/row-styles';
import { APP_NAME, APP_VERSION } from '@/lib/app-info';
import { cn } from '@/lib/utils';
import { GetAppCard } from './GetAppCard';
import { SearchResults } from './SearchResults';
import { SettingsCloseButton } from './SettingsDoneButton';
import type { SearchableSetting } from './search-index';
import { isModalSection, type PageSectionId, type SectionGroup, type SectionId } from './sections';

interface SettingsSidebarProps {
  className?: string;
  groups: SectionGroup[];
  currentSection: PageSectionId;
  showGetApp: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  searchRef: RefObject<HTMLInputElement | null>;
  results: SearchableSetting[];
  onSelectSection: (id: SectionId) => void;
  onSelectResult: (setting: SearchableSetting) => void;
}

export function SettingsSidebar({
  className,
  groups,
  currentSection,
  showGetApp,
  query,
  onQueryChange,
  searchRef,
  results,
  onSelectSection,
  onSelectResult,
}: SettingsSidebarProps) {
  const isSearching = query.trim().length > 0;

  return (
    <aside
      className={cn(
        'w-full shrink-0 flex-col md:flex md:w-[280px] md:border-r md:border-border md:bg-surface-muted',
        className
      )}
    >
      <div className="flex justify-end px-3 pt-(--safe-top) md:hidden">
        <SettingsCloseButton />
      </div>

      <div className="px-5 pb-3 md:px-4 md:pt-6">
        <h2 className="mb-3 text-[34px] font-bold tracking-tight md:mb-4 md:px-1 md:text-2xl">Settings</h2>
        <SearchField
          inputRef={searchRef}
          label="Search settings"
          value={query}
          onChange={onQueryChange}
          onSubmit={() => results[0] && onSelectResult(results[0])}
        />
      </div>

      <nav aria-label={isSearching ? 'Search results' : 'Settings sections'} className="flex min-h-0 flex-1 flex-col">
        <ScrollArea className="overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:px-3 md:pb-4">
          {isSearching ? (
            <SearchResults results={results} onSelect={onSelectResult} />
          ) : (
            groups.map((group) => (
              <div key={group.label} className="mt-6 first:mt-3 md:mt-5 md:first:mt-2">
                <p className="mb-2 px-4 text-[13px] uppercase tracking-[0.02em] text-muted-foreground md:px-3 md:text-xs md:font-medium md:normal-case md:tracking-normal">
                  {group.label}
                </p>

                <ul className="grouped-list md:hidden">
                  {group.sections.map((section) => (
                    <li key={section.id} className="[--separator-inset:3.625rem]">
                      <button
                        type="button"
                        aria-haspopup={isModalSection(section.id) ? 'dialog' : undefined}
                        onClick={() => onSelectSection(section.id)}
                        className={cn(
                          'flex min-h-[3.25rem] w-full items-center gap-3 px-4 py-2 text-left text-base text-foreground',
                          pressableRowClassName
                        )}
                      >
                        <SettingsIcon color={section.color}>
                          <section.icon />
                        </SettingsIcon>
                        <span className="flex-1">{section.label}</span>
                        <ChevronRight className="size-[18px] text-muted-foreground/50" strokeWidth={2.5} />
                      </button>
                    </li>
                  ))}
                </ul>

                <ul className="hidden flex-col gap-0.5 md:flex">
                  {group.sections.map((section) => {
                    const isActive = currentSection === section.id;
                    return (
                      <li key={section.id}>
                        <button
                          type="button"
                          aria-current={isActive ? 'page' : undefined}
                          aria-haspopup={isModalSection(section.id) ? 'dialog' : undefined}
                          onClick={() => onSelectSection(section.id)}
                          className={cn(
                            'flex h-10 w-full items-center gap-3 rounded-full px-2 text-left text-[15px] text-foreground transition-colors',
                            'outline-2 -outline-offset-2 outline-transparent focus-visible:outline-brand',
                            isActive ? 'bg-foreground/8 font-semibold' : 'hover:bg-foreground/5'
                          )}
                        >
                          <SettingsIcon color={section.color} size="sm">
                            <section.icon />
                          </SettingsIcon>
                          {section.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}

          {!isSearching && showGetApp && <GetAppCard className="mt-6 md:hidden" />}
        </ScrollArea>
      </nav>

      <div className="hidden border-t border-border p-3 md:block">
        {showGetApp && <GetAppCard />}
        <p className={cn('px-2 text-xs text-muted-foreground', showGetApp && 'mt-2.5')}>
          {APP_NAME} · v{APP_VERSION}
        </p>
      </div>
    </aside>
  );
}
