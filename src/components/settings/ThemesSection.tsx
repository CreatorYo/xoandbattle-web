import { useEffect, useState } from 'react';
import { ArrowDownUp, Copy, Info, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { defaultThemes, useGame, type GameTheme } from '@/contexts/GameContext';
import { useCustomThemes } from '@/hooks/use-custom-themes';
import { SettingsGroup, SettingsPage } from '@/components/ui/settings';
import { SearchField } from '@/components/ui/search-field';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast-helper';
import { CreateThemeDialog, type ThemeEditorMode } from '@/components/CreateThemeDialog';
import { ThemeInfoDialog } from '@/components/ThemeInfoDialog';
import { nextDuplicateName } from '@/lib/presets';
import { isTypingOrMenuTarget } from '@/lib/utils';
import { CustomPresetsGroup } from './CustomPresetsGroup';
import { SettingsTitleMenu } from './SettingsTitleMenu';
import { ThemeRow, type ThemeAction } from './ThemeRow';

type EditorState = { mode: ThemeEditorMode; theme: GameTheme | null };

export function ThemesSection({ titleSlot }: { titleSlot: HTMLElement | null }) {
  const { gameSettings, updateSettings } = useGame();
  const [customThemes, saveCustomThemes] = useCustomThemes();
  const [query, setQuery] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [detailsTheme, setDetailsTheme] = useState<GameTheme | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>({ mode: 'create', theme: null });
  const [deleteTarget, setDeleteTarget] = useState<GameTheme | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteAllCount, setDeleteAllCount] = useState(0);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const anyDialogOpen = editorOpen || !!detailsTheme || confirmDelete || confirmDeleteAll;
  const presetCount = customThemes.length;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'r' || event.repeat) return;
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      if (anyDialogOpen || isTypingOrMenuTarget(event.target)) return;
      setReorderMode((previous) => (previous || presetCount > 1 ? !previous : previous));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [anyDialogOpen, presetCount]);

  const normalizedQuery = query.trim().toLowerCase();
  const matches = (theme: GameTheme) => theme.name.toLowerCase().includes(normalizedQuery);
  const builtInResults = defaultThemes.filter(matches);
  const customResults = customThemes.filter(matches);
  const hasNoResults = normalizedQuery.length > 0 && builtInResults.length === 0 && customResults.length === 0;
  const canReorder = reorderMode && !normalizedQuery && presetCount > 1;
  const isCustom = (theme: GameTheme) => customThemes.some((custom) => custom.id === theme.id);

  const openEditor = (mode: ThemeEditorMode, theme: GameTheme | null = null) => {
    setEditor({ mode, theme });
    setEditorOpen(true);
  };

  const handleEditorSubmit = (data: Omit<GameTheme, 'id'>) => {
    if (editor.mode === 'edit' && editor.theme) {
      const id = editor.theme.id;
      const updated: GameTheme = { ...data, id };
      saveCustomThemes(customThemes.map((theme) => (theme.id === id ? updated : theme)));
      if (gameSettings.theme.id === id) updateSettings({ theme: updated });
      toast.success('Preset saved', `“${data.name}” has been updated.`);
    } else {
      const created: GameTheme = { ...data, id: `custom-${Date.now()}` };
      saveCustomThemes([...customThemes, created]);
      updateSettings({ theme: created });
      toast.success(editor.mode === 'duplicate' ? 'Preset duplicated' : 'Preset created', `“${data.name}” is now your theme.`);
    }
    setEditorOpen(false);
  };

  const deleteTheme = (theme: GameTheme) => {
    saveCustomThemes(customThemes.filter((custom) => custom.id !== theme.id));
    if (gameSettings.theme.id === theme.id) updateSettings({ theme: defaultThemes[0] });
    toast.success('Preset deleted', `“${theme.name}” has been removed.`);
  };

  const deleteAllPresets = () => {
    if (customThemes.some((custom) => custom.id === gameSettings.theme.id)) {
      updateSettings({ theme: defaultThemes[0] });
    }
    saveCustomThemes([]);
    setReorderMode(false);
    toast.success('Presets deleted', 'All custom presets have been removed.');
  };

  const actionsFor = (theme: GameTheme): ThemeAction[] => {
    const actions: ThemeAction[] = [
      { key: 'details', label: 'See Details', icon: Info, onSelect: () => setDetailsTheme(theme) },
      {
        key: 'duplicate',
        label: 'Duplicate',
        icon: Copy,
        onSelect: () =>
          openEditor('duplicate', { ...theme, name: nextDuplicateName(theme, [...defaultThemes, ...customThemes]) }),
      },
    ];
    if (isCustom(theme)) {
      actions.push(
        { key: 'edit', label: 'Edit', icon: Pencil, onSelect: () => openEditor('edit', theme) },
        {
          key: 'delete',
          label: 'Delete',
          icon: Trash2,
          destructive: true,
          onSelect: () => {
            setDeleteTarget(theme);
            setConfirmDelete(true);
          },
        },
      );
    }
    return actions;
  };

  return (
    <SettingsPage>
      <SettingsTitleMenu title="Themes" container={titleSlot}>
        <DropdownMenuItem onSelect={() => openEditor('create')}>
          <Plus />
          Add Preset
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={presetCount === 0}
          onSelect={() => {
            setDeleteAllCount(presetCount);
            setConfirmDeleteAll(true);
          }}
        >
          <Trash2 />
          Delete Presets
        </DropdownMenuItem>
      </SettingsTitleMenu>

      <SearchField label="Search themes" placeholder="Search" value={query} onChange={setQuery} />

      {hasNoResults ? (
        <div className="grouped-list flex flex-col items-center px-6 py-10 text-center">
          <Search className="size-7 text-muted-foreground" />
          <p className="mt-3 text-[17px] font-semibold">No Results</p>
          <p className="mt-1 text-[15px] text-muted-foreground">No themes match “{query.trim()}”.</p>
        </div>
      ) : (
        <>
          {builtInResults.length > 0 && (
            <SettingsGroup title="Themes" settingId="themes-list">
              {builtInResults.map((theme) => (
                <ThemeRow
                  key={theme.id}
                  theme={theme}
                  selected={gameSettings.theme.id === theme.id}
                  actions={actionsFor(theme)}
                  onSelect={() => updateSettings({ theme })}
                />
              ))}
            </SettingsGroup>
          )}

          {(customResults.length > 0 || !normalizedQuery) && (
            <CustomPresetsGroup
              presets={customThemes}
              visiblePresets={customResults}
              selectedId={gameSettings.theme.id}
              reorder={canReorder}
              showAddButton={!normalizedQuery && !canReorder}
              actionsFor={actionsFor}
              onSelect={(theme) => updateSettings({ theme })}
              onReorder={saveCustomThemes}
              onAdd={() => openEditor('create')}
            />
          )}
        </>
      )}

      {!normalizedQuery && (
        <div className="sticky bottom-0 z-10 mt-auto bg-linear-to-t from-background from-60% to-transparent pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-8">
          <Button
            variant="tinted"
            size="lg"
            data-setting-id="reorder-presets"
            disabled={!reorderMode && presetCount < 2}
            className="h-[3.25rem] w-full rounded-[1.25rem] bg-[color-mix(in_oklab,var(--brand)_16%,var(--surface))] not-disabled:hover:bg-[color-mix(in_oklab,var(--brand)_22%,var(--surface))]"
            onClick={() => setReorderMode((previous) => !previous)}
          >
            <ArrowDownUp className="size-[18px]" />
            {reorderMode ? 'Done Reordering' : 'Reorder'}
          </Button>
        </div>
      )}

      <ThemeInfoDialog
        theme={detailsTheme}
        isCustom={detailsTheme ? isCustom(detailsTheme) : false}
        open={!!detailsTheme}
        onOpenChange={(open) => !open && setDetailsTheme(null)}
      />

      <CreateThemeDialog
        open={editorOpen}
        onOpenChange={setEditorOpen}
        mode={editor.mode}
        initialTheme={editor.theme}
        onSubmit={handleEditorSubmit}
      />

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title={`Delete “${deleteTarget?.name ?? 'preset'}”?`}
        description="This preset will be removed permanently."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => deleteTarget && deleteTheme(deleteTarget)}
      />

      <ConfirmDialog
        open={confirmDeleteAll}
        onOpenChange={setConfirmDeleteAll}
        title="Delete Presets"
        description={`Your ${deleteAllCount} custom preset${deleteAllCount === 1 ? '' : 's'} will be deleted. This can’t be undone.`}
        confirmText="Delete Presets"
        variant="destructive"
        onConfirm={deleteAllPresets}
      />
    </SettingsPage>
  );
}
