import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FormFields {
  name: string;
  email: string;
  message: string;
}

export type FormFieldName = keyof FormFields;

export interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export interface TouchedFields {
  name: boolean;
  email: boolean;
  message: boolean;
}

export interface FormState {
  /* ----- Data ----- */
  fields: FormFields;
  errors: FormErrors;
  touched: TouchedFields;

  /* ----- Status ----- */
  /** `true` while the submission request is in-flight. */
  isSubmitting: boolean;
  /** Server-side error message (null when there is no error). */
  submitError: string | null;
  /** `true` after a successful submission. */
  isSuccess: boolean;
  /** How many times the form has been submitted (including failures). */
  submitCount: number;
}

export interface FormActions {
  /** Update a single field value. */
  setField: (field: FormFieldName, value: string) => void;
  /** Mark a field as having been focused/blurred by the user. */
  setTouched: (field: FormFieldName) => void;
  /** Validate a single field and return the error message (or `undefined`). */
  validateField: (field: FormFieldName) => string | undefined;
  /** Validate all fields. Returns `true` when the form is valid. */
  validateAll: () => boolean;
  /** Submit the form to the API. Guards against double-submission. */
  submitForm: () => Promise<void>;
  /** Reset the form to its initial, empty state. */
  resetForm: () => void;
  /** Clear the submitError banner. */
  dismissError: () => void;
}

/* ------------------------------------------------------------------ */
/*  Validation helpers (inline for zero extra deps)                   */
/* ------------------------------------------------------------------ */

const NAME_REGEX = /^[A-Za-zА-Яа-я\s-]+$/u;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX_LENGTH = 254;

function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Name is required';
  if (trimmed.length < 2) return 'Name must be at least 2 characters';
  if (trimmed.length > 100) return 'Name must be at most 100 characters';
  if (!NAME_REGEX.test(trimmed)) return 'Name may only contain letters, spaces, and hyphens';
  return undefined;
}

function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Email is required';
  if (trimmed.length > EMAIL_MAX_LENGTH) return 'Email must be at most 254 characters';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address';
  return undefined;
}

function validateMessage(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Message is required';
  if (trimmed.length < 10) return 'Message must be at least 10 characters';
  if (trimmed.length > 5000) return 'Message must be at most 5000 characters';
  return undefined;
}

const validators: Record<FormFieldName, (value: string) => string | undefined> = {
  name: validateName,
  email: validateEmail,
  message: validateMessage,
};

/* ------------------------------------------------------------------ */
/*  Initial state                                                      */
/* ------------------------------------------------------------------ */

const initialFields: FormFields = { name: '', email: '', message: '' };
const initialTouched: TouchedFields = { name: false, email: false, message: false };

const initialState: FormState = {
  fields: { ...initialFields },
  errors: {},
  touched: { ...initialTouched },
  isSubmitting: false,
  submitError: null,
  isSuccess: false,
  submitCount: 0,
};

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

/**
 * Zustand store managing the contact-form lifecycle:
 * field values, validation, submission, and reset.
 *
 * @example
 * ```tsx
 * const { fields, setField, submitForm, errors } = useFormStore();
 * ```
 */
export const useFormStore = create<FormState & FormActions>((set, get) => ({
  ...initialState,

  /* ---- Field setters ---- */

  setField: (field, value) => {
    const updatedFields = { ...get().fields, [field]: value };

    set((state) => ({
      fields: updatedFields,
      // Re-validate the field if it was already touched
      ...(state.touched[field]
        ? { errors: { ...state.errors, [field]: validators[field](value) } }
        : {}),
      // Clear server error when the user starts editing
      ...(state.submitError ? { submitError: null } : {}),
    }));
  },

  setTouched: (field) => {
    set((state) => {
      if (state.touched[field]) return state; // already touched
      return {
        touched: { ...state.touched, [field]: true },
        // Validate on first blur as well
        errors: {
          ...state.errors,
          [field]: validators[field](state.fields[field]),
        },
      };
    });
  },

  /* ---- Validation ---- */

  validateField: (field) => {
    return validators[field](get().fields[field]);
  },

  validateAll: () => {
    const { fields } = get();
    const errors: FormErrors = {};

    for (const key of Object.keys(fields) as FormFieldName[]) {
      const err = validators[key](fields[key]);
      if (err) errors[key] = err;
    }

    set({
      errors,
      touched: { name: true, email: true, message: true },
    });

    return Object.keys(errors).length === 0;
  },

  /* ---- Submission ---- */

  submitForm: async () => {
    const state = get();

    // Guard against double-submit
    if (state.isSubmitting) return;

    // Validate first
    const allTouched: TouchedFields = { name: true, email: true, message: true };
    let errors: FormErrors = {};

    for (const key of Object.keys(state.fields) as FormFieldName[]) {
      const err = validators[key](state.fields[key]);
      if (err) errors[key] = err;
    }

    if (Object.keys(errors).length > 0) {
      set({ errors, touched: allTouched, submitError: null });
      return;
    }

    set({ isSubmitting: true, errors: {}, touched: allTouched, submitError: null });

    try {
      // Dynamic import to avoid circular dependency issues
      const { sendContactForm } = await import('@/services/contactService');
      const response = await sendContactForm(state.fields);

      if (response.success) {
        set({
          isSuccess: true,
          isSubmitting: false,
          submitCount: get().submitCount + 1,
        });

        // Auto-clear the form after 3 seconds
        setTimeout(() => {
          set({
            fields: { ...initialFields },
            touched: { ...initialTouched },
            isSuccess: false,
          });
        }, 3000);
      } else {
        set({
          isSubmitting: false,
          submitError: response.message ?? 'Server error — please try again later',
          submitCount: get().submitCount + 1,
        });
      }
    } catch {
      set({
        isSubmitting: false,
        submitError: 'Network error — please check your connection',
        submitCount: get().submitCount + 1,
      });
    }
  },

  /* ---- Reset ---- */

  resetForm: () => {
    set({ ...initialState });
  },

  dismissError: () => {
    set({ submitError: null });
  },
}));
