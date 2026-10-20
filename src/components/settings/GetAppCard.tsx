import { Download } from 'lucide-react';
import { APP_STORE, cn } from '@/lib/utils';

export function GetAppCard({ className }: { className?: string }) {
  return (
    <a
      href={APP_STORE.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2.5 rounded-[0.875rem] bg-surface px-2.5 py-2 text-foreground transition-[background-color] hover:bg-muted/60',
        'outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand',
        className
      )}
    >
      <img
        src="/assets/XO_Battle_Logo_Transparent.png"
        alt=""
        width={28}
        height={28}
        decoding="async"
        draggable={false}
        className="size-7 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold leading-tight text-foreground">Get the full app</p>
        <p className="truncate text-xs text-muted-foreground">On the {APP_STORE.name}</p>
      </div>
      <Download className="size-3.5 shrink-0 text-brand" />
    </a>
  );
}
