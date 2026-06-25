import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { projects as defaultProjects, projectCategories } from '@/data/projects';
import { PortfolioCard } from './PortfolioCard';
import { CategoryFilter } from './CategoryFilter';
import { cn } from '@/utils';
import type { Project } from '@/types';

interface PortfolioSectionProps {
  className?: string;
  /** Override default projects */
  projects?: Project[];
  /** Override default categories */
  categories?: string[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
} as const;

const LOADING_COUNT = 3;

export const PortfolioSection = ({
  className,
  projects: projectsProp,
  categories: categoriesProp,
  loading = false,
  error = null,
}: PortfolioSectionProps) => {
  const { t } = useTranslation();
  const data = projectsProp ?? defaultProjects;
  const categories = categoriesProp ?? projectCategories;
  const [activeCategory, setActiveCategory] = useState('__all__');

  const handleCategoryChange = useCallback(
    (category: string) => setActiveCategory(category),
    [],
  );

  const filtered = useMemo(
    () =>
      activeCategory === '__all__'
        ? data
        : data.filter((p) => p.tags.includes(activeCategory)),
    [data, activeCategory],
  );

  // ---- Error state ----
  if (error) {
    return (
      <section
        id="portfolio"
        aria-labelledby="portfolio-title"
        className={cn('py-12 md:py-20 bg-surface', className)}
      >
        <Container>
          <SectionTitle
            title={t('portfolio.title')}
            subtitle={t('portfolio.subtitle')}
            id="portfolio-title"
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
        id="portfolio"
        aria-label={t('portfolio.title')}
        aria-busy="true"
        className={cn('py-12 md:py-20 bg-surface', className)}
      >
        <Container>
          <SectionTitle
            title={t('portfolio.title')}
            subtitle={t('portfolio.subtitle')}
          />
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-9 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: LOADING_COUNT }, (_, i) => (
              <div
                key={i}
                className="rounded-lg bg-surface border border-border overflow-hidden"
              >
                <Skeleton variant="card" className="aspect-[4/3]" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  // ---- Empty state ----
  if (data.length === 0) {
    return (
      <section
        id="portfolio"
        aria-labelledby="portfolio-title"
        className={cn('py-12 md:py-20 bg-surface', className)}
      >
        <Container>
          <SectionTitle
            title={t('portfolio.title')}
            subtitle={t('portfolio.subtitle')}
            id="portfolio-title"
          />
          <p className="mt-10 text-center text-text-secondary text-lg">
            {t('portfolio.empty')}
          </p>
        </Container>
      </section>
    );
  }

  // ---- Normal state ----
  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className={cn('py-12 md:py-20 bg-surface', className)}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center"
        >
          <SectionTitle
            title={t('portfolio.title')}
            subtitle={t('portfolio.subtitle')}
            animated={false}
            id="portfolio-title"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 w-full max-w-lg mx-auto"
          >
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onChange={handleCategoryChange}
              allLabel={t('portfolio.filterAll')}
            />
          </motion.div>

          {/* ---- Filtered-empty state ---- */}
          {filtered.length === 0 ? (
            <p className="mt-10 text-center text-text-secondary text-lg">
              {t('portfolio.emptyFilter')}
            </p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
              >
                {filtered.map((project) => (
                  <motion.div
                    key={project.id}
                    variants={cardVariants}
                    layout
                  >
                    <PortfolioCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </Container>
    </section>
  );
};
