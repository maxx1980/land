import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface ServiceCardProps {
  /** Emoji or icon text shown as the card icon */
  icon: string;
  /** Service title */
  title: string;
  /** Service description */
  description: string;
  /** List of key features */
  features?: string[];
  /** Click handler */
  onClick?: () => void;
}

/**
 * A card displaying a single service with icon, title, description, and features.
 * Includes hover animation with scale and shadow effect.
 */
export const ServiceCard = ({
  icon,
  title,
  description,
  features,
  onClick,
}: ServiceCardProps) => {
  const { t } = useTranslation();
  const isInteractive = !!onClick;

  const resolvedTitle = t(title, title);
  const resolvedDescription = t(description, description);

  return (
    <motion.article
      role="article"
      tabIndex={isInteractive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        isInteractive
          ? (e: React.KeyboardEvent<HTMLElement>) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      whileHover={
        isInteractive
          ? { scale: 1.02, y: -4, boxShadow: '0 16px 40px -10px rgba(0,0,0,0.12)' }
          : { scale: 1.02, y: -2, boxShadow: '0 8px 24px -6px rgba(0,0,0,0.08)' }
      }
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'group flex flex-col gap-4 p-6 md:p-7',
        'rounded-lg bg-surface border border-border',
        'shadow-md hover:shadow-lg',
        'transition-shadow duration-200',
        isInteractive && 'cursor-pointer',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center w-14 h-14 rounded-lg',
          'bg-primary/10 text-2xl',
          'group-hover:bg-primary/15 transition-colors duration-200',
        )}
        aria-hidden="true"
      >
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-text-primary">{resolvedTitle}</h3>

      {/* Description */}
      <p className="text-text-secondary text-sm md:text-base leading-relaxed line-clamp-3">
        {resolvedDescription}
      </p>

      {/* Features */}
      {features && features.length > 0 && (
        <ul className="flex flex-col gap-2 mt-1" aria-label={`${resolvedTitle} features`}>
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-text-secondary"
            >
              <span
                className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary"
                aria-hidden="true"
              />
              <span>{t(feature, feature)}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
};
