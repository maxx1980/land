import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';
import { useContentStore, ALL_LOCALES, type LocaleCode } from '@/stores/contentStore';

interface LangSwitchProps {
  position?: 'header' | 'mobile';
}

export const LangSwitch = ({ position = 'header' }: LangSwitchProps) => {
  const { i18n } = useTranslation();
  const enabledLocales = useContentStore((s) => s.enabledLocales);

  const locales = enabledLocales
    ? ALL_LOCALES.filter((l) => enabledLocales.includes(l.code))
    : ALL_LOCALES;

  if (locales.length <= 1) return null;

  const handleChange = (locale: LocaleCode) => {
    i18n.changeLanguage(locale);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-0.5',
        position === 'mobile' ? 'p-4' : '',
      )}
      role="radiogroup"
      aria-label={`Current language: ${i18n.language.toUpperCase()}`}
    >
      {locales.map(({ code, flag }) => (
        <button
          key={code}
          type="button"
          role="radio"
          aria-checked={i18n.language === code}
          onClick={() => handleChange(code)}
          className={cn(
            'text-xs font-semibold px-2 py-1 rounded-md transition-colors duration-200',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
            i18n.language === code
              ? position === 'mobile'
                ? 'bg-primary text-white'
                : 'bg-primary/10 text-primary'
              : position === 'mobile'
                ? 'text-text-primary hover:bg-surface-alt'
                : 'text-text-secondary hover:text-text-primary',
          )}
        >
          {flag}
        </button>
      ))}
    </div>
  );
};
