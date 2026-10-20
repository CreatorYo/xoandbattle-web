import { ColorPicker } from '@/components/ui/color-picker';
import { cn, normalizeHex } from '@/lib/utils';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  disabled?: boolean;
  showHex?: boolean;
}

const checkerboard = 'repeating-conic-gradient(var(--muted) 0% 25%, var(--surface) 0% 50%) 50% / 8px 8px';

export function ColorInput({ value, onChange, label, disabled, showHex = true }: ColorInputProps) {
  const hex = normalizeHex(value);

  return (
    <ColorPicker value={hex ?? '#ffffff'} onChange={onChange} label={label} disabled={disabled}>
      <button
        type="button"
        aria-label={`${label}, ${hex ?? 'none'}`}
        className={cn(
          'flex h-8 shrink-0 items-center gap-2 rounded-full bg-foreground/6 p-1 transition-colors not-disabled:hover:bg-foreground/10',
          'outline-2 outline-offset-2 outline-transparent focus-visible:outline-brand',
          'disabled:cursor-not-allowed disabled:opacity-50',
          showHex && 'pr-3'
        )}
      >
        <span className="size-6 rounded-full inset-ring inset-ring-foreground/15" style={{ background: hex ?? checkerboard }} />
        {showHex && <span className="font-mono text-xs uppercase tabular-nums text-foreground/80">{hex ?? 'None'}</span>}
      </button>
    </ColorPicker>
  );
}
