import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface CarouselArrowProps {
  direction: 'prev' | 'next';
  onClick: () => void;
  disabled?: boolean;
}

/**
 * Left / right arrow buttons for the testimonials carousel.
 */
export function CarouselArrow({
  direction,
  onClick,
  disabled = false,
}: CarouselArrowProps) {
  const isPrev = direction === 'prev';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isPrev ? 'Previous testimonial' : 'Next testimonial'}
      whileTap={disabled ? undefined : { scale: 0.9 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'relative z-10 inline-flex items-center justify-center w-10 h-10 rounded-full',
        'bg-surface border border-border shadow-sm',
        'transition-colors duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        disabled
          ? 'opacity-30 cursor-not-allowed'
          : 'hover:bg-primary hover:text-text-inverse hover:border-primary cursor-pointer',
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4"
        aria-hidden="true"
      >
        {isPrev ? (
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        ) : (
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        )}
      </svg>
    </motion.button>
  );
}
