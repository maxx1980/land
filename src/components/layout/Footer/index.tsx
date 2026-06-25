import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="bg-slate-900 text-text-inverse">
      <div className="border-t border-slate-800">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              {t('footer.copyright', { year })}
            </p>

            <Link
              to="/privacy"
              className="text-xs text-slate-500 transition-colors hover:text-slate-300 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-light"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
