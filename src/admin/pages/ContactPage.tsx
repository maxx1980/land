import { useState, useEffect } from 'react';
import i18n from '@/i18n';
import { useContentStore, type SiteContactInfo } from '@/stores/contentStore';
import { LangTabs, type Lang } from './HeroPage';
import { useAdminT } from '@/admin/i18n';

const TEXT_FIELDS = [
  { key: 'contact.title', tKey: 'contact.sectionTitle' },
  { key: 'contact.subtitle', tKey: 'contact.sectionSubtitle' },
  { key: 'contact.form.name', tKey: 'contact.fieldName' },
  { key: 'contact.form.email', tKey: 'contact.fieldEmail' },
  { key: 'contact.form.message', tKey: 'contact.fieldMessage' },
  { key: 'contact.form.submit', tKey: 'contact.submitBtn' },
  { key: 'contact.form.success', tKey: 'contact.successMsg' },
  { key: 'contact.form.error', tKey: 'contact.errorMsg' },
] as const;

const DEFAULT_CONTACT: SiteContactInfo = { email: 'hello@devfirm.ru', phone: '+7 (999) 123-45-67', address: 'г. Москва, ул. Тверская, 1', hours: 'Пн-Пт: 9:00 — 18:00' };

export const ContactPage = () => {
  const { contactInfo, setContactInfo, setI18nOverrides } = useContentStore();
  const [lang, setLang] = useState<Lang>('ru');
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [info, setInfo] = useState<SiteContactInfo>(contactInfo ?? DEFAULT_CONTACT);
  const [saved, setSaved] = useState(false);
  const t = useAdminT();

  useEffect(() => {
    const tr = i18n.getFixedT(lang, 'common');
    const v: Record<string, string> = {};
    for (const f of TEXT_FIELDS) v[f.key] = tr(f.key) as string;
    setTextValues(v);
  }, [lang]);

  const handleSave = () => {
    const overrides: Record<string, unknown> = {};
    for (const f of TEXT_FIELDS) {
      const parts = f.key.split('.');
      let current = overrides;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = textValues[f.key];
    }
    const contactOverrides = { contact: { info: { email: info.email, phone: info.phone, address: info.address, hoursValue: info.hours } }, footer: { email: info.email, phone: info.phone, address: info.address } };
    setI18nOverrides(lang, { ...overrides, ...contactOverrides });
    setContactInfo(info);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('contact.title')}</h1>
        <LangTabs lang={lang} onChange={setLang} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">{t('contact.formText')} ({lang.toUpperCase()})</h2>
          {TEXT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t(f.tKey)}</label>
              <input type="text" value={textValues[f.key] ?? ''} onChange={(e) => setTextValues({ ...textValues, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">{t('contact.contactInfo')}</h2>
          {([['email', 'contact.email'], ['phone', 'contact.phone'], ['address', 'contact.address'], ['hours', 'contact.hours']] as const).map(([field, tKey]) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t(tKey)}</label>
              <input type={field === 'email' ? 'email' : 'text'} value={info[field]} onChange={(e) => setInfo({ ...info, [field]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">{t('common.save')}</button>
        {saved && <span className="text-sm text-green-600">{t('common.saved')}</span>}
      </div>
    </div>
  );
};
