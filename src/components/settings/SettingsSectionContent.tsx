import { memo } from 'react';
import type { PageSectionId } from './sections';
import { AppearanceSection } from './AppearanceSection';
import { GameplaySection } from './GameplaySection';
import { EffectsSection } from './EffectsSection';
import { AwardsSection } from './AwardsSection';
import { AccessibilitySection } from './AccessibilitySection';
import { DataSection } from './DataSection';
import { AboutSection } from './AboutSection';
import { AppSection } from './AppSection';

interface SettingsSectionContentProps {
  section: PageSectionId;
  onCloseSettings: () => void;
}

export const SettingsSectionContent = memo(function SettingsSectionContent({
  section,
  onCloseSettings,
}: SettingsSectionContentProps) {
  switch (section) {
    case 'appearance':
      return <AppearanceSection />;
    case 'gameplay':
      return <GameplaySection />;
    case 'effects':
      return <EffectsSection />;
    case 'awards':
      return <AwardsSection />;
    case 'accessibility':
      return <AccessibilitySection />;
    case 'data':
      return <DataSection />;
    case 'about':
      return <AboutSection onCloseSettings={onCloseSettings} />;
    case 'app':
      return <AppSection />;
  }
});
