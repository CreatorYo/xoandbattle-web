import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SettingsNavBarProps extends ComponentProps<'div'> {
  leading?: ReactNode;
  trailing?: ReactNode;
}

export function SettingsNavBar({ leading, trailing, className, children, ...props }: SettingsNavBarProps) {
  return (
    <div
      className={cn('absolute inset-x-0 top-0 z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3', className)}
      {...props}
    >
      <div className="flex justify-self-start">{leading}</div>
      {children}
      <div className="flex justify-self-end">{trailing}</div>
    </div>
  );
}
