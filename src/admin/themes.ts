export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  bg: string;
  bgAlt: string;
  surface: string;
  surfaceAlt: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
}

export interface ThemePreset {
  id: string;
  nameRu: string;
  nameUk: string;
  nameEn: string;
  colors: ThemeColors;
}

export const THEMES: ThemePreset[] = [
  {
    id: 'default',
    nameRu: 'Синяя (по умолчанию)',
    nameUk: 'Синя (за замовчуванням)',
    nameEn: 'Blue (Default)',
    colors: {
      primary: '#3b82f6',
      primaryDark: '#2563eb',
      primaryLight: '#60a5fa',
      accent: '#8b5cf6',
      accentDark: '#7c3aed',
      accentLight: '#a78bfa',
      bg: '#f8fafc',
      bgAlt: '#f1f5f9',
      surface: '#ffffff',
      surfaceAlt: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#64748b',
      textInverse: '#f8fafc',
      border: '#e2e8f0',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    },
  },
  {
    id: 'emerald',
    nameRu: 'Изумрудная',
    nameUk: 'Смарагдова',
    nameEn: 'Emerald',
    colors: {
      primary: '#10b981',
      primaryDark: '#059669',
      primaryLight: '#34d399',
      accent: '#14b8a6',
      accentDark: '#0d9488',
      accentLight: '#5eead4',
      bg: '#f0fdf4',
      bgAlt: '#ecfdf5',
      surface: '#ffffff',
      surfaceAlt: '#ecfdf5',
      textPrimary: '#022c22',
      textSecondary: '#4b5563',
      textInverse: '#f0fdf4',
      border: '#d1fae5',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#06b6d4',
    },
  },
  {
    id: 'sunset',
    nameRu: 'Закат',
    nameUk: 'Захід сонця',
    nameEn: 'Sunset',
    colors: {
      primary: '#f97316',
      primaryDark: '#ea580c',
      primaryLight: '#fb923c',
      accent: '#e11d48',
      accentDark: '#be123c',
      accentLight: '#fb7185',
      bg: '#fffbeb',
      bgAlt: '#fef3c7',
      surface: '#ffffff',
      surfaceAlt: '#fef3c7',
      textPrimary: '#1c1917',
      textSecondary: '#78716c',
      textInverse: '#fffbeb',
      border: '#fed7aa',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#f97316',
    },
  },
  {
    id: 'midnight',
    nameRu: 'Полночь',
    nameUk: 'Опівніч',
    nameEn: 'Midnight',
    colors: {
      primary: '#6366f1',
      primaryDark: '#4f46e5',
      primaryLight: '#818cf8',
      accent: '#a855f7',
      accentDark: '#9333ea',
      accentLight: '#c084fc',
      bg: '#0f172a',
      bgAlt: '#1e293b',
      surface: '#1e293b',
      surfaceAlt: '#334155',
      textPrimary: '#f1f5f9',
      textSecondary: '#94a3b8',
      textInverse: '#0f172a',
      border: '#334155',
      success: '#34d399',
      error: '#f87171',
      warning: '#fbbf24',
      info: '#818cf8',
    },
  },
  {
    id: 'rose',
    nameRu: 'Розовая',
    nameUk: 'Рожева',
    nameEn: 'Rose',
    colors: {
      primary: '#e11d48',
      primaryDark: '#be123c',
      primaryLight: '#fb7185',
      accent: '#a855f7',
      accentDark: '#9333ea',
      accentLight: '#c084fc',
      bg: '#fff1f2',
      bgAlt: '#ffe4e6',
      surface: '#ffffff',
      surfaceAlt: '#ffe4e6',
      textPrimary: '#1c1917',
      textSecondary: '#6b7280',
      textInverse: '#fff1f2',
      border: '#fecdd3',
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#e11d48',
    },
  },
];

const CSS_VAR_MAP: Record<keyof ThemeColors, string> = {
  primary: '--color-primary',
  primaryDark: '--color-primary-dark',
  primaryLight: '--color-primary-light',
  accent: '--color-accent',
  accentDark: '--color-accent-dark',
  accentLight: '--color-accent-light',
  bg: '--color-bg',
  bgAlt: '--color-bg-alt',
  surface: '--color-surface',
  surfaceAlt: '--color-surface-alt',
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textInverse: '--color-text-inverse',
  border: '--color-border',
  success: '--color-success',
  error: '--color-error',
  warning: '--color-warning',
  info: '--color-info',
};

export function applyTheme(themeId: string) {
  const theme = THEMES.find((t) => t.id === themeId);
  if (!theme) return;

  const root = document.documentElement;
  for (const [key, cssVar] of Object.entries(CSS_VAR_MAP)) {
    root.style.setProperty(cssVar, theme.colors[key as keyof ThemeColors]);
  }

  const r = parseInt(theme.colors.primary.slice(1, 3), 16);
  const g = parseInt(theme.colors.primary.slice(3, 5), 16);
  const b = parseInt(theme.colors.primary.slice(5, 7), 16);
  root.style.setProperty('--shadow-focus', `0 0 0 3px rgba(${r}, ${g}, ${b}, 0.35)`);
}

export function resetTheme() {
  const root = document.documentElement;
  for (const cssVar of Object.values(CSS_VAR_MAP)) {
    root.style.removeProperty(cssVar);
  }
  root.style.removeProperty('--shadow-focus');
}
