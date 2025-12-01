import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogContainer } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  variant?: 'default' | 'destructive';
  maxWidth?: string;
  buttonClassName?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  variant = 'default',
  maxWidth = '420px',
  buttonClassName,
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 bg-transparent border-0 shadow-none" style={{ maxWidth: `${maxWidth}` }}>
        <DialogContainer>
          <div className="p-5 pb-0">
            <DialogHeader className="mb-5">
              <DialogTitle className="text-center text-lg font-semibold">
                {title}
              </DialogTitle>
            </DialogHeader>
            
            <p className="text-center text-[14px] text-muted-foreground mb-5">
                {description}
              </p>
            
            <div className="pb-0">
              <Button
                variant={variant === 'destructive' ? 'destructive' : 'default'}
                onClick={handleConfirm}
                className={buttonClassName || "w-full py-3.5 rounded-xl font-semibold text-[15px] hover:shadow-none hover:border-0 !transition-[background-color]"}
              >
                {confirmText}
              </Button>
            </div>
          </div>
          
          <div className="p-5 pt-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full py-2.5 rounded-xl bg-transparent border-0 font-medium text-[14px] text-foreground hover:bg-gray-200 dark:hover:bg-muted/40 hover:text-foreground hover:shadow-none active:bg-gray-300 dark:active:bg-muted/60 active:text-foreground focus-visible:outline-none focus-visible:ring-0 !transition-[background-color]"
            >
              {cancelText}
            </Button>
          </div>
        </DialogContainer>
      </DialogContent>
    </Dialog>
  );
}

