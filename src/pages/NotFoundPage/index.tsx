import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/ui/SEOHead';
import { Container } from '@/components/ui/Container';

const NotFoundPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t('notFound.title');
  }, [t]);

  return (
    <Layout>
      <SEOHead title={t('notFound.title')} description={t('notFound.description')} />
      <Container as="section" className="flex flex-col items-center justify-center min-h-[60vh] py-20 text-center">
        <span className="text-8xl font-extrabold text-primary mb-4">404</span>
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          {t('notFound.title')}
        </h1>
        <p className="text-lg text-text-secondary mb-8 max-w-md">
          {t('notFound.description')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        >
          {t('notFound.cta')}
        </Link>
      </Container>
    </Layout>
  );
};

export default NotFoundPage;
