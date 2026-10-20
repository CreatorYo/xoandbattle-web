import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface SettingsTitleMenuProps {
  title: string;
  container: HTMLElement | null;
  children: ReactNode;
}

export function SettingsTitleMenu({ title, container, children }: SettingsTitleMenuProps) {
  if (!container) return null;

  return createPortal(
    <h2 className="text-[17px] font-semibold">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group inline-flex items-center gap-2 rounded-full py-1 pl-2 pr-1 outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand"
          >
            {title}
            <span
              aria-hidden
              className="flex size-6 items-center justify-center rounded-full bg-foreground/10 text-muted-foreground transition-[rotate,background-color] duration-200 group-hover:bg-foreground/15 group-data-[state=open]:rotate-180"
            >
              <ChevronDown className="size-4" strokeWidth={2.5} />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">{children}</DropdownMenuContent>
      </DropdownMenu>
    </h2>,
    container
  );
}
