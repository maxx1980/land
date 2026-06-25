import { useCallback } from 'react';
import { validateName, validateEmail, validateMessage } from '@/utils/validation';

/**
 * Field-level validation rules for the contact form.
 * Each validator returns `undefined` on success or an error string.
 */
export interface ValidationRules {
  name: (value: string) => string | undefined;
  email: (value: string) => string | undefined;
  message: (value: string) => string | undefined;
}

/**
 * Result returned by {@link useFormValidation}.
 */
export interface UseFormValidationResult {
  /** All validation rules keyed by field name. */
  rules: ValidationRules;
}

/**
 * Hook that provides memoised validation rules for the contact form.
 *
 * Uses the pure functions from `@/utils/validation` under the hood,
 * wrapped in `useCallback` so they are referentially stable across renders.
 *
 * @example
 * ```tsx
 * const { rules } = useFormValidation();
 * const nameError = rules.name(fields.name);
 * ```
 */
export function useFormValidation(): UseFormValidationResult {
  const nameRule = useCallback((value: string) => validateName(value), []);
  const emailRule = useCallback((value: string) => validateEmail(value), []);
  const messageRule = useCallback((value: string) => validateMessage(value), []);

  return {
    rules: {
      name: nameRule,
      email: emailRule,
      message: messageRule,
    },
  };
}
