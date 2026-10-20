import { useState } from 'react';
import { LayoutGrid, Smartphone, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { dismissAppPrompt } from '@/lib/app-prompt';
import { APP_STORE } from '@/lib/utils';

const FEATURES = [
  { icon: LayoutGrid, title: 'Custom Board Styles', body: 'More ways to make the board your own.' },
  { icon: Smartphone, title: 'Optimised for Mobile', body: 'Designed for playing on your phone.' },
  { icon: Sparkles, title: 'Enhanced Gameplay', body: 'Extra gameplay features and more.' },
];

export function MobileAppPrompt() {
  const [open, setOpen] = useState(true);

  const dismiss = () => {
    setOpen(false);
    dismissAppPrompt();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) dismiss();
      }}
    >
      <DialogContent size="sm">
        <DialogHeader>
          <img
            src="/assets/XO_Battle_Logo_Transparent.png"
            alt=""
            width={64}
            height={64}
            decoding="async"
            draggable={false}
            className="mb-1 size-16"
          />
          <DialogTitle>Better in the App</DialogTitle>
          <DialogDescription>Get the full X&amp;O Battle experience on the {APP_STORE.name}.</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <ul className="grouped-list bg-surface-sunken!">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-center gap-3 px-4 py-3 [--separator-inset:3.625rem]">
                <span className="flex size-[30px] shrink-0 items-center justify-center rounded-[7px] bg-brand text-brand-foreground">
                  <feature.icon className="size-[18px]" />
                </span>
                <div>
                  <p className="text-[15px] font-medium">{feature.title}</p>
                  <p className="text-[13px] text-muted-foreground">{feature.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={dismiss}>
            Continue on the Web
          </Button>
          <Button variant="primary" asChild>
            <a href={APP_STORE.url} target="_blank" rel="noopener noreferrer">
              Get the App
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
