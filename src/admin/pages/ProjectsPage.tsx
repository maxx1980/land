import { useAdminT } from '@/admin/i18n';
import { useState } from 'react';
import { useContentStore } from '@/stores/contentStore';
import { projects as defaultProjects, projectCategories as defaultCategories } from '@/data/projects';
import { Modal } from '@/admin/components/Modal';
import { LangTabs, type Lang } from './HeroPage';
import type { Project } from '@/types';

const emptyProject: Project = {
  id: '', slug: '', title: '', titleRu: '', titleUk: '',
  description: '', descriptionRu: '', descriptionUk: '',
  thumbnail: '', tags: [],
};

function getTitle(p: Project, lang: Lang): string {
  if (lang === 'ru') return p.titleRu ?? '';
  if (lang === 'uk') return p.titleUk ?? '';
  return p.title;
}

function getDesc(p: Project, lang: Lang): string {
  if (lang === 'ru') return p.descriptionRu ?? '';
  if (lang === 'uk') return p.descriptionUk ?? '';
  return p.description;
}

function setTitle(p: Project, lang: Lang, value: string): Project {
  if (lang === 'ru') return { ...p, titleRu: value };
  if (lang === 'uk') return { ...p, titleUk: value };
  return { ...p, title: value };
}

function setDesc(p: Project, lang: Lang, value: string): Project {
  if (lang === 'ru') return { ...p, descriptionRu: value };
  if (lang === 'uk') return { ...p, descriptionUk: value };
  return { ...p, description: value };
}

export const ProjectsPage = () => {
  const { projects: stored, projectCategories: storedCats, setProjects, setProjectCategories } = useContentStore();
  const items = stored ?? defaultProjects;
  const categories = storedCats ?? defaultCategories;

  const [editing, setEditing] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ru');
  const t = useAdminT();
  const [catInput, setCatInput] = useState('');
  const [showCats, setShowCats] = useState(false);

  const openNew = () => { setEditing({ ...emptyProject, id: crypto.randomUUID() }); setIsNew(true); };
  const openEdit = (p: Project) => { setEditing({ ...p }); setIsNew(false); };

  const handleSave = () => {
    if (!editing) return;
    const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const updated = { ...editing, slug };
    if (isNew) {
      setProjects([...items, updated]);
    } else {
      setProjects(items.map((p) => (p.id === updated.id ? updated : p)));
    }
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setProjects(items.filter((p) => p.id !== deleteId));
    setDeleteId(null);
  };

  const addCategory = () => {
    const trimmed = catInput.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setProjectCategories([...categories, trimmed]);
      setCatInput('');
    }
  };

  const removeCategory = (cat: string) => {
    setProjectCategories(categories.filter((c) => c !== cat));
  };

  const toggleTag = (tag: string) => {
    if (!editing) return;
    const tags = editing.tags.includes(tag)
      ? editing.tags.filter((tg) => tg !== tag)
      : [...editing.tags, tag];
    setEditing({ ...editing, tags });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('projects.title')}</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowCats(!showCats)} className="px-3 py-2 text-sm border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
            {t('projects.categories')}
          </button>
          <button onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
            + {t('common.add')}
          </button>
        </div>
      </div>

      {showCats && (
        <div className="bg-white rounded-lg border border-slate-200 p-4 mb-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((cat) => (
              <span key={cat} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-full text-sm">
                {cat}
                <button onClick={() => removeCategory(cat)} className="text-slate-400 hover:text-red-500 ml-0.5">&times;</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={catInput}
              onChange={(e) => setCatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCategory()}
              placeholder={t('projects.newCategory')}
              className="flex-1 px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button onClick={addCategory} className="px-3 py-1.5 bg-slate-100 text-sm rounded-md hover:bg-slate-200 transition-colors">{t('common.add')}</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-600">{t('projects.name')}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 hidden md:table-cell">{t('projects.slug')}</th>
              <th className="text-left px-4 py-3 font-medium text-slate-600 hidden lg:table-cell">{t('projects.tags')}</th>
              <th className="text-right px-4 py-3 font-medium text-slate-600">{t('common.edit')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div>{p.title}</div>
                  {(p.titleRu || p.titleUk) && (
                    <span className="text-xs text-slate-400">{p.titleRu}{p.titleRu && p.titleUk ? ' / ' : ''}{p.titleUk}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{p.slug}</td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {p.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="text-primary hover:text-primary-dark mr-3">{t('common.edit')}</button>
                  <button onClick={() => setDeleteId(p.id)} className="text-red-500 hover:text-red-700">{t('common.del')}</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400">{t('projects.noProjects')}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? t('projects.newProject') : t('projects.editProject')}>
        {editing && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <LangTabs lang={lang} onChange={setLang} />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('projects.name')} ({lang.toUpperCase()})
              </label>
              <input
                value={getTitle(editing, lang)}
                onChange={(e) => setEditing(setTitle(editing, lang, e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('projects.description')} ({lang.toUpperCase()})
              </label>
              <textarea
                value={getDesc(editing, lang)}
                onChange={(e) => setEditing(setDesc(editing, lang, e.target.value))}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('projects.slug')}</label>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                placeholder="auto-generated-from-title"
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('projects.image')}</label>
              <input
                value={editing.thumbnail ?? ''}
                onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('projects.tags')}</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleTag(cat)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      editing.tags.includes(cat)
                        ? 'bg-primary text-white border-primary'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                {t('common.cancel')}
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors">
                {isNew ? t('common.create') : t('common.save')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('projects.deleteProject')}>
        <p className="text-sm text-slate-600 mb-4">{t('projects.deleteConfirm')}</p>
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
