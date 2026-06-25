import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils';
import type { ContactFormData } from '@/types';

interface ContactFormProps {
  onSuccess?: () => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

type FormState =
  | 'idle'
  | 'validating'
  | 'submitting'
  | 'validationError'
  | 'serverError'
  | 'success';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 100;
const MIN_MESSAGE_LENGTH = 10;
const MAX_MESSAGE_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.name || values.name.trim().length < MIN_NAME_LENGTH) {
    errors.name = `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`;
  } else if (values.name.trim().length > MAX_NAME_LENGTH) {
    errors.name = `Name must be between ${MIN_NAME_LENGTH} and ${MAX_NAME_LENGTH} characters`;
  }

  if (!values.email || !EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!values.message || values.message.trim().length < MIN_MESSAGE_LENGTH) {
    errors.message = `Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters`;
  } else if (values.message.trim().length > MAX_MESSAGE_LENGTH) {
    errors.message = `Message must be between ${MIN_MESSAGE_LENGTH} and ${MAX_MESSAGE_LENGTH} characters`;
  }

  return errors;
}

/**
 * Contact form with validation on blur and on submit.
 *
 * States:
 * - idle — initial, empty form
 * - validating — running validation
 * - submitting — sending to /api/contact
 * - validationError — field errors shown
 * - serverError — server responded with error
 * - success — message sent, form cleared
 */
export function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);

  const [values, setValues] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formState, setFormState] = useState<FormState>('idle');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      // Clear error on change after user has touched the field
      if (touched[name] && errors[name as keyof FieldErrors]) {
        const updated = { ...values, [name]: value };
        const fieldErrors = validate(updated);
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name as keyof FieldErrors],
        }));
      }

      // Reset form state to idle if user edits after a non-success state
      if (formState !== 'idle' && formState !== 'success') {
        setFormState('idle');
      }
    },
    [touched, errors, values, formState],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const fieldErrors = validate(values);
      if (fieldErrors[name as keyof FieldErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name as keyof FieldErrors],
        }));
      }
    },
    [values],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFormState('validating');

      // Mark all fields as touched
      setTouched({ name: true, email: true, message: true });

      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setFormState('validationError');
        return;
      }

      setErrors({});
      setFormState('submitting');

      try {
        const payload = {
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        };

        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch {
        // No backend available — open mailto as fallback
        const subject = encodeURIComponent(`Contact from ${values.name.trim()}`);
        const body = encodeURIComponent(
          `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`,
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
      }

      setFormState('success');
      setValues({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
      onSuccess?.();
    },
    [values, onSuccess],
  );

  const isSubmitting = formState === 'submitting';

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
    >
      <Input
        name="name"
        label={t('contact.form.name')}
        type="text"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.name ? errors.name ?? null : null}
        required
        disabled={isSubmitting}
        maxLength={MAX_NAME_LENGTH}
        autoComplete="name"
      />

      <Input
        name="email"
        label={t('contact.form.email')}
        type="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email ?? null : null}
        required
        disabled={isSubmitting}
        autoComplete="email"
      />

      <Textarea
        name="message"
        label={t('contact.form.message')}
        value={values.message}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.message ? errors.message ?? null : null}
        required
        disabled={isSubmitting}
        maxLength={MAX_MESSAGE_LENGTH}
        rows={5}
      />

      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={
            isSubmitting ||
            (formState !== 'idle' && formState !== 'validationError' && formState !== 'serverError')
          }
        >
          {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
        </Button>
      </div>

      {/* Status messages */}
      <AnimatePresence>
        {formState === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            className={cn(
              'p-4 rounded-md text-sm font-medium',
              'bg-success/10 border border-success/20 text-success',
            )}
          >
            {t('contact.form.success')}
          </motion.div>
        )}

        {formState === 'serverError' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="alert"
            className={cn(
              'p-4 rounded-md text-sm font-medium',
              'bg-error/10 border border-error/20 text-error',
            )}
          >
            {t('contact.form.error')}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
