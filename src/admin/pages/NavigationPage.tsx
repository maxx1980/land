import { useState } from 'react';
import { useAdminT } from '@/admin/i18n';
import { useContentStore, type NavItemConfig } from '@/stores/contentStore';
import { Modal } from '@/admin/components/Modal';
import { cn } from '@/utils';

const SECTION_OPTIONS = [
  { value: '/', label: '/ — Главная (страница)', isHash: false },
  { value: '/#hero', label: '#hero — Hero-секция', isHash: true },
  { value: '/#about', label: '#about — О компании', isHash: true },
  { value: '/#services', label: '#services — Услуги', isHash: true },
  { value: '/#portfolio', label: '#portfolio — Портфолио', isHash: true },
  { value: '/#team', label: '#team — Команда', isHash: true },
  { value: '/#testimonials', label: '#testimonials — Отзывы', isHash: true },
  { value: '/#contact', label: '#contact — Контакты', isHash: true },
  { value: '/services', label: '/services — Страница услуг', isHash: false },
  { value: '/privacy', label: '/privacy — Политика конфиденциальности', isHash: false },
] as const;

const DEFAULT_NAV: NavItemConfig[] = [
  { id: 'home', labelRu: 'Главная', labelEn: 'Home', labelUk: 'Головна', path: '/#hero', isHash: true, enabled: true },
  { id: 'services', labelRu: 'Услуги', labelEn: 'Services', labelUk: 'Послуги', path: '/#services', isHash: true, enabled: true },
  { id: 'portfolio', labelRu: 'Портфолио', labelEn: 'Portfolio', labelUk: 'Портфоліо', path: '/#portfolio', isHash: true, enabled: true },
  { id: 'about', labelRu: 'О нас', labelEn: 'About', labelUk: 'Про нас', path: '/#about', isHash: true, enabled: true },
  { id: 'contact', labelRu: 'Контакты', labelEn: 'Contact', labelUk: 'Контакти', path: '/#contact', isHash: true, enabled: true },
];

function ArrowIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d={direction === 'up' ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
    </svg>
  );
}

export const NavigationPage = () => {
  const { navItems: stored, setNavItems } = useContentStore();
  const items = stored ?? DEFAULT_NAV;

  const [editing, setEditing] = useState<NavItemConfig | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [customPath, setCustomPath] = useState(false);
  const t = useAdminT();

  const toggle = (id: string) => {
    setNavItems(items.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item)));
  };

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const arr = [...items];
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    setNavItems(arr);
  };

  const openNew = () => {
    setEditing({ id: crypto.randomUUID(), labelRu: '', labelEn: '', labelUk: '', path: '/', isHash: false, enabled: true });
    setIsNew(true);
    setCustomPath(false);
  };

  const openEdit = (item: NavItemConfig) => {
    setEditing({ ...item });
    setIsNew(false);
    setCustomPath(!SECTION_OPTIONS.some((o) => o.value === item.path));
  };

  const handleSelectPath = (value: string) => {
    if (!editing) return;
    if (value === '__custom__') {
      setCustomPath(true);
      return;
    }
    const opt = SECTION_OPTIONS.find((o) => o.value === value);
    setEditing({ ...editing, path: value, isHash: opt?.isHash ?? false });
    setCustomPath(false);
  };

  const handleSave = () => {
    if (!editing || !editing.labelRu.trim()) return;
    if (isNew) {
      setNavItems([...items, editing]);
    } else {
      setNavItems(items.map((item) => (item.id === editing.id ? editing : item)));
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setNavItems(items.filter((item) => item.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('nav.title')}</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
          Добавить пункт
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <div key={item.id} className={cn('flex items-center gap-4 px-4 py-3', !item.enabled && 'opacity-50')}>
              {/* Toggle */}
              <button
                onClick={() => toggle(item.id)}
                className={cn(
                  'relative w-10 h-5 rounded-full transition-colors flex-shrink-0',
                  item.enabled ? 'bg-primary' : 'bg-slate-300',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform',
                    item.enabled ? 'translate-x-5' : 'translate-x-0.5',
                  )}
                />
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 text-sm">{item.labelRu}</span>
                  <span className="text-xs text-slate-400">/ {item.labelUk} / {item.labelEn}</span>
                </div>
                <span className="text-xs text-slate-500">{item.path}</span>
              </div>

              {/* Reorder */}
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0}
                  className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowIcon direction="up" />
                </button>
                <button
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                  className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowIcon direction="down" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(item)} className="text-xs text-primary hover:text-primary-dark">{t('common.edit')}</button>
                <button onClick={() => setDeleteId(item.id)} className="text-xs text-red-500 hover:text-red-700">{t('common.del')}</button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="px-4 py-8 text-center text-slate-400 text-sm">
              {t('nav.noItems')}
            </div>
          )}
        </div>
      </div>

      {/* Edit / Create Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? t('nav.newItem') : t('nav.editItem')}>
        {editing && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('nav.labelRu')}</label>
                <input
                  value={editing.labelRu}
                  onChange={(e) => setEditing({ ...editing, labelRu: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('nav.labelUk')}</label>
                <input
                  value={editing.labelUk}
                  onChange={(e) => setEditing({ ...editing, labelUk: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('nav.labelEn')}</label>
                <input
                  value={editing.labelEn}
                  onChange={(e) => setEditing({ ...editing, labelEn: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('nav.target')}</label>
              <select
                value={customPath ? '__custom__' : editing.path}
                onChange={(e) => handleSelectPath(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {SECTION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                <option value="__custom__">{t('nav.otherCustom')}</option>
              </select>
            </div>

            {customPath && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('nav.customPath')}</label>
                <input
                  value={editing.path}
                  onChange={(e) => setEditing({ ...editing, path: e.target.value, isHash: e.target.value.includes('#') })}
                  placeholder="/my-page или /#my-section"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Для скролла к блоку используйте формат <code>/#id-блока</code>. Для ссылки на страницу — <code>/путь</code>.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditing({ ...editing, enabled: !editing.enabled })}
                className={cn(
                  'relative w-10 h-5 rounded-full transition-colors',
                  editing.enabled ? 'bg-primary' : 'bg-slate-300',
                )}
              >
                <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform', editing.enabled ? 'translate-x-5' : 'translate-x-0.5')} />
              </button>
              <span className="text-sm text-slate-700">{editing.enabled ? 'Включён' : 'Выключен'}</span>
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

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('nav.deleteItem')}>
        <p className="text-sm text-slate-600 mb-4">{t('nav.deleteConfirm')}</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
            Отмена
          </button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">
            Удалить
          </button>
        </div>
      </Modal>
    </div>
  );
};
