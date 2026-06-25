import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { BackgroundAnimation } from '@/components/ui/BackgroundAnimation';
import { cn } from '@/utils';
import { useContentStore } from '@/stores/contentStore';

interface HeroSectionProps {
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
} as const;

const buttonContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

function navigateToTarget(target: string, navigate: ReturnType<typeof useNavigate>) {
  if (target.includes('#')) {
    const hash = target.split('#')[1];
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(target);
    }
  } else {
    navigate(target);
  }
}

export const HeroSection = ({ className }: HeroSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const heroButtons = useContentStore((s) => s.heroButtons);
  const btn1Target = heroButtons?.btn1Target ?? '/#contact';
  const btn2Target = heroButtons?.btn2Target ?? '/#portfolio';

  return (
    <section
      id="hero"
      aria-label={t('hero.title')}
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden',
        'bg-bg',
        className,
      )}
    >
      <BackgroundAnimation className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 60%), radial-gradient(ellipse 50% 50% at 80% 20%, rgba(139,92,246,0.06) 0%, transparent 60%)',
          }}
        />
      </BackgroundAnimation>

      <Container className="relative z-10 px-4 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6 md:gap-8"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-text-primary max-w-4xl leading-[1.1]"
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.div
            variants={buttonContainerVariants}
            className="flex flex-wrap items-center justify-center gap-4 mt-4"
          >
            <motion.div variants={itemVariants}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigateToTarget(btn1Target, navigate)}
                className={cn(
                  'rounded-lg px-8 py-3.5 text-base font-semibold',
                  'bg-primary text-text-inverse',
                  'hover:bg-primary-dark transition-colors duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                )}
              >
                {t('hero.ctaContact')}
              </Button>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigateToTarget(btn2Target, navigate)}
                className={cn(
                  'rounded-lg px-8 py-3.5 text-base font-semibold',
                  'border-2 border-primary text-primary bg-transparent',
                  'hover:bg-primary hover:text-text-inverse transition-colors duration-200',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
                )}
              >
                {t('hero.ctaProjects')}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
