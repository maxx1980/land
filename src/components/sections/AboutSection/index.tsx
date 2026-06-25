import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { StatsCard } from './StatsCard';
import { cn } from '@/utils';

export interface AboutStat {
  value: number;
  label: string;
  suffix: string;
}

interface AboutSectionProps {
  className?: string;
  stats?: AboutStat[];
}

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
} as const;

export const AboutSection = ({
  className,
  stats,
}: AboutSectionProps) => {
  const { t } = useTranslation();

  const displayStats: AboutStat[] = stats ?? [
    { value: 8, label: t('about.stats.years'), suffix: '' },
    { value: 120, label: t('about.stats.projects'), suffix: '+' },
    { value: 95, label: t('about.stats.clients'), suffix: '+' },
    { value: 42, label: t('about.stats.employees'), suffix: '' },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={cn('py-12 md:py-20 bg-bg-alt', className)}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerVariants}
          className="flex flex-col items-center gap-10"
        >
          <motion.div variants={itemVariants}>
            <SectionTitle
              title={t('about.title')}
              subtitle={t('about.subtitle')}
              animated={false}
              id="about-title"
            />
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="max-w-3xl text-center text-text-secondary text-base md:text-lg leading-relaxed"
          >
            {t('about.description')}
          </motion.p>

          {displayStats.length > 0 && (
            <motion.div
              variants={staggerVariants}
              className={cn(
                'grid gap-4 md:gap-6 w-full max-w-4xl',
                displayStats.length <= 2 ? 'grid-cols-2' :
                displayStats.length === 3 ? 'grid-cols-3' :
                'grid-cols-2 md:grid-cols-4',
              )}
            >
              {displayStats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <StatsCard
                    value={stat.value}
                    label={stat.label}
                    suffix={stat.suffix}
                    animated
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </Container>
    </section>
  );
};
