import type { ReactNode } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '@/contexts/ThemeContext';
import { Checkmark } from '@/components/ui/checkmark';
import { cn } from '@/lib/utils';

const MODE_OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const MODE_PALETTES = {
  light: { bg: '#f1f1f4', panel: '#ffffff', line: '#dcdce2', faint: '#ebebef' },
  dark: { bg: '#141417', panel: '#232328', line: '#3a3a42', faint: '#2c2c33' },
} as const;

function ModePreview({ palette }: { palette: (typeof MODE_PALETTES)[keyof typeof MODE_PALETTES] }) {
  return (
    <div className="flex h-full gap-1.5 p-2" style={{ background: palette.bg }}>
      <div className="flex w-[30%] flex-col gap-1 rounded-[5px] p-1.5" style={{ background: palette.faint }}>
        <span className="h-1.5 w-full rounded-full" style={{ background: palette.line }} />
        <span className="h-1.5 w-3/4 rounded-full bg-brand/70" />
        <span className="h-1.5 w-2/3 rounded-full" style={{ background: palette.line }} />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 rounded-[5px] p-1.5" style={{ background: palette.panel }}>
        <span className="h-1.5 w-2/3 rounded-full" style={{ background: palette.line }} />
        <span className="h-1.5 w-1/2 rounded-full" style={{ background: palette.faint }} />
        <span className="mt-auto h-2.5 w-7 self-end rounded-[3px] bg-brand" />
      </div>
    </div>
  );
}

interface ModeCardProps {
  mode: Theme;
  label: string;
  icon: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

function ModeCard({ mode, label, icon, selected, onSelect }: ModeCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className="group flex flex-col items-center gap-2.5 rounded-xl p-1 outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand"
    >
      <div
        className={cn(
          'relative h-[76px] w-full max-w-[120px] overflow-hidden rounded-[10px] transition-shadow sm:h-[88px]',
          selected
            ? 'shadow-[0_0_0_2px_var(--surface),0_0_0_4px_var(--brand)]'
            : 'shadow-[0_0_0_1px_var(--border)] group-hover:shadow-[0_0_0_1px_var(--border-strong)]'
        )}
      >
        {mode === 'system' ? (
          <div className="grid h-full grid-cols-2">
            <div className="overflow-hidden">
              <div className="h-full w-[200%]">
                <ModePreview palette={MODE_PALETTES.light} />
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="h-full w-[200%] -translate-x-1/2">
                <ModePreview palette={MODE_PALETTES.dark} />
              </div>
            </div>
          </div>
        ) : (
          <ModePreview palette={MODE_PALETTES[mode]} />
        )}
      </div>
      <span className="flex items-center gap-1 text-[15px]">
        <span className="text-muted-foreground">{icon}</span>
        {label}
      </span>
      <span
        aria-hidden
        className={cn(
          'flex size-[22px] items-center justify-center rounded-full transition-colors',
          selected ? 'bg-brand text-brand-foreground' : 'border-[1.5px] border-border-strong'
        )}
      >
        {selected && <Checkmark className="size-3.5" strokeWidth={3} />}
      </span>
    </button>
  );
}

export function ColourModePicker() {
  const { theme, setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Colour mode" className="grid grid-cols-3 gap-2 px-3 pb-4 pt-5 sm:px-6">
      {MODE_OPTIONS.map((option) => (
        <ModeCard
          key={option.value}
          mode={option.value}
          label={option.label}
          icon={<option.icon className="size-3.5" />}
          selected={theme === option.value}
          onSelect={() => setTheme(option.value)}
        />
      ))}
    </div>
  );
}
