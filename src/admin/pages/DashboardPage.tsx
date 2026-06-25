import { useContentStore } from '@/stores/contentStore';
import { projects as defaultProjects } from '@/data/projects';
import { services as defaultServices } from '@/data/services';
import { teamMembers as defaultTeam } from '@/data/team';
import { testimonials as defaultTestimonials } from '@/data/testimonials';
import { useAdminT } from '@/admin/i18n';

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
}

function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export const DashboardPage = () => {
  const store = useContentStore();
  const t = useAdminT();

  const projects = store.projects ?? defaultProjects;
  const services = store.services ?? defaultServices;
  const team = store.teamMembers ?? defaultTeam;
  const testimonials = store.testimonials ?? defaultTestimonials;

  const hasOverrides =
    store.projects !== null ||
    store.services !== null ||
    store.teamMembers !== null ||
    store.testimonials !== null ||
    Object.keys(store.i18nOverrides.ru).length > 0 ||
    Object.keys(store.i18nOverrides.en).length > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('dashboard.title')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label={t('dashboard.projects')} value={projects.length} icon="📁" color="bg-blue-50" />
        <StatCard label={t('dashboard.services')} value={services.length} icon="⚙️" color="bg-green-50" />
        <StatCard label={t('dashboard.team')} value={team.length} icon="👥" color="bg-purple-50" />
        <StatCard label={t('dashboard.testimonials')} value={testimonials.length} icon="💬" color="bg-amber-50" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">{t('dashboard.overview')}</h2>
        <div className="space-y-3 text-sm text-slate-600">
          <p>
            <span className="font-medium text-slate-800">{t('dashboard.storage')}</span>{' '}
            {hasOverrides ? t('dashboard.hasOverrides') : t('dashboard.defaultData')}
          </p>
          <p>
            <span className="font-medium text-slate-800">i18n RU:</span>{' '}
            {Object.keys(store.i18nOverrides.ru).length > 0 ? t('dashboard.i18nHasOverrides') : t('dashboard.i18nDefault')}
          </p>
          <p>
            <span className="font-medium text-slate-800">i18n EN:</span>{' '}
            {Object.keys(store.i18nOverrides.en).length > 0 ? t('dashboard.i18nHasOverrides') : t('dashboard.i18nDefault')}
          </p>
          <p>
            <span className="font-medium text-slate-800">i18n UK:</span>{' '}
            {Object.keys(store.i18nOverrides.uk).length > 0 ? t('dashboard.i18nHasOverrides') : t('dashboard.i18nDefault')}
          </p>
        </div>
      </div>
    </div>
  );
};
