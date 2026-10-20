import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { revealSetting } from './reveal-setting';
import { SettingsDoneButton } from './SettingsDoneButton';
import { SettingsNavBar } from './SettingsNavBar';
import { ThemesSection } from './ThemesSection';
import type { SearchableSetting } from './search-index';

interface ThemesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  revealRequest: { setting: SearchableSetting; nonce: number } | null;
}

export function ThemesSheet({ open, onOpenChange, revealRequest }: ThemesSheetProps) {
  const [titleSlot, setTitleSlot] = useState<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!revealRequest || !viewport) return;
    return revealSetting(viewport, [revealRequest.setting.id, revealRequest.setting.fallbackId], false);
  }, [revealRequest, viewport]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent presentation="page" size="lg" aria-describedby={undefined}>
        <DialogTitle className="sr-only">Themes</DialogTitle>

        <SettingsNavBar
          data-sheet-handle
          className="pt-4 max-sm:touch-none max-sm:select-none sm:px-5 sm:pt-5"
          trailing={<SettingsDoneButton />}
        >
          <div ref={setTitleSlot} className="flex min-w-0 justify-center" />
        </SettingsNavBar>

        <ScrollArea
          ref={setViewport}
          rootClassName="[--edge-top-size:4.75rem] sm:[--edge-top-size:5rem]"
          className="overscroll-contain"
        >
          <div className="mx-auto flex min-h-full w-full flex-col px-4 pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-[4.75rem] sm:px-6 sm:pt-[5rem]">
            <ThemesSection titleSlot={titleSlot} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
