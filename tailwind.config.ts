import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        accent: {
          DEFAULT: '#F59E0B',
        },
        dark: {
          DEFAULT: '#111827',
          secondary: '#1F2937',
        },
        light: {
          DEFAULT: '#F9FAFB',
          secondary: '#F3F4F6',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
