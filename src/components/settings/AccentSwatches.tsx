import { Pipette } from 'lucide-react';
import { Checkmark } from '@/components/ui/checkmark';
import { ColorPicker } from '@/components/ui/color-picker';
import { cn, getReadableForeground } from '@/lib/utils';

const ACCENT_PRESETS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Graphite', value: '#64748b' },
];

const swatchClass = (selected: boolean) =>
  cn(
    'relative size-7 shrink-0 rounded-full transition-[scale,outline-color] duration-150',
    'outline-2 outline-offset-2 hover:scale-110 active:scale-95',
    selected ? 'outline-foreground/80' : 'outline-transparent focus-visible:outline-brand'
  );

interface AccentSwatchesProps {
  value: string;
  onChange: (color: string) => void;
}

export function AccentSwatches({ value, onChange }: AccentSwatchesProps) {
  const isPreset = ACCENT_PRESETS.some((preset) => preset.value === value);

  return (
    <div role="radiogroup" aria-label="Accent colour" className="flex flex-wrap items-center gap-2.5">
      {ACCENT_PRESETS.map((preset) => {
        const selected = preset.value === value;
        return (
          <button
            key={preset.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={preset.name}
            title={preset.name}
            onClick={() => onChange(preset.value)}
            className={swatchClass(selected)}
            style={{ background: preset.value, boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.12)' }}
          >
            {selected && (
              <Checkmark
                className="absolute inset-0 m-auto size-3.5"
                style={{ color: getReadableForeground(preset.value) }}
                strokeWidth={3}
              />
            )}
          </button>
        );
      })}

      <span className="mx-0.5 h-5 w-px bg-border" aria-hidden />

      <ColorPicker value={value} onChange={onChange} label="Custom accent colour">
        <button
          type="button"
          aria-label="Custom accent colour"
          title="Custom colour"
          className={cn(swatchClass(!isPreset), 'overflow-hidden')}
          style={{
            background: isPreset
              ? 'conic-gradient(from 180deg, #ef4444, #f59e0b, #22c55e, #14b8a6, #3b82f6, #8b5cf6, #ec4899, #ef4444)'
              : value,
            boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.12)',
          }}
        >
          {isPreset ? (
            <span className="absolute inset-[5px] flex items-center justify-center rounded-full bg-surface">
              <Pipette className="size-3 text-muted-foreground" />
            </span>
          ) : (
            <Checkmark
              className="absolute inset-0 m-auto size-3.5"
              style={{ color: getReadableForeground(value) }}
              strokeWidth={3}
            />
          )}
        </button>
      </ColorPicker>
    </div>
  );
}
