import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';

interface SkipToContentProps {
  contentId?: string;
}

export function SkipToContent({ contentId = 'main-content' }: SkipToContentProps) {
  const { t } = useTranslation();

  return (
    <a
      href={`#${contentId}`}
      className={cn(
        'sr-only focus:not-sr-only',
        'focus:fixed focus:top-4 focus:left-4 focus:z-50',
        'bg-primary text-text-inverse px-4 py-2 rounded-md',
        'font-medium shadow-lg',
      )}
    >
      {t('skipToContent')}
    </a>
  );
}
