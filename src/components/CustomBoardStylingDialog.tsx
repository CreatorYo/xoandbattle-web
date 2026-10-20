import type { CSSProperties, ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { useGame, type BoardStyling } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { ColorInput } from './ColorInput';
import { MiniBoard } from './MiniBoard';
import { DEFAULT_CUSTOM_STYLING, DEFAULT_GRADIENT, isDefaultCustomStyling } from '@/lib/board-styling';
import { cn } from '@/lib/utils';

interface CustomBoardStylingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Fill = 'none' | 'solid' | 'gradient';

const PREVIEW_SCALE = 40 / 104;

export function CustomBoardStylingDialog({ open, onOpenChange }: CustomBoardStylingDialogProps) {
  const { gameSettings, updateSettings } = useGame();
  const { resolvedTheme } = useTheme();
  const styling = gameSettings.boardStyling;

  const radius = styling.borderRadius ?? 12;
  const borderWidth = styling.borderWidth ?? 0;
  const borderColor = styling.borderColor || '#000000';
  const gradient = styling.gradientColors?.length === 2 ? styling.gradientColors : DEFAULT_GRADIENT;
  const fill: Fill = styling.useGradient
    ? 'gradient'
    : styling.backgroundColor && styling.backgroundColor !== 'transparent'
      ? 'solid'
      : 'none';

  const update = (patch: Partial<BoardStyling>) => {
    updateSettings({ boardStyling: { ...styling, ...patch, style: 'custom' } });
  };

  const handleFillChange = (next: Fill) => {
    if (next === 'none') {
      update({ useGradient: false, backgroundColor: 'transparent' });
    } else if (next === 'solid') {
      const fallback = resolvedTheme === 'dark' ? '#27272a' : '#ffffff';
      update({
        useGradient: false,
        backgroundColor: fill === 'solid' ? styling.backgroundColor : fallback,
      });
    } else {
      update({ useGradient: true, gradientColors: gradient });
    }
  };

  const previewCellStyle: CSSProperties = {
    borderRadius: Math.round(radius * PREVIEW_SCALE),
    borderWidth: borderWidth > 0 ? Math.max(1, Math.round(borderWidth * PREVIEW_SCALE)) : 0,
    borderColor: borderWidth > 0 ? borderColor : undefined,
    borderStyle: 'solid',
    background:
      fill === 'gradient'
        ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
        : fill === 'solid'
          ? styling.backgroundColor
          : undefined,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Customise Board</DialogTitle>
          <DialogDescription>Changes apply to the board straight away.</DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-6">
          <div className="flex justify-center rounded-xl bg-surface-sunken py-6">
            <MiniBoard
              size="lg"
              xColor={gameSettings.theme.xColor}
              oColor={gameSettings.theme.oColor}
              xSymbol={gameSettings.theme.xSymbol}
              oSymbol={gameSettings.theme.oSymbol}
              cellStyle={previewCellStyle}
            />
          </div>

          <div className="flex flex-col gap-5">
            <SliderField
              label="Corner Radius"
              value={radius}
              max={50}
              onChange={(value) => update({ borderRadius: value })}
            />
            <SliderField
              label="Border Width"
              value={borderWidth}
              max={10}
              onChange={(value) => update({ borderWidth: value })}
            />
            <InlineField label="Border Colour" disabled={borderWidth === 0}>
              <ColorInput
                label="Border Colour"
                value={borderColor}
                disabled={borderWidth === 0}
                onChange={(color) => update({ borderColor: color })}
              />
            </InlineField>

            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-medium">Fill</span>
              <SegmentedControl
                aria-label="Square fill"
                value={fill}
                onValueChange={handleFillChange}
                options={[
                  { value: 'none', label: 'Theme' },
                  { value: 'solid', label: 'Solid' },
                  { value: 'gradient', label: 'Gradient' },
                ]}
              />
            </div>

            {fill === 'solid' && (
              <InlineField label="Fill Colour">
                <ColorInput
                  label="Fill Colour"
                  value={styling.backgroundColor ?? '#ffffff'}
                  onChange={(color) => update({ backgroundColor: color })}
                />
              </InlineField>
            )}

            {fill === 'gradient' && (
              <>
                <InlineField label="Gradient Start">
                  <ColorInput
                    label="Gradient Start"
                    value={gradient[0]}
                    onChange={(color) => update({ gradientColors: [color, gradient[1]] })}
                  />
                </InlineField>
                <InlineField label="Gradient End">
                  <ColorInput
                    label="Gradient End"
                    value={gradient[1]}
                    onChange={(color) => update({ gradientColors: [gradient[0], color] })}
                  />
                </InlineField>
              </>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            variant="ghost-muted"
            disabled={isDefaultCustomStyling(styling)}
            onClick={() => updateSettings({ boardStyling: { ...DEFAULT_CUSTOM_STYLING } })}
          >
            <RotateCcw />
            Restore Defaults
          </Button>
          <DialogClose asChild>
            <Button variant="primary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InlineField({ label, disabled, children }: { label: string; disabled?: boolean; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={cn('text-sm font-medium', disabled && 'opacity-50')}>{label}</span>
      {children}
    </div>
  );
}

function SliderField({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="rounded-md bg-surface-sunken px-1.5 py-0.5 font-mono text-xs tabular-nums text-muted-foreground">
          {value}px
        </span>
      </div>
      <Slider
        thumbLabel={label}
        value={[value]}
        min={0}
        max={max}
        step={1}
        onValueChange={([next]) => onChange(next)}
      />
    </div>
  );
}
