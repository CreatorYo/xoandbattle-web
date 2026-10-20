import { Fragment, type ComponentType, type DragEvent, type ReactNode } from 'react';
import { Ellipsis, GripVertical } from 'lucide-react';
import type { GameTheme } from '@/contexts/GameContext';
import { Checkmark } from '@/components/ui/checkmark';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';

export interface ThemeAction {
  key: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  onSelect: () => void;
  destructive?: boolean;
}

interface ThemeRowProps {
  theme: GameTheme;
  selected: boolean;
  actions: ThemeAction[];
  onSelect: () => void;
  reorder?: boolean;
  isDragging?: boolean;
  isDropTarget?: boolean;
  dragHandlers?: {
    onDragStart: (event: DragEvent<HTMLDivElement>) => void;
    onDragOver: (event: DragEvent<HTMLDivElement>) => void;
    onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
    onDrop: (event: DragEvent<HTMLDivElement>) => void;
    onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
  };
}

type MenuItemComponent = ComponentType<{
  variant?: 'default' | 'destructive';
  onSelect?: (event: Event) => void;
  children?: ReactNode;
}>;

export function ThemeRow({ theme, selected, actions, onSelect, reorder, isDragging, isDropTarget, dragHandlers }: ThemeRowProps) {
  const renderItems = (Item: MenuItemComponent, Separator: ComponentType) =>
    actions.map((action) => (
      <Fragment key={action.key}>
        {action.destructive && <Separator />}
        <Item variant={action.destructive ? 'destructive' : 'default'} onSelect={action.onSelect}>
          <action.icon />
          {action.label}
        </Item>
      </Fragment>
    ));

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          draggable={!!dragHandlers}
          {...dragHandlers}
          className={cn(
            'group flex min-h-[3.25rem] items-center gap-3 pl-4 pr-3 transition-[background-color,opacity]',
            'active:bg-muted hover:bg-muted/60',
            reorder && 'cursor-grab active:cursor-grabbing',
            isDragging && 'opacity-40',
            isDropTarget && 'bg-brand/10 shadow-[inset_0_2px_0_var(--brand)]'
          )}
        >
          {reorder && <GripVertical className="size-4 shrink-0 text-muted-foreground" />}

          <button
            type="button"
            aria-pressed={selected}
            onClick={onSelect}
            className="flex min-w-0 flex-1 items-center gap-3 self-stretch py-3 text-left outline-2 -outline-offset-2 outline-transparent focus-visible:outline-brand"
          >
            <span className="flex shrink-0 items-center gap-1" aria-hidden>
              <span className="size-3 rounded-full" style={{ backgroundColor: theme.xColor }} />
              <span className="size-3 rounded-full" style={{ backgroundColor: theme.oColor }} />
            </span>
            <span className="truncate text-base">{theme.name}</span>
          </button>

          {selected && <Checkmark className="text-brand" />}

          {!reorder && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label={`Options for ${theme.name}`}
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-[opacity,background-color]',
                    'hover:bg-muted hover:text-foreground',
                    'opacity-0 group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:opacity-100 [@media(hover:none)]:opacity-100',
                    'outline-2 -outline-offset-2 outline-transparent focus-visible:outline-brand'
                  )}
                >
                  <Ellipsis className="size-[18px]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">{renderItems(DropdownMenuItem, DropdownMenuSeparator)}</DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>{renderItems(ContextMenuItem, ContextMenuSeparator)}</ContextMenuContent>
    </ContextMenu>
  );
}
