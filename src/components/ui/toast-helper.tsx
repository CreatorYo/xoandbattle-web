import { toast as showToast } from '@/hooks/use-toast';

type ToastVariant = 'default' | 'destructive' | 'success' | 'warning' | 'info';

interface ToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

/**
 * Helper function to show toast notifications with consistent styling
 * Supports all toast variants: default, destructive, success, warning, info
 */
export const toast = {
  /**
   * Show a toast notification with custom variant
   */
  show: ({ title, description, variant = 'default', duration = 5800 }: ToastOptions) => {
    // Pass variant through props - Toast component supports all variants
    // The use-toast hook only accepts 'default' | 'destructive' in its type,
    // but we pass the actual variant through props which the toaster will use
    const toastProps: any = {
      title,
      description,
      duration: duration || 5800, // Default to 5.8 seconds
    };
    
    // Always pass the variant, even if it's not in the type
    if (variant === 'destructive') {
      toastProps.variant = 'destructive';
    } else {
      toastProps.variant = variant; // Pass success, warning, info, etc.
    }
    
    return showToast(toastProps);
  },

  /**
   * Show a success toast notification
   */
  success: (title: string, description?: string, duration: number = 5800) => {
    return toast.show({ title, description, variant: 'success', duration });
  },

  /**
   * Show an error/destructive toast notification
   */
  error: (title: string, description?: string, duration: number = 5800) => {
    return showToast({
      title,
      description,
      variant: 'destructive',
      duration: duration || 5800,
    });
  },

  /**
   * Show a warning toast notification
   */
  warning: (title: string, description?: string, duration: number = 5800) => {
    return toast.show({ title, description, variant: 'warning', duration });
  },

  /**
   * Show an info toast notification
   */
  info: (title: string, description?: string, duration: number = 5800) => {
    return toast.show({ title, description, variant: 'info', duration });
  },
};

