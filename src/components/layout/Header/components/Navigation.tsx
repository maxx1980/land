import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import { cn } from '@/utils';
import { useContentStore, type NavItemConfig } from '@/stores/contentStore';

interface NavigationProps {
  orientation?: 'horizontal' | 'vertical';
  onItemClick?: () => void;
}

const defaultItems: NavItemConfig[] = [
  { id: 'home', labelRu: 'Главная', labelEn: 'Home', labelUk: 'Головна', path: '/#hero', isHash: true, enabled: true },
  { id: 'services', labelRu: 'Услуги', labelEn: 'Services', labelUk: 'Послуги', path: '/#services', isHash: true, enabled: true },
  { id: 'portfolio', labelRu: 'Портфолио', labelEn: 'Portfolio', labelUk: 'Портфоліо', path: '/#portfolio', isHash: true, enabled: true },
  { id: 'about', labelRu: 'О нас', labelEn: 'About', labelUk: 'Про нас', path: '/#about', isHash: true, enabled: true },
  { id: 'contact', labelRu: 'Контакты', labelEn: 'Contact', labelUk: 'Контакти', path: '/#contact', isHash: true, enabled: true },
];

const linkBaseClasses =
  'text-sm font-medium transition-colors duration-200 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary';

function getLinkClasses(
  isActive: boolean,
  orientation: 'horizontal' | 'vertical',
): string {
  return cn(
    linkBaseClasses,
    orientation === 'vertical'
      ? 'block w-full px-4 py-3 rounded-md'
      : 'px-3 py-2 rounded-md',
    isActive
      ? orientation === 'vertical'
        ? 'bg-primary/10 text-primary'
        : 'text-primary'
      : orientation === 'vertical'
        ? 'text-text-primary hover:bg-surface-alt'
        : 'text-text-secondary hover:text-text-primary',
  );
}

function scrollToHash(hash: string) {
  const id = hash.replace('#', '');
  if (!id) return;
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
}

interface HashLinkProps {
  hash: string;
  label: string;
  orientation: 'horizontal' | 'vertical';
  onItemClick?: () => void;
  isActive: boolean;
}

function HashLink({ hash, label, orientation, onItemClick, isActive }: HashLinkProps) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      scrollToHash(hash);
      onItemClick?.();
    },
    [hash, onItemClick],
  );

  return (
    <a
      href={`/${hash}`}
      onClick={handleClick}
      className={getLinkClasses(isActive, orientation)}
    >
      {label}
    </a>
  );
}

export const Navigation = ({ orientation = 'horizontal', onItemClick }: NavigationProps) => {
  const { i18n } = useTranslation('common');
  const location = useLocation();
  const storedNav = useContentStore((s) => s.navItems);

  const navItems = (storedNav ?? defaultItems).filter((item) => item.enabled);
  const isOnHomePage = location.pathname === '/';
  const lang = i18n.language.startsWith('uk') ? 'uk' : i18n.language.startsWith('ru') ? 'ru' : 'en';

  return (
    <nav role="navigation">
      <ul
        className={cn(
          'flex list-none gap-1',
          orientation === 'vertical' ? 'flex-col items-start' : 'flex-row items-center',
        )}
      >
        {navItems.map((item) => {
          const label = lang === 'ru' ? item.labelRu : lang === 'uk' ? item.labelUk : item.labelEn;

          return (
            <li key={item.id}>
              {item.isHash ? (
                <HashLink
                  hash={item.path.replace('/', '')}
                  label={label}
                  orientation={orientation}
                  onItemClick={onItemClick}
                  isActive={isOnHomePage && location.hash === item.path.replace('/', '#')}
                />
              ) : (
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  onClick={onItemClick}
                  className={({ isActive }) => getLinkClasses(isActive, orientation)}
                >
                  {label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
