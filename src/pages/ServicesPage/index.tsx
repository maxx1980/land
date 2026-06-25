import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/ui/SEOHead';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { ServicesSection } from '@/components/sections/ServicesSection';

const ServicesPage = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <SEOHead
        title={t('meta.services.title')}
        description={t('meta.services.description')}
      />

      {/* Page Header */}
      <section className="py-16 md:py-24 bg-bg-alt" aria-labelledby="services-page-title">
        <Container>
          <SectionTitle
            title={t('services.title')}
            subtitle={t('services.subtitle')}
            id="services-page-title"
          />
        </Container>
      </section>

      <ServicesSection />

      {/* Bottom CTA Block */}
      <section className="py-16 md:py-24 bg-primary" aria-label="Contact call to action">
        <Container className="flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl md:text-4xl font-bold text-text-inverse">
            {t('services.title')}
          </h2>
          <p className="text-lg text-text-inverse/80 max-w-xl">
            {t('services.subtitle')}
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-white text-primary font-semibold text-base hover:bg-surface-alt transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {t('contact.form.submit')}
          </Link>
        </Container>
      </section>
    </Layout>
  );
};

export default ServicesPage;
