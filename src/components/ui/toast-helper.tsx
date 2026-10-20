import { toast as sonner } from 'sonner';

const CONFIRMATION_DURATION = 3500;
const ERROR_DURATION = 5000;

export const toast = {
  success: (title: string, description?: string) =>
    sonner.success(title, { description, duration: CONFIRMATION_DURATION }),

  info: (title: string, description?: string) => sonner.info(title, { description, duration: CONFIRMATION_DURATION }),

  error: (title: string, description?: string) => sonner.error(title, { description, duration: ERROR_DURATION }),
};
