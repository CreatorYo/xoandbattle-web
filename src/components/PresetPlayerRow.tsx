import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { ColorInput } from '@/components/ColorInput';
import { PRESET_SYMBOL_LIMIT } from '@/lib/presets';

interface PresetPlayerRowProps {
  player: 'X' | 'O';
  color: string;
  symbol: string;
  defaultSymbol: string;
  onColorChange: (color: string) => void;
  onSymbolChange: (symbol: string) => void;
}

export function PresetPlayerRow({
  player,
  color,
  symbol,
  defaultSymbol,
  onColorChange,
  onSymbolChange,
}: PresetPlayerRowProps) {
  const symbolId = useId();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3">
      <span className="w-16 shrink-0 text-sm font-medium">Player {player}</span>
      <ColorInput label={`Player ${player} colour`} value={color} onChange={onColorChange} />
      <div className="ml-auto flex items-center gap-2">
        <label htmlFor={symbolId} className="text-[13px] text-muted-foreground max-sm:sr-only">
          Symbol
        </label>
        <Input
          id={symbolId}
          value={symbol}
          maxLength={PRESET_SYMBOL_LIMIT}
          placeholder={defaultSymbol}
          title="Symbol"
          autoComplete="off"
          onChange={(event) => onSymbolChange(event.target.value)}
          className="h-9 w-12 border-border bg-transparent px-0 text-center text-lg font-semibold"
          style={{ color }}
        />
      </div>
    </div>
  );
}
