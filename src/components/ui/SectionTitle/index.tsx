import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  animated?: boolean;
  id?: string;
}

export function SectionTitle({
  title,
  subtitle,
  align = 'center',
  animated = true,
  id,
}: SectionTitleProps) {
  const { t } = useTranslation();
  const resolvedTitle = t(title, title);
  const resolvedSubtitle = subtitle ? t(subtitle, subtitle) : undefined;

  const content = (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        align === 'left' && 'items-start text-left',
      )}
    >
      <h2
        id={id}
        className="text-3xl md:text-4xl font-bold text-text-primary"
      >
        {resolvedTitle}
      </h2>
      <div className="h-1 w-16 rounded-full bg-primary" />
      {resolvedSubtitle && (
        <p className="text-text-secondary text-lg max-w-2xl">
          {resolvedSubtitle}
        </p>
      )}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {content}
    </motion.div>
  );
}
