import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useGame, type CountedStat } from '@/contexts/GameContext';
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
import { formatDateTime } from '@/lib/utils';

export interface Award {
  type: CountedStat;
  label: string;
  description: string;
}

interface AwardDetailDialogProps {
  award: Award | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestReset: () => void;
}

export function AwardDetailDialog({ award, open, onOpenChange, onRequestReset }: AwardDetailDialogProps) {
  const { persistentStats } = useGame();

  const [shownAward, setShownAward] = useState(award);
  if (award && award !== shownAward) setShownAward(award);
  if (!shownAward) return null;

  const value = persistentStats[shownAward.type] ?? 0;
  const firstAchieved = persistentStats[`${shownAward.type}FirstAchieved` as const];
  const lastUpdated = persistentStats[`${shownAward.type}LastUpdated` as const] ?? firstAchieved;
  const dates = [
    { label: 'First achieved', value: formatDateTime(firstAchieved) },
    { label: 'Last updated', value: formatDateTime(lastUpdated) },
  ].filter((date) => date.value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>{shownAward.label}</DialogTitle>
          <DialogDescription>{shownAward.description}</DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4">
          <div className="flex flex-col items-center rounded-xl bg-surface-sunken py-7">
            <span className="text-5xl font-semibold tabular-nums tracking-tight">{value}</span>
            <span className="mt-1.5 text-[13px] text-muted-foreground">All-time total</span>
          </div>

          {dates.length > 0 && (
            <dl className="grouped-list bg-surface-sunken text-[15px]">
              {dates.map((date) => (
                <div key={date.label} className="flex items-center justify-between gap-4 px-4 py-3">
                  <dt className="text-muted-foreground">{date.label}</dt>
                  <dd className="font-medium tabular-nums">{date.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="destructive-tinted" disabled={value === 0} onClick={onRequestReset}>
            <RotateCcw />
            Reset
          </Button>
          <DialogClose asChild>
            <Button variant="secondary">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
