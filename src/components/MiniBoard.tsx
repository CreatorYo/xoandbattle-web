import type { CSSProperties } from 'react';
import { getSymbols } from '@/lib/symbols';

type Mark = 'X' | 'O' | null;

const DEFAULT_PATTERN: Mark[] = ['X', 'O', null, null, 'X', 'O', 'O', null, 'X'];

const sizes = {
  md: { cell: 26, gap: 4, radius: 6, font: 18 },
  lg: { cell: 40, gap: 6, radius: 9, font: 28 },
} as const;

interface MiniBoardProps {
  xColor: string;
  oColor: string;
  xSymbol?: string;
  oSymbol?: string;
  boxFill?: boolean;
  size?: keyof typeof sizes;
  pattern?: Mark[];
  cellStyle?: CSSProperties;
}

export function MiniBoard({
  xColor,
  oColor,
  xSymbol,
  oSymbol,
  boxFill = false,
  size = 'md',
  pattern = DEFAULT_PATTERN,
  cellStyle,
}: MiniBoardProps) {
  const metrics = sizes[size];
  const symbols = getSymbols({ xSymbol, oSymbol });

  return (
    <div aria-hidden className="grid grid-cols-3" style={{ gap: metrics.gap }}>
      {pattern.map((mark, index) => {
        const color = mark === 'X' ? xColor : mark === 'O' ? oColor : undefined;
        return (
          <div
            key={index}
            className="flex items-center justify-center border border-border bg-cell font-bold leading-none"
            style={{
              width: metrics.cell,
              height: metrics.cell,
              borderRadius: metrics.radius,
              fontSize: metrics.font,
              color,
              ...cellStyle,
              ...(boxFill && color ? { background: `color-mix(in oklab, ${color} 14%, transparent)` } : null),
            }}
          >
            {mark === 'X' ? symbols.x : mark === 'O' ? symbols.o : null}
          </div>
        );
      })}
    </div>
  );
}
