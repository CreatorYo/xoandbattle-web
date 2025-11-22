import { toast as showToast } from '@/hooks/use-toast';

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export const toast = {
  show: ({ title, description, variant = 'default', duration = 5800 }: ToastOptions) => {
    const toastProps: any = {
      title,
      description,
      duration: duration || 5800,
    };
    
    if (variant === 'destructive') {
      toastProps.variant = 'destructive';
    } else {
      toastProps.variant = variant;
    }
    
    return showToast(toastProps);
  },

  success: (title: string, description?: string, duration: number = 5800) => {
    return toast.show({ title, description, variant: 'success', duration });
  },

  error: (title: string, description?: string, duration: number = 5800) => {
    return showToast({
      title,
      description,
      variant: 'destructive',
      duration: duration || 5800,
    });
  },

  warning: (title: string, description?: string, duration: number = 5800) => {
    return toast.show({ title, description, variant: 'warning', duration });
  },

  info: (title: string, description?: string, duration: number = 5800) => {
    return toast.show({ title, description, variant: 'info', duration });
  },
};

