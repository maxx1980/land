import { useAdminT } from '@/admin/i18n';
import { useState } from 'react';
import i18n from '@/i18n';
import { useContentStore } from '@/stores/contentStore';
import { services as defaultServices } from '@/data/services';
import { Modal } from '@/admin/components/Modal';
import { LangTabs, type Lang } from './HeroPage';
import type { Service } from '@/types';

interface ServiceForm {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  featureKeys: string[];
  titleRu: string;
  titleEn: string;
  titleUk: string;
  descRu: string;
  descEn: string;
  descUk: string;
  featuresRu: string[];
  featuresEn: string[];
  featuresUk: string[];
}

function serviceToForm(s: Service): ServiceForm {
  const tRu = i18n.getFixedT('ru', 'common');
  const tEn = i18n.getFixedT('en', 'common');
  const tUk = i18n.getFixedT('uk', 'common');
  return {
    id: s.id,
    icon: s.icon ?? '',
    titleKey: s.title,
    descKey: s.description,
    featureKeys: s.features ?? [],
    titleRu: tRu(s.title) as string,
    titleEn: tEn(s.title) as string,
    titleUk: tUk(s.title) as string,
    descRu: tRu(s.description) as string,
    descEn: tEn(s.description) as string,
    descUk: tUk(s.description) as string,
    featuresRu: (s.features ?? []).map((k) => tRu(k) as string),
    featuresEn: (s.features ?? []).map((k) => tEn(k) as string),
    featuresUk: (s.features ?? []).map((k) => tUk(k) as string),
  };
}

let counter = 0;

export const ServicesPage = () => {
  const { services: stored, setServices, setI18nOverrides } = useContentStore();
  const items = stored ?? defaultServices;

  const [editing, setEditing] = useState<ServiceForm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ru');

  const tRu = i18n.getFixedT('ru', 'common');
  const t = useAdminT();

  const openNew = () => {
    counter++;
    const prefix = `services.custom_${counter}`;
    setEditing({
      id: crypto.randomUUID(),
      icon: '',
      titleKey: `${prefix}.title`,
      descKey: `${prefix}.description`,
      featureKeys: [],
      titleRu: '', titleEn: '', titleUk: '', descRu: '', descEn: '', descUk: '',
      featuresRu: [], featuresEn: [], featuresUk: [],
    });
    setIsNew(true);
  };

  const openEdit = (s: Service) => { setEditing(serviceToForm(s)); setIsNew(false); };

  const handleSave = () => {
    if (!editing) return;

    const featureKeys = editing.featuresRu.map((_, i) =>
      editing.featureKeys[i] ?? `${editing.titleKey.replace('.title', '')}.features.f${i}`,
    );

    const service: Service = {
      id: editing.id,
      icon: editing.icon,
      title: editing.titleKey,
      description: editing.descKey,
      features: featureKeys,
    };

    if (isNew) {
      setServices([...items, service]);
    } else {
      setServices(items.map((s) => (s.id === service.id ? service : s)));
    }

    const buildOverrides = (title: string, desc: string, features: string[]) => {
      const o: Record<string, unknown> = {};
      setNested(o, editing.titleKey, title);
      setNested(o, editing.descKey, desc);
      features.forEach((f, i) => setNested(o, featureKeys[i], f));
      return o;
    };

    setI18nOverrides('ru', buildOverrides(editing.titleRu, editing.descRu, editing.featuresRu));
    setI18nOverrides('en', buildOverrides(editing.titleEn, editing.descEn, editing.featuresEn));
    setI18nOverrides('uk', buildOverrides(editing.titleUk, editing.descUk, editing.featuresUk));
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setServices(items.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const addFeature = () => {
    if (!editing) return;
    setEditing({
      ...editing,
      featuresRu: [...editing.featuresRu, ''],
      featuresEn: [...editing.featuresEn, ''],
      featuresUk: [...editing.featuresUk, ''],
    });
  };

  const removeFeature = (idx: number) => {
    if (!editing) return;
    setEditing({
      ...editing,
      featuresRu: editing.featuresRu.filter((_, i) => i !== idx),
      featuresEn: editing.featuresEn.filter((_, i) => i !== idx),
      featuresUk: editing.featuresUk.filter((_, i) => i !== idx),
      featureKeys: editing.featureKeys.filter((_, i) => i !== idx),
    });
  };

  const titleField = lang === 'ru' ? 'titleRu' : lang === 'uk' ? 'titleUk' : 'titleEn';
  const descField = lang === 'ru' ? 'descRu' : lang === 'uk' ? 'descUk' : 'descEn';
  const featuresField = lang === 'ru' ? 'featuresRu' : lang === 'uk' ? 'featuresUk' : 'featuresEn';
  const features = editing ? editing[featuresField] : undefined;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('services.title')}</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
          Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.id} className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="text-xs text-primary hover:text-primary-dark">{t('common.edit')}</button>
                <button onClick={() => setDeleteId(s.id)} className="text-xs text-red-500 hover:text-red-700 ml-2">{t('common.del')}</button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-900">{tRu(s.title) as string}</h3>
            <p className="text-sm text-slate-500 mt-1">{tRu(s.description) as string}</p>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? t('services.newService') : t('services.editService')} wide>
        {editing && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <LangTabs lang={lang} onChange={setLang} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('services.icon')}</label>
                <input
                  value={editing.icon}
                  onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название ({lang.toUpperCase()})</label>
                <input
                  value={editing[titleField]}
                  onChange={(e) => setEditing({ ...editing, [titleField]: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Описание ({lang.toUpperCase()})</label>
              <textarea
                value={editing[descField]}
                onChange={(e) => setEditing({ ...editing, [descField]: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-700">{t('services.features')} ({lang.toUpperCase()})</label>
                <button onClick={addFeature} type="button" className="text-xs text-primary hover:text-primary-dark">+ {t('common.add')}</button>
              </div>
              <div className="space-y-2">
                {features?.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      value={f}
                      onChange={(e) => {
                        const arr = [...editing[featuresField]];
                        arr[i] = e.target.value;
                        setEditing({ ...editing, [featuresField]: arr });
                      }}
                      className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button onClick={() => removeFeature(i)} type="button" className="px-2 text-red-400 hover:text-red-600">&times;</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                Отмена
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors">
                {isNew ? 'Создать' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('services.deleteService')}>
        <p className="text-sm text-slate-600 mb-4">{t('services.deleteConfirm')}</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">{t('common.cancel')}</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">{t('common.delete')}</button>
        </div>
      </Modal>
    </div>
  );
};

function setNested(obj: Record<string, unknown>, path: string, value: unknown) {
  const parts = path.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!current[parts[i]] || typeof current[parts[i]] !== 'object') current[parts[i]] = {};
    current = current[parts[i]] as Record<string, unknown>;
  }
  current[parts[parts.length - 1]] = value;
}
