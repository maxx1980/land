import { useContentStore } from '@/stores/contentStore';
import { useAdminT, type AdminLocale } from '@/admin/i18n';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { THEMES, applyTheme, resetTheme, type ThemePreset } from '@/admin/themes';
import { cn } from '@/utils';

function getThemeName(theme: ThemePreset, locale: AdminLocale): string {
  if (locale === 'uk') return theme.nameUk;
  if (locale === 'en') return theme.nameEn;
  return theme.nameRu;
}

function ColorDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className="w-6 h-6 rounded-full border border-black/10 shadow-sm"
        style={{ backgroundColor: color }}
        title={color}
      />
      <span className="text-[10px] text-slate-400">{label}</span>
    </div>
  );
}

function ThemePreview({ theme }: { theme: ThemePreset }) {
  const c = theme.colors;
  return (
    <div
      className="rounded-lg overflow-hidden border"
      style={{ borderColor: c.border, backgroundColor: c.bg }}
    >
      {/* Header bar */}
      <div className="h-8 flex items-center px-3 gap-2" style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}` }}>
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.primary }} />
        <span className="flex-1 h-2 rounded" style={{ backgroundColor: c.border }} />
      </div>

      {/* Hero area */}
      <div className="px-4 py-5 text-center" style={{ backgroundColor: c.bg }}>
        <div className="h-3 w-24 mx-auto rounded" style={{ backgroundColor: c.textPrimary, opacity: 0.8 }} />
        <div className="h-2 w-32 mx-auto rounded mt-2" style={{ backgroundColor: c.textSecondary, opacity: 0.5 }} />
        <div className="flex justify-center gap-2 mt-3">
          <span className="h-5 w-14 rounded text-[9px] font-semibold leading-5 text-center" style={{ backgroundColor: c.primary, color: c.textInverse }}>
            CTA
          </span>
          <span className="h-5 w-14 rounded text-[9px] font-semibold leading-5 text-center border" style={{ borderColor: c.primary, color: c.primary }}>
            CTA
          </span>
        </div>
      </div>

      {/* Cards row */}
      <div className="px-3 pb-3 flex gap-2" style={{ backgroundColor: c.bgAlt }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex-1 rounded p-2" style={{ backgroundColor: c.surface, border: `1px solid ${c.border}` }}>
            <div className="h-2 w-full rounded" style={{ backgroundColor: c.accent, opacity: 0.6 }} />
            <div className="h-1.5 w-3/4 rounded mt-1.5" style={{ backgroundColor: c.textSecondary, opacity: 0.3 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export const ThemesPage = () => {
  const { themeId, setThemeId } = useContentStore();
  const { adminLocale } = useAdminAuthStore();
  const t = useAdminT();
  const activeId = themeId ?? 'default';

  const handleSelect = (id: string) => {
    if (id === 'default') {
      resetTheme();
      setThemeId(id);
    } else {
      applyTheme(id);
      setThemeId(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">{t('themes.title')}</h1>
      <p className="text-sm text-slate-500 mb-6">{t('themes.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {THEMES.map((theme) => {
          const isActive = activeId === theme.id;
          return (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              className={cn(
                'text-left rounded-xl border-2 p-3 transition-all',
                isActive
                  ? 'border-primary ring-2 ring-primary/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-sm',
              )}
            >
              <ThemePreview theme={theme} />

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className={cn('text-sm font-semibold', isActive ? 'text-primary' : 'text-slate-900')}>
                    {getThemeName(theme, adminLocale)}
                  </p>
                </div>
                {isActive && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-primary text-white">
                    {t('themes.active')}
                  </span>
                )}
              </div>

              <div className="mt-2 flex gap-2">
                <ColorDot color={theme.colors.primary} label="Primary" />
                <ColorDot color={theme.colors.accent} label="Accent" />
                <ColorDot color={theme.colors.bg} label="BG" />
                <ColorDot color={theme.colors.textPrimary} label="Text" />
                <ColorDot color={theme.colors.surface} label="Surface" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
