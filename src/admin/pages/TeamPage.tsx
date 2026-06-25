import { useAdminT } from '@/admin/i18n';
import { useState } from 'react';
import i18n from '@/i18n';
import { useContentStore } from '@/stores/contentStore';
import { teamMembers as defaultTeam } from '@/data/team';
import { Modal } from '@/admin/components/Modal';
import { LangTabs, type Lang } from './HeroPage';
import type { TeamMember } from '@/types';

interface MemberForm {
  id: string;
  nameKey: string;
  roleKey: string;
  bioKey: string;
  photo: string;
  nameRu: string; nameEn: string; nameUk: string;
  roleRu: string; roleEn: string; roleUk: string;
  bioRu: string; bioEn: string; bioUk: string;
  github: string; linkedin: string; twitter: string;
}

function memberToForm(m: TeamMember): MemberForm {
  const tRu = i18n.getFixedT('ru', 'common');
  const tEn = i18n.getFixedT('en', 'common');
  const tUk = i18n.getFixedT('uk', 'common');
  return {
    id: m.id, photo: m.photo ?? '',
    nameKey: m.name, roleKey: m.role, bioKey: m.bio ?? '',
    nameRu: tRu(m.name) as string, nameEn: tEn(m.name) as string, nameUk: tUk(m.name) as string,
    roleRu: tRu(m.role) as string, roleEn: tEn(m.role) as string, roleUk: tUk(m.role) as string,
    bioRu: tRu(m.bio ?? '') as string, bioEn: tEn(m.bio ?? '') as string, bioUk: tUk(m.bio ?? '') as string,
    github: m.socialLinks?.github ?? '',
    linkedin: m.socialLinks?.linkedin ?? '',
    twitter: m.socialLinks?.twitter ?? '',
  };
}

let counter = 0;

export const TeamPage = () => {
  const { teamMembers: stored, setTeamMembers, setI18nOverrides } = useContentStore();
  const items = stored ?? defaultTeam;

  const [editing, setEditing] = useState<MemberForm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lang, setLang] = useState<Lang>('ru');

  const tRu = i18n.getFixedT('ru', 'common');
  const t = useAdminT();

  const openNew = () => {
    counter++;
    const prefix = `team.members.custom_${counter}`;
    setEditing({
      id: crypto.randomUUID(), photo: '',
      nameKey: `${prefix}.name`, roleKey: `${prefix}.role`, bioKey: `${prefix}.bio`,
      nameRu: '', nameEn: '', nameUk: '', roleRu: '', roleEn: '', roleUk: '', bioRu: '', bioEn: '', bioUk: '',
      github: '', linkedin: '', twitter: '',
    });
    setIsNew(true);
  };

  const openEdit = (m: TeamMember) => { setEditing(memberToForm(m)); setIsNew(false); };

  const handleSave = () => {
    if (!editing) return;
    const links: TeamMember['socialLinks'] = {};
    if (editing.github) links.github = editing.github;
    if (editing.linkedin) links.linkedin = editing.linkedin;
    if (editing.twitter) links.twitter = editing.twitter;

    const member: TeamMember = {
      id: editing.id,
      name: editing.nameKey,
      role: editing.roleKey,
      photo: editing.photo,
      bio: editing.bioKey,
      socialLinks: links,
    };

    if (isNew) {
      setTeamMembers([...items, member]);
    } else {
      setTeamMembers(items.map((m) => (m.id === member.id ? member : m)));
    }

    const build = (name: string, role: string, bio: string) => {
      const o: Record<string, unknown> = {};
      setNested(o, editing.nameKey, name);
      setNested(o, editing.roleKey, role);
      if (editing.bioKey) setNested(o, editing.bioKey, bio);
      return o;
    };

    setI18nOverrides('ru', build(editing.nameRu, editing.roleRu, editing.bioRu));
    setI18nOverrides('en', build(editing.nameEn, editing.roleEn, editing.bioEn));
    setI18nOverrides('uk', build(editing.nameUk, editing.roleUk, editing.bioUk));
    setEditing(null);
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setTeamMembers(items.filter((m) => m.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{t('team.title')}</h1>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors">
          Добавить
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((m) => (
          <div key={m.id} className="bg-white rounded-lg border border-slate-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{tRu(m.name) as string}</h3>
                <p className="text-sm text-slate-500">{tRu(m.role) as string}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(m)} className="text-xs text-primary hover:text-primary-dark">{t('common.edit')}</button>
                <button onClick={() => setDeleteId(m.id)} className="text-xs text-red-500 hover:text-red-700 ml-2">{t('common.del')}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={isNew ? t('team.newMember') : t('team.editMember')} wide>
        {editing && (
          <div className="space-y-4">
            <div className="flex justify-end"><LangTabs lang={lang} onChange={setLang} /></div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Имя ({lang.toUpperCase()})</label>
                <input
                  value={editing[lang === 'ru' ? 'nameRu' : lang === 'uk' ? 'nameUk' : 'nameEn']}
                  onChange={(e) => setEditing({ ...editing, [lang === 'ru' ? 'nameRu' : lang === 'uk' ? 'nameUk' : 'nameEn']: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Должность ({lang.toUpperCase()})</label>
                <input
                  value={editing[lang === 'ru' ? 'roleRu' : lang === 'uk' ? 'roleUk' : 'roleEn']}
                  onChange={(e) => setEditing({ ...editing, [lang === 'ru' ? 'roleRu' : lang === 'uk' ? 'roleUk' : 'roleEn']: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Описание ({lang.toUpperCase()})</label>
              <textarea
                value={editing[lang === 'ru' ? 'bioRu' : lang === 'uk' ? 'bioUk' : 'bioEn']}
                onChange={(e) => setEditing({ ...editing, [lang === 'ru' ? 'bioRu' : lang === 'uk' ? 'bioUk' : 'bioEn']: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Фото (URL)</label>
              <input
                value={editing.photo}
                onChange={(e) => setEditing({ ...editing, photo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GitHub</label>
                <input
                  value={editing.github}
                  onChange={(e) => setEditing({ ...editing, github: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                <input
                  value={editing.linkedin}
                  onChange={(e) => setEditing({ ...editing, linkedin: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Twitter</label>
                <input
                  value={editing.twitter}
                  onChange={(e) => setEditing({ ...editing, twitter: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">{t('common.cancel')}</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors">
                {isNew ? 'Создать' : 'Сохранить'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title={t('team.deleteMember')}>
        <p className="text-sm text-slate-600 mb-4">{t('team.deleteConfirm')}</p>
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
