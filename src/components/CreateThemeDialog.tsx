import { useId, useState, type FormEvent } from 'react';
import type { GameTheme } from '@/contexts/GameContext';
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
import { CharacterCounter, FormField } from '@/components/ui/form-field';
import { Input, Textarea } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { MiniBoard } from './MiniBoard';
import { PresetPlayerRow } from './PresetPlayerRow';
import { DEFAULT_O_SYMBOL, DEFAULT_X_SYMBOL, getSymbols } from '@/lib/symbols';
import { PRESET_DESCRIPTION_LIMIT, PRESET_NAME_LIMIT } from '@/lib/presets';

export type ThemeEditorMode = 'create' | 'edit' | 'duplicate';

type ThemeDraft = Omit<GameTheme, 'id'>;

const EMPTY_DRAFT: ThemeDraft = {
  name: '',
  description: '',
  xColor: '#1a73e8',
  oColor: '#ea4335',
  enableBoxFill: false,
  xSymbol: DEFAULT_X_SYMBOL,
  oSymbol: DEFAULT_O_SYMBOL,
};

const COPY: Record<ThemeEditorMode, { title: string; submit: string }> = {
  create: { title: 'New Preset', submit: 'Create Preset' },
  edit: { title: 'Edit Preset', submit: 'Save Changes' },
  duplicate: { title: 'Duplicate Preset', submit: 'Create Copy' },
};

function toDraft(theme: GameTheme | null): ThemeDraft {
  if (!theme) return EMPTY_DRAFT;
  const symbols = getSymbols(theme);
  return {
    name: theme.name.slice(0, PRESET_NAME_LIMIT),
    description: theme.description ?? '',
    xColor: theme.xColor,
    oColor: theme.oColor,
    enableBoxFill: !!theme.enableBoxFill,
    xSymbol: symbols.x,
    oSymbol: symbols.o,
  };
}

interface CreateThemeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ThemeEditorMode;
  initialTheme: GameTheme | null;
  onSubmit: (theme: ThemeDraft) => void;
}

export function CreateThemeDialog({ open, onOpenChange, mode, initialTheme, onSubmit }: CreateThemeDialogProps) {
  const [draft, setDraft] = useState<ThemeDraft>(() => toDraft(initialTheme));
  const [wasOpen, setWasOpen] = useState(open);
  const nameId = useId();
  const descriptionId = useId();
  const fillId = useId();

  if (wasOpen !== open) {
    setWasOpen(open);
    if (open) setDraft(toDraft(initialTheme));
  }

  const set = <K extends keyof ThemeDraft>(key: K, value: ThemeDraft[K]) =>
    setDraft((previous) => ({ ...previous, [key]: value }));

  const trimmedName = draft.name.trim();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!trimmedName) return;
    onSubmit({
      ...draft,
      name: trimmedName,
      description: draft.description.trim(),
      xSymbol: draft.xSymbol?.trim() || DEFAULT_X_SYMBOL,
      oSymbol: draft.oSymbol?.trim() || DEFAULT_O_SYMBOL,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="lg">
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader>
            <DialogTitle>{COPY[mode].title}</DialogTitle>
            <DialogDescription>Presets are saved on this device and appear under Custom Presets.</DialogDescription>
          </DialogHeader>

          <DialogBody className="flex flex-col gap-6">
            <div className="flex items-center justify-center rounded-xl bg-surface-sunken py-5">
              <MiniBoard
                size="md"
                xColor={draft.xColor}
                oColor={draft.oColor}
                xSymbol={draft.xSymbol}
                oSymbol={draft.oSymbol}
                boxFill={draft.enableBoxFill}
              />
            </div>

            <FormField
              label="Name"
              htmlFor={nameId}
              counter={<CharacterCounter value={draft.name.length} limit={PRESET_NAME_LIMIT} />}
            >
              <Input
                id={nameId}
                value={draft.name}
                maxLength={PRESET_NAME_LIMIT}
                placeholder="e.g. Midnight"
                autoComplete="off"
                onChange={(event) => set('name', event.target.value)}
              />
            </FormField>

            <div className="flex flex-col gap-2.5">
              <span className="text-sm font-medium">Players</span>
              <div className="grouped-list bg-surface-sunken">
                <PresetPlayerRow
                  player="X"
                  color={draft.xColor}
                  symbol={draft.xSymbol ?? ''}
                  defaultSymbol={DEFAULT_X_SYMBOL}
                  onColorChange={(color) => set('xColor', color)}
                  onSymbolChange={(symbol) => set('xSymbol', symbol)}
                />
                <PresetPlayerRow
                  player="O"
                  color={draft.oColor}
                  symbol={draft.oSymbol ?? ''}
                  defaultSymbol={DEFAULT_O_SYMBOL}
                  onColorChange={(color) => set('oColor', color)}
                  onSymbolChange={(symbol) => set('oSymbol', symbol)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-sunken px-4 py-3">
              <div>
                <p id={`${fillId}-label`} className="text-sm font-medium">
                  Fill squares
                </p>
                <p id={`${fillId}-description`} className="mt-0.5 text-[13px] text-muted-foreground">
                  Tint each square with its mark’s colour.
                </p>
              </div>
              <Switch
                aria-labelledby={`${fillId}-label`}
                aria-describedby={`${fillId}-description`}
                checked={draft.enableBoxFill}
                onCheckedChange={(checked) => set('enableBoxFill', checked)}
              />
            </div>

            <FormField
              label="Description"
              optional
              htmlFor={descriptionId}
              counter={<CharacterCounter value={draft.description.length} limit={PRESET_DESCRIPTION_LIMIT} />}
            >
              <Textarea
                id={descriptionId}
                value={draft.description}
                maxLength={PRESET_DESCRIPTION_LIMIT}
                rows={3}
                placeholder="What makes this preset yours?"
                onChange={(event) => set('description', event.target.value)}
              />
            </FormField>
          </DialogBody>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="primary" disabled={!trimmedName}>
              {COPY[mode].submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
