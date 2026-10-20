import { useState } from 'react';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { DEFAULT_ACCENT, usePreferences } from '@/contexts/PreferencesContext';
import { SettingsActionRow, SettingsGroup, SettingsPage, SettingsRow } from '@/components/ui/settings';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { cn } from '@/lib/utils';
import { CustomBoardStylingDialog } from '@/components/CustomBoardStylingDialog';
import { describeStyling, presetStyling, toCustomStyling } from '@/lib/board-styling';
import { AccentSwatches } from './AccentSwatches';
import { ColourModePicker } from './ColourModePicker';
import { ControlButtonsSettings } from './ControlButtonsSettings';

export function AppearanceSection() {
  const { accentColor, setAccentColor, glassTint, setGlassTint } = usePreferences();
  const { gameSettings, updateSettings } = useGame();
  const reducedMotion = useReducedMotion();
  const [boardDialogOpen, setBoardDialogOpen] = useState(false);

  const boardStyle = gameSettings.boardStyling.style;

  const handleBoardStyleChange = (style: 'standard' | 'rounded' | 'custom') => {
    if (style === 'custom') {
      updateSettings({ boardStyling: toCustomStyling(gameSettings.boardStyling) });
      setBoardDialogOpen(true);
      return;
    }
    updateSettings({ boardStyling: presetStyling(style, gameSettings.boardStyling) });
  };

  return (
    <SettingsPage title="Appearance" description="Choose how X&O Battle looks on this device.">
      <SettingsGroup title="Appearance" settingId="colour-mode">
        <ColourModePicker />
      </SettingsGroup>

      <SettingsGroup
        title="Liquid Glass"
        footer={
          reducedMotion
            ? 'Glass is shown solid while Reduce Motion is on.'
            : 'Clear shows more of what’s behind buttons and panels. Tinted is easier to read.'
        }
      >
        <SettingsRow
          stack
          settingId="liquid-glass"
          label="Glass Effect"
          disabled={reducedMotion}
          control={
            <div className={cn('flex items-center gap-3 text-[13px] text-muted-foreground', reducedMotion && '[&>span]:opacity-50')}>
              <span>Clear</span>
              <Slider
                className="flex-1"
                thumbLabel="Liquid Glass"
                min={0}
                max={100}
                step={1}
                value={[glassTint]}
                disabled={reducedMotion}
                onValueChange={([next]) => setGlassTint(next)}
              />
              <span>Tinted</span>
            </div>
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Accent">
        <SettingsRow
          stack
          settingId="accent-colour"
          label="Accent Colour"
          description="Used for switches, selections and main buttons."
          control={
            <div className="flex flex-wrap items-center gap-2.5">
              <AccentSwatches value={accentColor} onChange={setAccentColor} />
              {accentColor !== DEFAULT_ACCENT && (
                <Button
                  variant="ghost-muted"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setAccentColor(DEFAULT_ACCENT)}
                >
                  <RotateCcw />
                  Reset
                </Button>
              )}
            </div>
          }
        />
      </SettingsGroup>

      <SettingsGroup title="Board Styling">
        <SettingsRow
          stack
          settingId="board-shape"
          label="Board Shape"
          description="How the squares on the board look."
          control={
            <SegmentedControl
              aria-label="Board shape"
              value={boardStyle}
              onValueChange={handleBoardStyleChange}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'rounded', label: 'Rounded' },
                { value: 'custom', label: 'Custom' },
              ]}
            />
          }
        />
        {boardStyle === 'custom' && (
          <SettingsActionRow
            settingId="customise-board"
            icon={<SlidersHorizontal />}
            iconColor="#af52de"
            label="Customise Board"
            description={describeStyling(gameSettings.boardStyling)}
            onClick={() => setBoardDialogOpen(true)}
          />
        )}
      </SettingsGroup>

      <SettingsGroup title="Advanced">
        <ControlButtonsSettings />
      </SettingsGroup>

      <CustomBoardStylingDialog open={boardDialogOpen} onOpenChange={setBoardDialogOpen} />
    </SettingsPage>
  );
}
