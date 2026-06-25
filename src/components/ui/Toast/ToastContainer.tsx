import { AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/stores/uiStore';
import { Toast } from './Toast';

const MAX_VISIBLE = 5;

export const ToastContainer = () => {
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  const visibleToasts = toasts.slice(-MAX_VISIBLE);

  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[var(--z-toast)] flex flex-col-reverse gap-2 pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {visibleToasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
            />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
};
