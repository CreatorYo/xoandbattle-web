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

const RULES = [
  {
    title: 'Take turns',
    body: 'X always goes first. Tap or click an empty square to place your mark.',
  },
  {
    title: 'Make a line',
    body: 'Get three of your marks in a row — across, down or diagonally — to win the round.',
  },
  {
    title: 'Play the AI',
    body: 'Switch to AI Mode and choose a difficulty, from Easy all the way up to Unbeatable.',
  },
  {
    title: 'Draws',
    body: 'If every square is filled and nobody has a line, the round is a draw.',
  },
];

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HowToPlayDialog({ open, onOpenChange }: HowToPlayDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>How to Play</DialogTitle>
          <DialogDescription>Get three in a row before your opponent does.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <ol className="flex flex-col gap-4">
            {RULES.map((rule, index) => (
              <li key={rule.title} className="flex gap-3.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-semibold tabular-nums text-brand-foreground">
                  {index + 1}
                </span>
                <div className="pt-0.5">
                  <p className="text-sm font-medium">{rule.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{rule.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="primary">Got it</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
