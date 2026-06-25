import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { teamMembers as defaultMembers } from '@/data/team';
import { TeamCard } from './TeamCard';
import { cn } from '@/utils';
import type { TeamMember } from '@/types';

interface TeamSectionProps {
  className?: string;
  /** Override default team members */
  members?: TeamMember[];
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
      delayChildren: 0.1,
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

export const TeamSection = ({
  className,
  members,
  loading = false,
  error = null,
}: TeamSectionProps) => {
  const { t } = useTranslation();
  const data = members ?? defaultMembers;

  // ---- Error state ----
  if (error) {
    return (
      <section
        id="team"
        aria-labelledby="team-title"
        className={cn('py-12 md:py-20 bg-bg-alt', className)}
      >
        <Container>
          <SectionTitle
            title={t('team.title')}
            subtitle={t('team.subtitle')}
            id="team-title"
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
        id="team"
        aria-label={t('team.title')}
        aria-busy="true"
        className={cn('py-12 md:py-20 bg-bg-alt', className)}
      >
        <Container>
          <SectionTitle
            title={t('team.title')}
            subtitle={t('team.subtitle')}
          />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: LOADING_COUNT }, (_, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-lg bg-surface border border-border p-6"
              >
                <Skeleton
                  variant="circle"
                  className="w-24 h-24 md:w-28 md:h-28 mb-4"
                />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
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
        id="team"
        aria-labelledby="team-title"
        className={cn('py-12 md:py-20 bg-bg-alt', className)}
      >
        <Container>
          <SectionTitle
            title={t('team.title')}
            subtitle={t('team.subtitle')}
            id="team-title"
          />
          <p className="mt-10 text-center text-text-secondary text-base">
            {t('team.empty', 'No team members to display at the moment.')}
          </p>
        </Container>
      </section>
    );
  }

  // ---- Normal state ----
  return (
    <section
      id="team"
      aria-labelledby="team-title"
      className={cn('py-12 md:py-20 bg-bg-alt', className)}
    >
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col items-center"
        >
          <SectionTitle
            title={t('team.title')}
            subtitle={t('team.subtitle')}
            animated={false}
            id="team-title"
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full"
          >
            {data.map((member, index) => (
              <motion.div key={member.id} variants={cardVariants}>
                <TeamCard member={member} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
