/**
 * Display formatters used across the application.
 */

/**
 * Format a raw phone number (e.g. `+15551234567`) into a human-readable
 * US-style format: `+1 (555) 123-4567`.
 */
export function formatPhone(raw: string): string {
  // Strip everything except digits and a leading +
  const digits = raw.replace(/[^\d+]/g, '');

  // US/Canada: +1 NXX NXX XXXX
  const usMatch = digits.match(/^\+?1?(\d{3})(\d{3})(\d{4})$/);
  if (usMatch) {
    return `+1 (${usMatch[1]}) ${usMatch[2]}-${usMatch[3]}`;
  }

  // International fallback: group digits in blocks of 3
  const clean = digits.replace(/^\+/, '');
  const parts: string[] = [];
  for (let i = 0; i < clean.length; i += 3) {
    parts.push(clean.slice(i, i + 3));
  }
  return `+${parts.join(' ')}`;
}

/**
 * Format a `Date` into a locale-friendly string.
 *
 * Defaults to `en-US` with `long` month and numeric day/year,
 * e.g. `"January 15, 2024"`.
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(locale, options);
}

/**
 * Short relative formatter, e.g. `"Jan 15, 2024"`.
 */
export function formatDateShort(
  date: Date | string | number,
  locale: string = 'en-US',
): string {
  return formatDate(date, locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
