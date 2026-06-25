import { useState, useRef } from 'react';
import { useContentStore, ALL_LOCALES, type SiteCompanyInfo, type SiteSocialLink, type LocaleCode, type LogoConfig } from '@/stores/contentStore';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { companyInfo as defaultCompany, socialLinks as defaultSocial } from '@/utils/constants';
import { cn } from '@/utils';
import { useAdminT } from '@/admin/i18n';

const DEFAULT_COMPANY: SiteCompanyInfo = {
  name: defaultCompany.name,
  legalName: defaultCompany.legalName,
  foundingYear: defaultCompany.foundingYear,
};

const DEFAULT_SOCIAL: SiteSocialLink[] = defaultSocial.map((s) => ({ ...s }));

export const SettingsPage = () => {
  const store = useContentStore();
  const { changePassword } = useAdminAuthStore();

  const [company, setCompany] = useState<SiteCompanyInfo>(store.companyInfo ?? DEFAULT_COMPANY);
  const [social, setSocial] = useState<SiteSocialLink[]>(store.socialLinks ?? DEFAULT_SOCIAL);
  const [logo, setLogo] = useState<LogoConfig>(store.logoConfig ?? { enabled: false, url: '' });

  const allCodes = ALL_LOCALES.map((l) => l.code);
  const [enabledLocales, setEnabledLocales] = useState<LocaleCode[]>(store.enabledLocales ?? allCodes);
  const [defaultLocale, setDefaultLocale] = useState<LocaleCode>(store.defaultLocale ?? 'ru');
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useAdminT();

  const toggleLocale = (code: LocaleCode) => {
    if (enabledLocales.includes(code)) {
      if (enabledLocales.length <= 1) return;
      const next = enabledLocales.filter((c) => c !== code);
      setEnabledLocales(next);
      if (defaultLocale === code) setDefaultLocale(next[0]);
    } else {
      setEnabledLocales([...enabledLocales, code]);
    }
  };

  const handleSaveCompany = () => {
    store.setCompanyInfo(company);
    store.setSocialLinks(social);
    store.setLogoConfig(logo);
    store.setEnabledLocales(enabledLocales);
    store.setDefaultLocale(defaultLocale);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    if (!newPw.trim()) { setPwMsg(t('settings.enterNewPw')); return; }
    if (changePassword(oldPw, newPw)) {
      setPwMsg(t('settings.pwChanged'));
      setOldPw(''); setNewPw('');
    } else {
      setPwMsg(t('settings.pwWrong'));
    }
    setTimeout(() => setPwMsg(''), 3000);
  };

  const handleExport = () => {
    const state = useContentStore.getState();
    const authState = useAdminAuthStore.getState();
    const data = {
      projects: state.projects,
      projectCategories: state.projectCategories,
      services: state.services,
      teamMembers: state.teamMembers,
      testimonials: state.testimonials,
      aboutStatItems: state.aboutStatItems,
      contactInfo: state.contactInfo,
      companyInfo: state.companyInfo,
      socialLinks: state.socialLinks,
      logoConfig: state.logoConfig,
      heroButtons: state.heroButtons,
      navItems: state.navItems,
      themeId: state.themeId,
      enabledLocales: state.enabledLocales,
      defaultLocale: state.defaultLocale,
      i18nOverrides: state.i18nOverrides,
      passwordHash: authState.passwordHash,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.passwordHash) {
          useAdminAuthStore.setState({ passwordHash: data.passwordHash });
        }
        store.importConfig(data);
        window.location.reload();
      } catch {
        alert(t('settings.importError'));
      }
    };
    reader.readAsText(file);
  };

  const addSocial = () => {
    setSocial([...social, { platform: '', url: '', label: '' }]);
  };

  const removeSocial = (idx: number) => {
    setSocial(social.filter((_, i) => i !== idx));
  };

  const updateSocial = (idx: number, field: keyof SiteSocialLink, value: string) => {
    const updated = [...social];
    updated[idx] = { ...updated[idx], [field]: value };
    setSocial(updated);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('settings.title')}</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Company info */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('settings.companyInfo')}</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.companyName')}</label>
            <input
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.legalName')}</label>
            <input
              value={company.legalName}
              onChange={(e) => setCompany({ ...company, legalName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.foundingYear')}</label>
            <input
              type="number"
              value={company.foundingYear}
              onChange={(e) => setCompany({ ...company, foundingYear: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('settings.logo')}</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLogo({ ...logo, enabled: !logo.enabled })}
              className={cn(
                'relative w-10 h-5 rounded-full transition-colors flex-shrink-0',
                logo.enabled ? 'bg-primary' : 'bg-slate-300',
              )}
            >
              <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', logo.enabled ? 'translate-x-5' : 'translate-x-0.5')} />
            </button>
            <span className="text-sm text-slate-700">{t('settings.logoEnabled')}</span>
          </div>
          {logo.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.logoUrl')}</label>
                <input
                  value={logo.url}
                  onChange={(e) => setLogo({ ...logo, url: e.target.value })}
                  placeholder="https://... or data:image/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="mt-1 text-xs text-slate-400">{t('settings.logoHint')}</p>
              </div>
              {logo.url && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <img src={logo.url} alt="Logo preview" className="h-10 w-auto object-contain" />
                  <span className="text-xs text-slate-500">{t('settings.logoPreview')}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Password */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('settings.changePw')}</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.currentPw')}</label>
            <input
              type="password"
              value={oldPw}
              onChange={(e) => setOldPw(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('settings.newPw')}</label>
            <input
              type="password"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-slate-800 text-white text-sm font-semibold rounded-md hover:bg-slate-900 transition-colors"
            >
              {t('settings.changePwBtn')}
            </button>
            {pwMsg && <span className="text-sm text-slate-600">{pwMsg}</span>}
          </div>
        </div>

        {/* Locales */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('settings.locales')}</h2>
          <p className="text-xs text-slate-500">{t('settings.localesDesc')}</p>
          <div className="space-y-3">
            {ALL_LOCALES.map((locale) => {
              const enabled = enabledLocales.includes(locale.code);
              const isDefault = defaultLocale === locale.code;
              const isLast = enabled && enabledLocales.length === 1;
              return (
                <div key={locale.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleLocale(locale.code)}
                      disabled={isLast}
                      className={cn(
                        'relative w-10 h-5 rounded-full transition-colors flex-shrink-0',
                        enabled ? 'bg-primary' : 'bg-slate-300',
                        isLast && 'opacity-50 cursor-not-allowed',
                      )}
                    >
                      <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', enabled ? 'translate-x-5' : 'translate-x-0.5')} />
                    </button>
                    <div>
                      <span className="text-sm font-medium text-slate-900">{locale.flag}</span>
                      <span className="text-sm text-slate-500 ml-2">{locale.label}</span>
                    </div>
                  </div>
                  <div>
                    {enabled && (
                      <button
                        onClick={() => setDefaultLocale(locale.code)}
                        className={cn(
                          'text-xs px-2 py-1 rounded transition-colors',
                          isDefault
                            ? 'bg-primary text-white'
                            : 'text-slate-500 hover:bg-slate-100',
                        )}
                      >
                        {isDefault ? 'По умолчанию' : 'Сделать основным'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-slate-400">
            {t('settings.localesHint')}
          </p>
        </div>

        {/* Social links */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">{t('settings.socialLinks')}</h2>
            <button onClick={addSocial} className="text-sm text-primary hover:text-primary-dark">+ {t('common.add')}</button>
          </div>
          {social.map((s, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-0.5">{t('settings.platform')}</label>
                <input
                  value={s.platform}
                  onChange={(e) => updateSocial(i, 'platform', e.target.value)}
                  placeholder="github"
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex-[2]">
                <label className="block text-xs text-slate-500 mb-0.5">{t('settings.url')}</label>
                <input
                  value={s.url}
                  onChange={(e) => updateSocial(i, 'url', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-slate-500 mb-0.5">{t('settings.label')}</label>
                <input
                  value={s.label}
                  onChange={(e) => updateSocial(i, 'label', e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button onClick={() => removeSocial(i)} className="px-2 py-1.5 text-red-400 hover:text-red-600">&times;</button>
            </div>
          ))}
        </div>

        {/* Export / Import / Reset */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('settings.data')}</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 transition-colors"
            >
              Экспорт JSON
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 transition-colors"
            >
              Импорт JSON
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
            <button
              onClick={() => { if (confirm(t('settings.resetConfirm'))) store.resetAll(); }}
              className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors"
            >
              Сбросить всё
            </button>
          </div>
          <p className="text-xs text-slate-400">
            {t('settings.dataHint')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleSaveCompany}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          Сохранить
        </button>
        {saved && <span className="text-sm text-green-600">{t('common.saved')}</span>}
      </div>
    </div>
  );
};
