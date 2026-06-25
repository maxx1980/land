import { useState, useEffect } from 'react';
import i18n from '@/i18n';
import { useContentStore, type HeroButtonsConfig } from '@/stores/contentStore';
import { useAdminT } from '@/admin/i18n';

export type Lang = 'ru' | 'en' | 'uk';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'ru', label: 'RU' },
  { code: 'uk', label: 'UA' },
  { code: 'en', label: 'EN' },
];

export function LangTabs({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="flex rounded-md border border-slate-300 overflow-hidden text-sm">
      {LANGS.map((l, i) => (
        <button
          key={l.code}
          onClick={() => onChange(l.code)}
          className={`px-3 py-1.5 font-medium transition-colors ${i > 0 ? 'border-l border-slate-300' : ''} ${lang === l.code ? 'bg-primary text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

const TEXT_KEYS = ['hero.title', 'hero.subtitle'] as const;
const BTN_KEYS = ['hero.ctaContact', 'hero.ctaProjects'] as const;

const LABEL_MAP: Record<string, string> = {
  'hero.title': 'hero.heading',
  'hero.subtitle': 'hero.subtitle',
  'hero.ctaContact': 'hero.ctaContact',
  'hero.ctaProjects': 'hero.ctaProjects',
};

const ALL_FIELD_KEYS = [...TEXT_KEYS, ...BTN_KEYS];

const TARGET_OPTIONS = [
  { value: '/#hero', label: '#hero' },
  { value: '/#about', label: '#about' },
  { value: '/#services', label: '#services' },
  { value: '/#portfolio', label: '#portfolio' },
  { value: '/#team', label: '#team' },
  { value: '/#testimonials', label: '#testimonials' },
  { value: '/#contact', label: '#contact' },
  { value: '/', label: '/' },
  { value: '/services', label: '/services' },
  { value: '/privacy', label: '/privacy' },
];

const DEFAULT_BTN1_TARGET = '/#contact';
const DEFAULT_BTN2_TARGET = '/#portfolio';

export const HeroPage = () => {
  const { setI18nOverrides, heroButtons, setHeroButtons } = useContentStore();
  const [lang, setLang] = useState<Lang>('ru');
  const [values, setValues] = useState<Record<string, string>>({});
  const [btn1Target, setBtn1Target] = useState(heroButtons?.btn1Target ?? DEFAULT_BTN1_TARGET);
  const [btn2Target, setBtn2Target] = useState(heroButtons?.btn2Target ?? DEFAULT_BTN2_TARGET);
  const [saved, setSaved] = useState(false);
  const t = useAdminT();

  useEffect(() => {
    const tr = i18n.getFixedT(lang, 'common');
    const v: Record<string, string> = {};
    for (const key of ALL_FIELD_KEYS) v[key] = tr(key) as string;
    setValues(v);
  }, [lang]);

  const handleSave = () => {
    const overrides: Record<string, unknown> = {};
    for (const key of ALL_FIELD_KEYS) {
      const parts = key.split('.');
      let current = overrides;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = values[key];
    }
    setI18nOverrides(lang, overrides);

    const config: HeroButtonsConfig = { btn1Target, btn2Target };
    setHeroButtons(config);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('hero.title')}</h1>
        <LangTabs lang={lang} onChange={setLang} />
      </div>

      <div className="space-y-6">
        {/* Title & Subtitle */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          {TEXT_KEYS.map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t(LABEL_MAP[key])}</label>
              <textarea
                value={values[key] ?? ''}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                rows={key.includes('subtitle') ? 3 : 2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          ))}
        </div>

        {/* Button 1 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('hero.btn1')}</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('hero.ctaContact')}</label>
            <input
              type="text"
              value={values['hero.ctaContact'] ?? ''}
              onChange={(e) => setValues({ ...values, 'hero.ctaContact': e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('hero.btn1Target')}</label>
            <select
              value={btn1Target}
              onChange={(e) => setBtn1Target(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Button 2 */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">{t('hero.btn2')}</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('hero.ctaProjects')}</label>
            <input
              type="text"
              value={values['hero.ctaProjects'] ?? ''}
              onChange={(e) => setValues({ ...values, 'hero.ctaProjects': e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{t('hero.btn2Target')}</label>
            <select
              value={btn2Target}
              onChange={(e) => setBtn2Target(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {TARGET_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors"
          >
            {t('common.save')}
          </button>
          {saved && <span className="text-sm text-green-600">{t('common.saved')}</span>}
        </div>
      </div>
    </div>
  );
};
