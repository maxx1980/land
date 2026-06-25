import { useState, useEffect } from 'react';
import i18n from '@/i18n';
import { useContentStore, type AboutStatItem } from '@/stores/contentStore';
import { Modal } from '@/admin/components/Modal';
import { LangTabs, type Lang } from './HeroPage';
import { useAdminT } from '@/admin/i18n';
import { cn } from '@/utils';

const TEXT_FIELDS = [
  { key: 'about.title', tKey: 'about.heading' },
  { key: 'about.subtitle', tKey: 'about.subtitle' },
  { key: 'about.description', tKey: 'about.description', multiline: true },
] as const;

const DEFAULT_STAT_ITEMS: AboutStatItem[] = [
  { id: 'years', value: 8, suffix: '', labelRu: 'Лет на рынке', labelEn: 'Years on Market', labelUk: 'Років на ринку' },
  { id: 'projects', value: 120, suffix: '+', labelRu: 'Выполненных проектов', labelEn: 'Projects Delivered', labelUk: 'Виконаних проєктів' },
  { id: 'clients', value: 95, suffix: '+', labelRu: 'Довольных клиентов', labelEn: 'Happy Clients', labelUk: 'Задоволених клієнтів' },
  { id: 'employees', value: 42, suffix: '', labelRu: 'Сотрудников в штате', labelEn: 'Team Members', labelUk: 'Співробітників у штаті' },
];

function emptyItem(): AboutStatItem {
  return { id: crypto.randomUUID(), value: 0, suffix: '', labelRu: '', labelEn: '', labelUk: '' };
}

export const AboutPage = () => {
  const { aboutStatItems, setAboutStatItems, setI18nOverrides } = useContentStore();
  const [lang, setLang] = useState<Lang>('ru');
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [items, setItems] = useState<AboutStatItem[]>(aboutStatItems ?? DEFAULT_STAT_ITEMS);
  const [editing, setEditing] = useState<AboutStatItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
      for (let idx = 0; idx < parts.length - 1; idx++) {
        if (!current[parts[idx]]) current[parts[idx]] = {};
        current = current[parts[idx]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = textValues[f.key];
    }
    setI18nOverrides(lang, overrides);
    setAboutStatItems(items);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openNew = () => {
    setEditing(emptyItem());
    setIsNew(true);
  };

  const openEdit = (item: AboutStatItem) => {
    setEditing({ ...item });
    setIsNew(false);
  };

  const handleSaveItem = () => {
    if (!editing || !editing.labelRu.trim()) return;
    if (isNew) {
      setItems([...items, editing]);
    } else {
      setItems(items.map((it) => (it.id === editing.id ? editing : it)));
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setItems(items.filter((it) => it.id !== deleteId));
    setDeleteId(null);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setItems(arr);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('about.title')}</h1>
        <LangTabs lang={lang} onChange={setLang} />
      </div>

      <div className="space-y-6">
        {/* Section text */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-slate-900">{t('about.sectionText')} ({lang.toUpperCase()})</h2>
          {TEXT_FIELDS.map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t(f.tKey)}</label>
              {'multiline' in f && f.multiline ? (
                <textarea value={textValues[f.key] ?? ''} onChange={(e) => setTextValues({ ...textValues, [f.key]: e.target.value })} rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              ) : (
                <input type="text" value={textValues[f.key] ?? ''} onChange={(e) => setTextValues({ ...textValues, [f.key]: e.target.value })} className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* Stats items */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">{t('about.stats')}</h2>
            <button onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
              + {t('common.add')}
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-primary tabular-nums">{item.value}{item.suffix}</span>
                    <span className="text-sm font-medium text-slate-900">{item.labelRu}</span>
                  </div>
                  <span className="text-xs text-slate-400">{item.labelUk} / {item.labelEn}</span>
                </div>

                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="text-xs text-primary hover:text-primary-dark">{t('common.edit')}</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-xs text-red-500 hover:text-red-700">{t('common.del')}</button>
                </div>
              </div>
            ))}

            {items.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-400 text-sm">
                {t('about.noStats')}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
            {t('common.save')}
          </button>
          {saved && <span className="text-sm text-green-600">{t('common.saved')}</span>}
        </div>
      </div>

      {/* Edit / Create modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? t('about.newStat') : t('about.editStat')}>
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('about.statValue')}</label>
                <input
                  type="number"
                  value={editing.value}
                  onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('about.statSuffix')}</label>
                <input
                  type="text"
                  value={editing.suffix}
                  onChange={(e) => setEditing({ ...editing, suffix: e.target.value })}
                  placeholder='+, %, ...'
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('about.statLabelRu')}</label>
                <input
                  type="text"
                  value={editing.labelRu}
                  onChange={(e) => setEditing({ ...editing, labelRu: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('about.statLabelUk')}</label>
                <input
                  type="text"
                  value={editing.labelUk}
                  onChange={(e) => setEditing({ ...editing, labelUk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('about.statLabelEn')}</label>
                <input
                  type="text"
                  value={editing.labelEn}
                  onChange={(e) => setEditing({ ...editing, labelEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSaveItem}
                disabled={!editing.labelRu.trim()}
                className={cn(
                  'px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors',
                  !editing.labelRu.trim() && 'opacity-50 cursor-not-allowed',
                )}
              >
                {isNew ? t('common.create') : t('common.save')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('about.deleteStat')}>
        <p className="text-sm text-slate-600 mb-4">{t('common.confirmDelete')}</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            {t('common.cancel')}
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">
            {t('common.delete')}
          </button>
        </div>
      </Modal>
    </div>
  );
};
