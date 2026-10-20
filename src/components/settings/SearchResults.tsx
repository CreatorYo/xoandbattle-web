import { ChevronRight, Search } from 'lucide-react';
import { SettingsIcon } from '@/components/ui/settings';
import { pressableRowClassName } from '@/components/ui/row-styles';
import { cn } from '@/lib/utils';
import { getSectionMeta } from './sections';
import type { SearchableSetting } from './search-index';

interface SearchResultsProps {
  results: SearchableSetting[];
  onSelect: (setting: SearchableSetting) => void;
}

export function SearchResults({ results, onSelect }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-12 text-center" role="status">
        <Search className="size-8 text-muted-foreground" />
        <p className="mt-3 text-[17px] font-semibold">No Results</p>
        <p className="mt-1 text-[15px] text-muted-foreground">Check the spelling or try a new search.</p>
      </div>
    );
  }

  return (
    <ul className="grouped-list mt-2" aria-live="polite">
      {results.map((setting) => {
        const section = getSectionMeta(setting.section);
        return (
          <li key={setting.id} className="[--separator-inset:3.625rem]">
            <button
              type="button"
              onClick={() => onSelect(setting)}
              className={cn('flex min-h-[3.25rem] w-full items-center gap-3 px-4 py-2 text-left', pressableRowClassName)}
            >
              <SettingsIcon color={section.color}>
                <section.icon />
              </SettingsIcon>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base">{setting.label}</span>
                <span className="block truncate text-[13px] text-muted-foreground">{section.label}</span>
              </span>
              <ChevronRight className="size-[18px] shrink-0 text-muted-foreground/50" strokeWidth={2.5} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
