/**
 * Common validation functions for the application.
 *
 * All validators:
 * - Trim input before testing.
 * - Return `undefined` when valid.
 * - Return a human-readable error string when invalid.
 */

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const NAME_MIN = 2;
const NAME_MAX = 100;
/** Allows letters (Latin + Cyrillic), spaces, and hyphens. */
const NAME_REGEX = /^[A-Za-zА-Яа-я\s-]+$/u;

const EMAIL_MAX = 254;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MESSAGE_MIN = 10;
const MESSAGE_MAX = 5000;

/* ------------------------------------------------------------------ */
/*  Validators                                                         */
/* ------------------------------------------------------------------ */

/**
 * Validate a person's name.
 * - Required
 * - 2–100 characters
 * - Only letters, spaces, and hyphens
 */
export function validateName(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Name is required';
  if (trimmed.length < NAME_MIN) return `Name must be at least ${NAME_MIN} characters`;
  if (trimmed.length > NAME_MAX) return `Name must be at most ${NAME_MAX} characters`;
  if (!NAME_REGEX.test(trimmed))
    return 'Name may only contain letters, spaces, and hyphens';
  return undefined;
}

/**
 * Validate an email address.
 * - Required
 * - Max 254 characters (RFC 5321)
 * - Basic pattern check
 */
export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Email is required';
  if (trimmed.length > EMAIL_MAX)
    return `Email must be at most ${EMAIL_MAX} characters`;
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address';
  return undefined;
}

/**
 * Validate a free-text message.
 * - Required
 * - 10–5000 characters
 */
export function validateMessage(value: string): string | undefined {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'Message is required';
  if (trimmed.length < MESSAGE_MIN)
    return `Message must be at least ${MESSAGE_MIN} characters`;
  if (trimmed.length > MESSAGE_MAX)
    return `Message must be at most ${MESSAGE_MAX} characters`;
  return undefined;
}
