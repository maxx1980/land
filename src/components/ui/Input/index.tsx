import { useId } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils';

interface InputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
}

const borderVariants = {
  normal: { borderColor: 'var(--color-border)' },
  error: { borderColor: 'var(--color-error)' },
  focused: { borderColor: 'var(--color-primary)' },
};

export const Input = ({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error = null,
  required = false,
  disabled = false,
  maxLength,
  autoComplete,
}: InputProps) => {
  const autoId = useId();
  const id = `${name}-${autoId}`;
  const errorId = `${id}-error`;
  const prefersReduced = useReducedMotion();

  const borderState = error ? 'error' : 'normal';

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className={cn(
          'text-sm font-medium',
          disabled ? 'text-text-secondary/50' : 'text-text-secondary',
        )}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-error">
            *
          </span>
        )}
      </label>

      <motion.input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        variants={prefersReduced ? undefined : borderVariants}
        initial="normal"
        animate={borderState}
        whileFocus="focused"
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={cn(
          'w-full rounded-md border bg-surface px-3 py-2 text-sm text-text-primary',
          'transition-colors duration-200 placeholder:text-text-secondary/50',
          'focus:outline-none focus:ring-2 focus:ring-primary/30',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'ring-2 ring-error/30',
        )}
      />

      {error && (
        <span
          id={errorId}
          role="alert"
          className="text-xs text-error animate-fade-in"
        >
          {error}
        </span>
      )}
    </div>
  );
};
