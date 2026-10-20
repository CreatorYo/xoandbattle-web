import { useRef, useState, type ChangeEvent } from 'react';
import { FileDown, FileUp, RotateCcw, Trash2 } from 'lucide-react';
import { defaultSettings, defaultThemes, useGame, type GameTheme } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { readCustomThemes, useCustomThemes, writeCustomThemes } from '@/hooks/use-custom-themes';
import { SettingsActionRow, SettingsGroup, SettingsPage } from '@/components/ui/settings';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from '@/components/ui/toast-helper';
import { sanitizePresets } from '@/lib/presets';

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

function downloadPresets(themes: GameTheme[]) {
  const blob = new Blob([JSON.stringify(themes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'XOBattle-Themes.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function DataSection() {
  const { updateSettings, gameSettings } = useGame();
  const { setTheme } = useTheme();
  const { resetPreferences } = usePreferences();
  const [customThemes] = useCustomThemes();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmExport, setConfirmExport] = useState(false);
  const [confirmDeletePresets, setConfirmDeletePresets] = useState(false);
  const [confirmCount, setConfirmCount] = useState(0);
  const [confirmResetSettings, setConfirmResetSettings] = useState(false);

  const presetCount = customThemes.length;

  const handleExport = () => {
    try {
      const themes = readCustomThemes();
      if (themes.length === 0) {
        toast.error('Nothing to export', 'You haven’t created any presets yet.');
        return;
      }
      downloadPresets(themes);
      toast.success('Themes exported', `${plural(themes.length, 'preset')} saved to XOBattle-Themes.json.`);
    } catch (error) {
      console.error('Failed to export themes:', error);
      toast.error('Export failed', 'Something went wrong. Please try again.');
    }
  };

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('Invalid file format');

        const valid = sanitizePresets(parsed);
        if (valid.length === 0) {
          toast.error('Import failed', 'No valid presets were found in that file.');
          return;
        }

        const existing = readCustomThemes();
        const knownIds = new Set([...existing, ...defaultThemes].map((theme) => theme.id));
        const added: GameTheme[] = [];
        let skipped = 0;

        valid.forEach((theme) => {
          if (knownIds.has(theme.id)) {
            skipped += 1;
            return;
          }
          knownIds.add(theme.id);
          added.push(theme);
        });

        writeCustomThemes([...existing, ...added]);

        if (added.length === 0) {
          toast.info('Already up to date', `All ${plural(skipped, 'preset')} in that file already exist.`);
        } else {
          toast.success(
            'Themes imported',
            `${plural(added.length, 'preset')} added${skipped ? `, ${skipped} already existed` : ''}.`,
          );
        }
      } catch (error) {
        console.error('Failed to import themes:', error);
        toast.error('Import failed', 'That file could not be read. Make sure it was exported from X&O Battle.');
      }
    };
    reader.onerror = () => toast.error('Import failed', 'The file could not be opened. Please try again.');
    reader.readAsText(file);
  };

  const deletePresets = () => {
    if (customThemes.some((theme) => theme.id === gameSettings.theme.id)) {
      updateSettings({ theme: defaultThemes[0] });
    }
    writeCustomThemes([]);
    toast.success('Presets deleted', 'All custom presets have been removed.');
  };

  const resetSettings = () => {
    updateSettings(structuredClone(defaultSettings));
    resetPreferences();
    setTheme('system');
    toast.success('Settings reset', 'Everything is back to default. Your awards and presets were kept.');
  };

  return (
    <SettingsPage title="Data" description="Back up your presets or start fresh.">
      <SettingsGroup
        title="Export & Import"
        footer={presetCount > 0 ? `${plural(presetCount, 'preset')} saved on this device.` : 'No presets saved on this device yet.'}
      >
        <SettingsActionRow
          settingId="export-themes"
          icon={<FileDown />}
          iconColor="#34c759"
          label="Export Themes"
          disabled={presetCount === 0}
          onClick={() => {
            setConfirmCount(presetCount);
            setConfirmExport(true);
          }}
        />
        <SettingsActionRow
          settingId="import-themes"
          icon={<FileUp />}
          iconColor="#007aff"
          label="Import Themes"
          onClick={() => fileInputRef.current?.click()}
        />
      </SettingsGroup>

      <SettingsGroup title="Reset Options" footer="Resetting settings keeps your awards and custom presets.">
        <SettingsActionRow
          settingId="reset-settings"
          icon={<RotateCcw />}
          iconColor="#ff3b30"
          label="Reset All Settings"
          tone="destructive"
          onClick={() => setConfirmResetSettings(true)}
        />
        <SettingsActionRow
          settingId="delete-presets"
          icon={<Trash2 />}
          iconColor="#ff3b30"
          label="Delete Presets"
          tone="destructive"
          disabled={presetCount === 0}
          onClick={() => {
            setConfirmCount(presetCount);
            setConfirmDeletePresets(true);
          }}
        />
      </SettingsGroup>

      <input ref={fileInputRef} type="file" accept=".json,application/json" onChange={handleImport} hidden />

      <ConfirmDialog
        open={confirmExport}
        onOpenChange={setConfirmExport}
        title="Export Themes"
        description={
          <>
            Your {plural(confirmCount, 'custom preset')} will be saved as{' '}
            <strong className="font-medium text-foreground">XOBattle-Themes.json</strong>. Use Import Themes to bring
            them back on any device.
          </>
        }
        confirmText="Export"
        onConfirm={handleExport}
      />

      <ConfirmDialog
        open={confirmDeletePresets}
        onOpenChange={setConfirmDeletePresets}
        title="Delete Presets"
        description={`Your ${plural(confirmCount, 'custom preset')} will be deleted. This can’t be undone, so consider exporting them first.`}
        confirmText="Delete Presets"
        variant="destructive"
        onConfirm={deletePresets}
      />

      <ConfirmDialog
        open={confirmResetSettings}
        onOpenChange={setConfirmResetSettings}
        title="Reset All Settings"
        description="Appearance, gameplay, effects and accessibility settings go back to their defaults. Awards and presets are kept."
        confirmText="Reset All Settings"
        variant="destructive"
        onConfirm={resetSettings}
      />
    </SettingsPage>
  );
}
