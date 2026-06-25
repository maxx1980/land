import { useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

const typeConfig = {
  success: {
    bg: 'bg-success/10 border-success/30',
    text: 'text-success',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-error/10 border-error/30',
    text: 'text-error',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-info/10 border-info/30',
    text: 'text-info',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-warning/10 border-warning/30',
    text: 'text-warning',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
};

export const Toast = ({
  id,
  type,
  message,
  duration = 5000,
  onClose,
}: ToastProps) => {
  const prefersReduced = useReducedMotion();
  const { bg, text, icon } = typeConfig[type];

  const handleClose = useCallback(() => {
    onClose(id);
  }, [id, onClose]);

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(handleClose, duration);
    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  return (
    <motion.div
      role="alert"
      aria-live="polite"
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: prefersReduced ? 0 : 0.3, ease: 'easeOut' }}
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 shadow-lg',
        'bg-surface min-w-[300px] max-w-[420px]',
        bg,
      )}
    >
      <span className={cn('mt-0.5 flex-shrink-0', text)} aria-hidden="true">
        {icon}
      </span>

      <p className="flex-1 text-sm text-text-primary">{message}</p>

      <button
        type="button"
        onClick={handleClose}
        aria-label="Close notification"
        className={cn(
          'flex-shrink-0 rounded-sm p-0.5 opacity-60 transition-opacity hover:opacity-100',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
        )}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
};
