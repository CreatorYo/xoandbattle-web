import { useState, type ReactNode } from 'react';
import { CircleHelp, Download, Play } from 'lucide-react';
import { SettingsActionRow, SettingsGroup, SettingsPage } from '@/components/ui/settings';
import { HowToPlayDialog } from '@/components/HowToPlayDialog';
import { useIsPWA } from '@/hooks/use-pwa';
import { APP_NAME, APP_VERSION } from '@/lib/app-info';
import { replayOnboarding } from '@/lib/onboarding';
import { APP_STORE, MODIFIER_KEY } from '@/lib/utils';

const SHORTCUTS: { label: string; keys: ReactNode[] }[] = [
  { label: 'New Round', keys: ['R'] },
  { label: 'Change Game Mode', keys: ['S'] },
  { label: 'Open Settings', keys: [MODIFIER_KEY, ','] },
  { label: 'Cycle Colour Mode', keys: ['Alt', 'Shift', 'T'] },
  { label: 'Move Around the Board', keys: ['←', '↑', '↓', '→'] },
  { label: 'Place a Mark', keys: ['Enter'] },
  { label: 'Reorder Presets in Themes', keys: ['R'] },
  { label: 'Search Settings', keys: ['/'] },
];

interface AboutSectionProps {
  onCloseSettings: () => void;
}

export function AboutSection({ onCloseSettings }: AboutSectionProps) {
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const isPWA = useIsPWA();

  return (
    <SettingsPage title="About" description="Help, shortcuts and version information.">
      <div
        data-setting-id="version"
        className="flex flex-col items-center gap-2 rounded-[1.25rem] bg-surface px-4 py-6 text-center"
      >
        <img
          src="/assets/XO_Battle_Logo_Transparent.png"
          alt=""
          width={64}
          height={64}
          decoding="async"
          draggable={false}
          className="size-16"
        />
        <div>
          <p className="text-[17px] font-semibold">{APP_NAME}</p>
          <p className="text-[13px] text-muted-foreground">Version {APP_VERSION}</p>
        </div>
      </div>

      <SettingsGroup title="Information">
        <SettingsActionRow
          settingId="onboarding-tour"
          icon={<Play />}
          iconColor="#007aff"
          label="Onboarding Tour"
          onClick={() => {
            onCloseSettings();
            replayOnboarding();
          }}
        />
        <SettingsActionRow
          settingId="how-to-play"
          icon={<CircleHelp />}
          iconColor="#ff9500"
          label="How to Play"
          onClick={() => setHowToPlayOpen(true)}
        />
        {!isPWA && (
          <SettingsActionRow
            settingId="get-app"
            icon={<Download />}
            iconColor="#5856d6"
            label="Get the App"
            description={`Custom board styles and more on the ${APP_STORE.name}.`}
            href={APP_STORE.url}
          />
        )}
      </SettingsGroup>

      <SettingsGroup settingId="keyboard-shortcuts" title="Keyboard Shortcuts" className="max-md:hidden">
        {SHORTCUTS.map((shortcut) => (
          <div key={shortcut.label} className="flex min-h-12 items-center justify-between gap-4 px-4 py-2">
            <span className="text-base">{shortcut.label}</span>
            <span className="flex items-center gap-1">
              {shortcut.keys.map((key, index) => (
                <kbd key={index} className="kbd">
                  {key}
                </kbd>
              ))}
            </span>
          </div>
        ))}
      </SettingsGroup>

      <HowToPlayDialog open={howToPlayOpen} onOpenChange={setHowToPlayOpen} />
    </SettingsPage>
  );
}
