import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/utils';

interface BurgerMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const lineVariants: Variants = {
  closed: { rotate: 0, y: 0 },
  open: (i: number) => {
    if (i === 1) return { rotate: 45, y: 0 };
    if (i === 3) return { rotate: -45, y: 0 };
    if (i === 2) return { opacity: 0, scaleX: 0 };
    return {};
  },
};

export const BurgerMenuButton = ({ isOpen, onToggle }: BurgerMenuButtonProps) => {
  const prefersReduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className={cn(
        'md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-md gap-1.5',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'transition-colors hover:bg-surface-alt',
      )}
    >
      {[1, 2, 3].map((i) => (
        <motion.span
          key={i}
          custom={i}
          variants={prefersReduced ? undefined : lineVariants}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={cn(
            'block h-0.5 w-5 rounded-full bg-text-primary',
            isOpen && 'origin-center',
          )}
        />
      ))}
    </button>
  );
};
