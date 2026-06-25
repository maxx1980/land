import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminLocale } from '@/admin/i18n';

function hash(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}

const DEFAULT_PASSWORD = 'admin';

interface AdminAuthState {
  isAuthenticated: boolean;
  passwordHash: string;
  adminLocale: AdminLocale;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (oldPw: string, newPw: string) => boolean;
  setAdminLocale: (locale: AdminLocale) => void;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      passwordHash: hash(DEFAULT_PASSWORD),
      adminLocale: 'ru',

      login: (password) => {
        if (hash(password) === get().passwordHash) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      changePassword: (oldPw, newPw) => {
        if (hash(oldPw) !== get().passwordHash) return false;
        set({ passwordHash: hash(newPw) });
        return true;
      },

      setAdminLocale: (locale) => set({ adminLocale: locale }),
    }),
    { name: 'admin-auth' },
  ),
);
