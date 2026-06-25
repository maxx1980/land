import type { MouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-primary text-text-inverse hover:bg-primary-dark focus-visible:ring-primary',
  secondary:
    'bg-accent text-text-inverse hover:bg-accent-dark focus-visible:ring-accent',
  outline:
    'border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-text-inverse focus-visible:ring-primary',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-alt focus-visible:ring-primary',
  danger:
    'bg-error text-text-inverse hover:opacity-90 focus-visible:ring-error',
};

const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-5 py-2.5 text-base gap-2',
  lg: 'px-7 py-3.5 text-lg gap-2.5',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
  onClick,
  ariaLabel,
  className,
}: ButtonProps) {
  const isInteractive = !disabled && !loading;

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-busy={loading}
      aria-disabled={disabled || loading}
      whileTap={isInteractive ? { scale: 0.97 } : undefined}
      whileHover={isInteractive ? { scale: 1.02 } : undefined}
      className={cn(
        'relative inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className,
      )}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size={size === 'lg' ? 'md' : 'sm'} />
        </span>
      )}
      <span className={cn(loading && 'invisible')}>{children}</span>
    </motion.button>
  );
}
