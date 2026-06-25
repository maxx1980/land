import { useAdminT } from '@/admin/i18n';
import { useState } from 'react';
import { useContentStore } from '@/stores/contentStore';
import { testimonials as defaultTestimonials } from '@/data/testimonials';
import { Modal } from '@/admin/components/Modal';
import { LangTabs, type Lang } from './HeroPage';
import type { Testimonial } from '@/types';

const emptyTestimonial: Testimonial = {
  id: '', name: '', company: '', text: '', textRu: '', textUk: '', photo: '',
};

function getText(t: Testimonial, lang: Lang): string {
  if (lang === 'ru') return t.textRu ?? '';
  if (lang === 'uk') return t.textUk ?? '';
  return t.text;
}

function setText(t: Testimonial, lang: Lang, value: string): Testimonial {
  if (lang === 'ru') return { ...t, textRu: value };
  if (lang === 'uk') return { ...t, textUk: value };
  return { ...t, text: value };
}

export const TestimonialsPage = () => {
  const { testimonials: stored, setTestimonials } = useContentStore();
  const items = stored ?? defaultTestimonials;

  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ru');
  const at = useAdminT();

  const openNew = () => { setEditing({ ...emptyTestimonial, id: crypto.randomUUID() }); setIsNew(true); };
  const openEdit = (item: Testimonial) => { setEditing({ ...item }); setIsNew(false); };

  const handleSave = () => {
    if (!editing) return;
    if (isNew) {
      setTestimonials([...items, editing]);
    } else {
      setTestimonials(items.map((item) => (item.id === editing.id ? editing : item)));
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setTestimonials(items.filter((item) => item.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{at('testimonials.title')}</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
          + {at('common.add')}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">{at('testimonials.name')}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">{at('testimonials.company')}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">{at('testimonials.review')}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">{at('common.edit')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{item.name}</td>
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{item.company}</td>
                <td className="px-4 py-3 text-slate-500 hidden lg:table-cell max-w-xs truncate">{item.text}</td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(item)} className="text-primary hover:text-primary-dark mr-3">{at('common.edit')}</button>
                  <button onClick={() => setDeleteId(item.id)} className="text-red-500 hover:text-red-700">{at('common.del')}</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">{at('testimonials.noTestimonials')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? at('testimonials.newTestimonial') : at('testimonials.editTestimonial')}>
        {editing && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{at('testimonials.name')}</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{at('testimonials.company')}</label>
              <input
                value={editing.company}
                onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <LangTabs lang={lang} onChange={setLang} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {at('testimonials.text')} ({lang.toUpperCase()})
              </label>
              <textarea
                value={getText(editing, lang)}
                onChange={(e) => setEditing(setText(editing, lang, e.target.value))}
                rows={4}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{at('testimonials.photo')}</label>
              <input
                value={editing.photo ?? ''}
                onChange={(e) => setEditing({ ...editing, photo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                {at('common.cancel')}
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors">
                {isNew ? at('common.create') : at('common.save')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={at('testimonials.deleteTestimonial')}>
        <p className="text-sm text-slate-600 mb-4">{at('testimonials.deleteConfirm')}</p>
        <div className="flex justify-end gap-2">
          <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">{at('common.cancel')}</button>
          <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-md hover:bg-red-700 transition-colors">{at('common.delete')}</button>
        </div>
      </Modal>
    </div>
  );
};
