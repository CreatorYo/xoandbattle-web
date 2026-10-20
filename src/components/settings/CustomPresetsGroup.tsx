import { useState, type DragEvent } from 'react';
import { Plus } from 'lucide-react';
import type { GameTheme } from '@/contexts/GameContext';
import { SettingsGroup } from '@/components/ui/settings';
import { pressableRowClassName } from '@/components/ui/row-styles';
import { cn } from '@/lib/utils';
import { ThemeRow, type ThemeAction } from './ThemeRow';

interface CustomPresetsGroupProps {
  presets: GameTheme[];
  visiblePresets: GameTheme[];
  selectedId: string;
  reorder: boolean;
  showAddButton: boolean;
  actionsFor: (theme: GameTheme) => ThemeAction[];
  onSelect: (theme: GameTheme) => void;
  onReorder: (presets: GameTheme[]) => void;
  onAdd: () => void;
}

export function CustomPresetsGroup({
  presets,
  visiblePresets,
  selectedId,
  reorder,
  showAddButton,
  actionsFor,
  onSelect,
  onReorder,
  onAdd,
}: CustomPresetsGroupProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const resetDrag = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDrop = (event: DragEvent, targetIndex: number) => {
    event.preventDefault();
    if (dragIndex !== null && dragIndex !== targetIndex) {
      const reordered = [...presets];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(targetIndex, 0, moved);
      onReorder(reordered);
    }
    resetDrag();
  };

  return (
    <SettingsGroup
      settingId="custom-presets"
      title={presets.length > 0 ? `Custom Presets (${presets.length})` : 'Custom Presets'}
      footer={reorder ? 'Drag presets to reorder them. Press R when you’re done.' : undefined}
    >
      {presets.length === 0 && (
        <p className="flex min-h-[3.25rem] items-center px-4 text-base text-muted-foreground">No custom presets yet.</p>
      )}

      {visiblePresets.map((theme) => {
        const index = presets.findIndex((preset) => preset.id === theme.id);
        return (
          <ThemeRow
            key={theme.id}
            theme={theme}
            selected={selectedId === theme.id}
            actions={actionsFor(theme)}
            onSelect={() => {
              if (dragIndex === null) onSelect(theme);
            }}
            reorder={reorder}
            isDragging={dragIndex === index}
            isDropTarget={dropIndex === index && dragIndex !== index}
            dragHandlers={
              reorder
                ? {
                    onDragStart: (event) => {
                      event.dataTransfer.effectAllowed = 'move';
                      setDragIndex(index);
                    },
                    onDragOver: (event) => {
                      event.preventDefault();
                      event.dataTransfer.dropEffect = 'move';
                      if (dropIndex !== index) setDropIndex(index);
                    },
                    onDragLeave: (event) => {
                      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                        setDropIndex((current) => (current === index ? null : current));
                      }
                    },
                    onDrop: (event) => handleDrop(event, index),
                    onDragEnd: resetDrag,
                  }
                : undefined
            }
          />
        );
      })}

      {showAddButton && (
        <button
          type="button"
          data-setting-id="add-preset"
          onClick={onAdd}
          className={cn('flex min-h-[3.25rem] w-full items-center gap-3 px-4 text-left text-base text-brand', pressableRowClassName)}
        >
          <span aria-hidden className="flex size-[22px] items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Plus className="size-3.5" strokeWidth={3} />
          </span>
          Add Preset
        </button>
      )}
    </SettingsGroup>
  );
}
