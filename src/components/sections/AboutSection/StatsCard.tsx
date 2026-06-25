import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/utils';

interface StatsCardProps {
  /** Numeric value to display */
  value: number;
  /** Label text below the value */
  label: string;
  /** Optional suffix after the number (e.g., "+", "%") */
  suffix?: string;
  /** Whether to animate the number on mount */
  animated?: boolean;
}

/**
 * Displays a single statistic with an optional count-up animation.
 * Respects prefers-reduced-motion by showing the final value immediately.
 */
export const StatsCard = ({
  value,
  label,
  suffix = '',
  animated = true,
}: StatsCardProps) => {
  const { count, start } = useCountUp({
    end: value,
    duration: 2000,
    startOnMount: false,
  });

  return (
    <motion.div
      ref={(node) => {
        if (animated && node) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                start();
                observer.unobserve(entry.target);
                observer.disconnect();
              }
            },
            { threshold: 0.3 },
          );
          observer.observe(node);
        }
      }}
      className={cn(
        'flex flex-col items-center justify-center p-6 md:p-8',
        'rounded-lg bg-surface border border-border',
        'shadow-sm',
      )}
      role="status"
      aria-label={`${label}: ${animated ? count : value}${suffix}`}
    >
      <span
        className="text-3xl md:text-4xl font-extrabold text-primary tabular-nums"
        aria-valuenow={animated ? count : value}
      >
        {animated ? count : value}
        {suffix}
      </span>
      <span className="mt-2 text-sm md:text-base text-text-secondary text-center">
        {label}
      </span>
    </motion.div>
  );
};
