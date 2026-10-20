import { useState } from 'react';
import { Copy } from 'lucide-react';
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
import { Checkmark } from '@/components/ui/checkmark';
import { MiniBoard } from './MiniBoard';
import { getSymbols } from '@/lib/symbols';

interface ThemeInfoDialogProps {
  theme: GameTheme | null;
  isCustom: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeInfoDialog({ theme, isCustom, open, onOpenChange }: ThemeInfoDialogProps) {
  const [shownTheme, setShownTheme] = useState(theme);
  if (theme && theme !== shownTheme) setShownTheme(theme);

  const [copied, setCopied] = useState<string | null>(null);

  if (!shownTheme) return null;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1600);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const symbols = getSymbols(shownTheme);
  const players = [
    { key: 'x', label: 'Player X', color: shownTheme.xColor, symbol: symbols.x },
    { key: 'o', label: 'Player O', color: shownTheme.oColor, symbol: symbols.o },
  ];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setCopied(null);
        onOpenChange(next);
      }}
    >
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{shownTheme.name}</DialogTitle>
          <DialogDescription>
            {isCustom ? shownTheme.description || 'Custom preset' : 'Built-in theme'}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-5">
          <div className="flex justify-center rounded-xl bg-surface-sunken py-5">
            <MiniBoard
              size="md"
              xColor={shownTheme.xColor}
              oColor={shownTheme.oColor}
              xSymbol={shownTheme.xSymbol}
              oSymbol={shownTheme.oSymbol}
              boxFill={shownTheme.enableBoxFill}
            />
          </div>

          <dl className="grouped-list bg-surface-sunken">
            {players.map((player) => (
              <div key={player.key} className="flex items-center gap-3 px-4 py-2.5">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg text-lg font-bold elev-raised"
                  style={{ color: player.color }}
                >
                  {player.symbol}
                </span>
                <div className="min-w-0 flex-1">
                  <dt className="text-sm font-medium">{player.label}</dt>
                  <dd className="font-mono text-xs uppercase text-muted-foreground">{player.color}</dd>
                </div>
                <Button
                  variant="ghost-muted"
                  size="sm"
                  onClick={() => copy(player.key, player.color)}
                  aria-label={`Copy ${player.label} colour`}
                >
                  {copied === player.key ? <Checkmark className="size-4 text-success" /> : <Copy />}
                  {copied === player.key ? 'Copied' : 'Copy'}
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between px-4 py-3">
              <dt className="text-sm font-medium">Fill squares</dt>
              <dd className="text-[13px] text-muted-foreground">{shownTheme.enableBoxFill ? 'On' : 'Off'}</dd>
            </div>
          </dl>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
