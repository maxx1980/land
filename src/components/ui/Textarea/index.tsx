import { useId, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/utils';

interface TextareaProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  error?: string | null;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  placeholder?: string;
}

const borderVariants = {
  normal: { borderColor: 'var(--color-border)' },
  error: { borderColor: 'var(--color-error)' },
  focused: { borderColor: 'var(--color-primary)' },
};

export const Textarea = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error = null,
  required = false,
  disabled = false,
  rows = 4,
  maxLength = 5000,
  placeholder,
}: TextareaProps) => {
  const autoId = useId();
  const id = `${name}-${autoId}`;
  const errorId = `${id}-error`;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prefersReduced = useReducedMotion();

  // Auto-resize effect
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // Reset height so scrollHeight is accurate
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const borderState = error ? 'error' : 'normal';

  const charCount = value.length;
  const isNearLimit = maxLength ? charCount > maxLength * 0.8 : false;
  const isAtLimit = maxLength ? charCount >= maxLength : false;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
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

        {isNearLimit && maxLength && (
          <span
            className={cn(
              'text-xs',
              isAtLimit ? 'text-error font-medium' : 'text-text-secondary',
            )}
            aria-live="polite"
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <motion.textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={rows}
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
          'transition-colors duration-200 resize-none placeholder:text-text-secondary/50',
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
