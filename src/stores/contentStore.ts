import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '@/i18n';
import { applyTheme } from '@/admin/themes';
import type { Project, Service, TeamMember, Testimonial } from '@/types';

export interface AboutStatItem {
  id: string;
  value: number;
  suffix: string;
  labelRu: string;
  labelEn: string;
  labelUk: string;
}

export interface SiteContactInfo {
  email: string;
  phone: string;
  address: string;
  hours: string;
}

export interface SiteCompanyInfo {
  name: string;
  legalName: string;
  foundingYear: number;
}

export interface SiteSocialLink {
  platform: string;
  url: string;
  label: string;
}

export type LocaleCode = 'ru' | 'en' | 'uk';

export const ALL_LOCALES: { code: LocaleCode; label: string; flag: string }[] = [
  { code: 'ru', label: 'Русский', flag: 'RU' },
  { code: 'uk', label: 'Українська', flag: 'UA' },
  { code: 'en', label: 'English', flag: 'EN' },
];

export interface LogoConfig {
  enabled: boolean;
  url: string;
}

export interface HeroButtonsConfig {
  btn1Target: string;
  btn2Target: string;
}

export interface NavItemConfig {
  id: string;
  labelRu: string;
  labelEn: string;
  labelUk: string;
  path: string;
  isHash: boolean;
  enabled: boolean;
}

type I18nMap = Record<string, unknown>;

interface ContentState {
  projects: Project[] | null;
  projectCategories: string[] | null;
  services: Service[] | null;
  teamMembers: TeamMember[] | null;
  testimonials: Testimonial[] | null;
  aboutStatItems: AboutStatItem[] | null;
  contactInfo: SiteContactInfo | null;
  companyInfo: SiteCompanyInfo | null;
  socialLinks: SiteSocialLink[] | null;
  logoConfig: LogoConfig | null;
  heroButtons: HeroButtonsConfig | null;
  navItems: NavItemConfig[] | null;
  themeId: string | null;
  enabledLocales: LocaleCode[] | null;
  defaultLocale: LocaleCode | null;
  i18nOverrides: { ru: I18nMap; en: I18nMap; uk: I18nMap };
}

interface ContentActions {
  setProjects: (p: Project[]) => void;
  setProjectCategories: (c: string[]) => void;
  setServices: (s: Service[]) => void;
  setTeamMembers: (m: TeamMember[]) => void;
  setTestimonials: (t: Testimonial[]) => void;
  setAboutStatItems: (items: AboutStatItem[]) => void;
  setContactInfo: (i: SiteContactInfo) => void;
  setCompanyInfo: (i: SiteCompanyInfo) => void;
  setSocialLinks: (l: SiteSocialLink[]) => void;
  setLogoConfig: (config: LogoConfig) => void;
  setHeroButtons: (config: HeroButtonsConfig) => void;
  setNavItems: (items: NavItemConfig[]) => void;
  setThemeId: (id: string) => void;
  setEnabledLocales: (locales: LocaleCode[]) => void;
  setDefaultLocale: (locale: LocaleCode) => void;
  setI18nOverride: (lang: 'ru' | 'en' | 'uk', path: string, value: string) => void;
  setI18nOverrides: (lang: 'ru' | 'en' | 'uk', overrides: I18nMap) => void;
  resetAll: () => void;
  importConfig: (config: Partial<ContentState>) => void;
  loadServerConfig: () => Promise<void>;
}

function deepSet(obj: I18nMap, path: string, value: unknown): I18nMap {
  const result = structuredClone(obj);
  const parts = path.split('.');
  let current: I18nMap = result;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {};
    }
    current = current[parts[i]] as I18nMap;
  }
  current[parts[parts.length - 1]] = value;
  return result;
}

function deepMerge(target: I18nMap, source: I18nMap): I18nMap {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(
        (result[key] as I18nMap) ?? {},
        source[key] as I18nMap,
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function applyI18nOverrides(overrides: { ru: I18nMap; en: I18nMap; uk: I18nMap }) {
  for (const lang of ['ru', 'en', 'uk'] as const) {
    const o = overrides[lang];
    if (o && Object.keys(o).length > 0) {
      i18n.addResourceBundle(lang, 'common', o, true, true);
    }
  }
}

function applyFullConfig(state: Partial<ContentState>) {
  if (state.themeId) applyTheme(state.themeId);
  if (state.i18nOverrides) applyI18nOverrides(state.i18nOverrides as { ru: I18nMap; en: I18nMap; uk: I18nMap });
  if (state.defaultLocale) i18n.options.fallbackLng = [state.defaultLocale];
  if (state.enabledLocales) {
    const current = i18n.language;
    if (!state.enabledLocales.includes(current as LocaleCode)) {
      i18n.changeLanguage(state.defaultLocale ?? state.enabledLocales[0]);
    }
  }
}

function hasLocalData(): boolean {
  try {
    const raw = localStorage.getItem('site-content');
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    const s = parsed?.state;
    if (!s) return false;
    return Object.keys(s).some((k) => k !== 'i18nOverrides' && s[k] != null);
  } catch {
    return false;
  }
}

const initialState: ContentState = {
  projects: null,
  projectCategories: null,
  services: null,
  teamMembers: null,
  testimonials: null,
  aboutStatItems: null,
  contactInfo: null,
  companyInfo: null,
  socialLinks: null,
  logoConfig: null,
  heroButtons: null,
  navItems: null,
  themeId: null,
  enabledLocales: null,
  defaultLocale: null,
  i18nOverrides: { ru: {}, en: {}, uk: {} },
};

export const useContentStore = create<ContentState & ContentActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setProjects: (projects) => set({ projects }),
      setProjectCategories: (categories) => set({ projectCategories: categories }),
      setServices: (services) => set({ services }),
      setTeamMembers: (members) => set({ teamMembers: members }),
      setTestimonials: (testimonials) => set({ testimonials }),
      setAboutStatItems: (items) => set({ aboutStatItems: items }),
      setContactInfo: (info) => set({ contactInfo: info }),
      setCompanyInfo: (info) => set({ companyInfo: info }),
      setSocialLinks: (links) => set({ socialLinks: links }),
      setLogoConfig: (config) => set({ logoConfig: config }),
      setHeroButtons: (config) => set({ heroButtons: config }),
      setNavItems: (items) => set({ navItems: items }),
      setThemeId: (id) => set({ themeId: id }),
      setEnabledLocales: (locales) => set({ enabledLocales: locales }),
      setDefaultLocale: (locale) => set({ defaultLocale: locale }),

      setI18nOverride: (lang, path, value) => {
        const current = get().i18nOverrides;
        const updated = { ...current, [lang]: deepSet(current[lang], path, value) };
        set({ i18nOverrides: updated });
        applyI18nOverrides(updated);
      },

      setI18nOverrides: (lang, overrides) => {
        const current = get().i18nOverrides;
        const updated = { ...current, [lang]: deepMerge(current[lang], overrides) };
        set({ i18nOverrides: updated });
        applyI18nOverrides(updated);
      },

      resetAll: () => {
        set(initialState);
        window.location.reload();
      },

      importConfig: (config) => {
        set({ ...initialState, ...config });
        if (config.i18nOverrides) {
          applyI18nOverrides(config.i18nOverrides as { ru: I18nMap; en: I18nMap; uk: I18nMap });
        }
      },

      loadServerConfig: async () => {
        if (hasLocalData()) return;
        try {
          const res = await fetch('/site-config.json');
          if (!res.ok) return;
          const config = await res.json() as Partial<ContentState> & { passwordHash?: string };
          if (config.passwordHash) {
            const { useAdminAuthStore } = await import('@/stores/adminAuthStore');
            useAdminAuthStore.setState({ passwordHash: config.passwordHash });
          }
          set({ ...initialState, ...config });
          applyFullConfig(config);
        } catch { /* no server config — use defaults */ }
      },
    }),
    {
      name: 'site-content',
      onRehydrateStorage: () => (state) => {
        if (state) applyFullConfig(state);
      },
    },
  ),
);
