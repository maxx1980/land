import { Link } from 'react-router-dom';
import { cn } from '@/utils';
import { useContentStore } from '@/stores/contentStore';

interface LogoProps {
  variant?: 'header' | 'footer';
  className?: string;
}

export const Logo = ({ variant = 'header', className }: LogoProps) => {
  const logoConfig = useContentStore((s) => s.logoConfig);
  const companyInfo = useContentStore((s) => s.companyInfo);
  const companyName = companyInfo?.name ?? 'DevFirm';

  const showImage = logoConfig?.enabled && logoConfig.url;

  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2 font-bold transition-opacity hover:opacity-85 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary',
        variant === 'header' ? 'text-xl text-text-primary' : 'text-lg text-text-inverse',
        className,
      )}
      aria-label={`${companyName} — Home page`}
    >
      {showImage ? (
        <img
          src={logoConfig.url}
          alt={companyName}
          className="h-8 w-auto object-contain"
        />
      ) : (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect width="32" height="32" rx="8" fill="currentColor" className="text-primary" />
          <path
            d="M8 22V10l8 6-8 6zM16 22V10l8 6-8 6z"
            fill="white"
          />
        </svg>
      )}
      <span>{companyName}</span>
    </Link>
  );
};
