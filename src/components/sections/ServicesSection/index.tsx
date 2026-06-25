import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { services as defaultServices } from '@/data/services';
import { ServiceCard } from './ServiceCard';
import { cn } from '@/utils';
import type { Service } from '@/types';

interface ServicesSectionProps {
  className?: string;
  /** Override default services data */
  services?: Service[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
} as const;

const LOADING_COUNT = 6;

export const ServicesSection = ({
  className,
  services,
  loading = false,
  error = null,
}: ServicesSectionProps) => {
  const { t } = useTranslation();
  const data = services ?? defaultServices;

  // ---- Error state ----
  if (error) {
    return (
      <section
        id="services"
        aria-labelledby="services-title"
        className={cn('py-12 md:py-20 bg-bg', className)}
      >
        <Container>
          <SectionTitle
            title={t('services.title')}
            subtitle={t('services.subtitle')}
            id="services-title"
          />
          <div
            className="mt-10 p-8 rounded-lg bg-error/10 border border-error/20 text-center"
            role="alert"
          >
            <p className="text-error font-medium text-lg">{error}</p>
            <p className="text-text-secondary mt-2 text-sm">
              {t('error.retry')}
            </p>
          </div>
        </Container>
      </section>
    );
  }

  // ---- Loading state ----
  if (loading) {
    return (
      <section
        id="services"
        aria-label={t('services.title')}
        aria-busy="true"
        className={cn('py-12 md:py-20 bg-bg', className)}
      >
        <Container>
          <SectionTitle
            title={t('services.title')}
            subtitle={t('services.subtitle')}
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: LOADING_COUNT }, (_, i) => (
              <div key={i} className="rounded-lg bg-surface border border-border p-6 md:p-7">
                <Skeleton className="w-14 h-14 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-4/5 mb-4" />
                <Skeleton className="h-3 w-2/3 mb-1.5" />
                <Skeleton className="h-3 w-3/4 mb-1.5" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // ---- Normal state ----
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className={cn('py-12 md:py-20 bg-bg', className)}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center"
        >
          <SectionTitle
            title={t('services.title')}
            subtitle={t('services.subtitle')}
            animated={false}
            id="services-title"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {data.map((service) => (
              <motion.div key={service.id} variants={cardVariants}>
                <ServiceCard
                  icon={service.icon ?? '📋'}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
