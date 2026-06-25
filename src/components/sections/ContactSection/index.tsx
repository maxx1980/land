import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { cn } from '@/utils';

interface ContactSectionProps {
  className?: string;
}

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
} as const;

/**
 * Contact section with a form on the left and contact info on the right.
 * Two columns on desktop, stacked on mobile.
 */
export const ContactSection = ({ className }: ContactSectionProps) => {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
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
            title={t('contact.title')}
            subtitle={t('contact.subtitle')}
            animated={false}
            id="contact-title"
          />

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 w-full max-w-4xl"
          >
            {/* Left column: form */}
            <motion.div variants={itemVariants}>
              <ContactForm />
            </motion.div>

            {/* Right column: info */}
            <motion.div variants={itemVariants}>
              <ContactInfo />
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
};
