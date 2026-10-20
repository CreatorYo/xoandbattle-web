import { Dialog as DialogPrimitive } from 'radix-ui';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkmark } from '@/components/ui/checkmark';
import { cn } from '@/lib/utils';

export function SettingsDoneButton({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close asChild>
      <Button variant="primary" size="icon" aria-label="Done" className={cn('text-brand-pastel', className)}>
        <Checkmark />
      </Button>
    </DialogPrimitive.Close>
  );
}

export function SettingsCloseButton({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Close asChild>
      <Button variant="glass" size="icon" aria-label="Close" className={className}>
        <X className="size-5" strokeWidth={2.5} />
      </Button>
    </DialogPrimitive.Close>
  );
}
