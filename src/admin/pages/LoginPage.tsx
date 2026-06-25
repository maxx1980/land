import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuthStore } from '@/stores/adminAuthStore';
import { useAdminT } from '@/admin/i18n';

export const LoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const login = useAdminAuthStore((s) => s.login);
  const navigate = useNavigate();
  const location = useLocation();
  const t = useAdminT();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      navigate(from, { replace: true });
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">{t('login.title')}</h1>
          <p className="text-sm text-slate-500 text-center mb-6">{t('login.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                {t('login.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              {error && <p className="mt-1 text-sm text-red-600">{t('login.wrongPw')}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary text-white rounded-md text-sm font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t('login.submit')}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-400 text-center">
            {t('login.defaultPw')}
          </p>
        </div>
      </div>
    </div>
  );
};
