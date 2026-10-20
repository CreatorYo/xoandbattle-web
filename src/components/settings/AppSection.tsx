import { RotateCcw } from 'lucide-react';
import { usePreferences } from '@/contexts/PreferencesContext';
import { SettingsGroup, SettingsPage, SettingsRow, SettingsSwitchRow } from '@/components/ui/settings';
import { Button } from '@/components/ui/button';
import { ColorInput } from '@/components/ColorInput';

export function AppSection() {
  const {
    statusBarSynced,
    setStatusBarSynced,
    statusBarColor,
    setStatusBarColor,
    resetStatusBarColor,
    effectiveStatusBarColor,
  } = usePreferences();

  return (
    <SettingsPage title="App" description="Options for the installed version of X&O Battle Web.">
      <SettingsGroup
        title="Status Bar Colour"
        footer="The status bar is the strip at the top of the window on installed apps."
      >
        <SettingsSwitchRow
          settingId="status-bar-sync"
          label="Sync with Accent"
          description="Uses your accent colour for the status bar."
          checked={statusBarSynced}
          onCheckedChange={setStatusBarSynced}
        />
        <SettingsRow
          settingId="status-bar-colour"
          label="Status Bar Colour"
          disabled={statusBarSynced}
          description={
            statusBarSynced
              ? 'Following your accent colour.'
              : statusBarColor
                ? 'Using your chosen colour.'
                : 'Matching light or dark mode.'
          }
          control={
            <>
              {!statusBarSynced && statusBarColor && (
                <Button
                  variant="ghost-muted"
                  size="icon-sm"
                  aria-label="Reset status bar colour"
                  title="Reset"
                  onClick={resetStatusBarColor}
                >
                  <RotateCcw />
                </Button>
              )}
              <ColorInput
                label="Status bar colour"
                value={effectiveStatusBarColor}
                disabled={statusBarSynced}
                showHex={false}
                onChange={setStatusBarColor}
              />
            </>
          }
        />
      </SettingsGroup>
    </SettingsPage>
  );
}
