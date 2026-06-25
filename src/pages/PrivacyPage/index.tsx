import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/ui/SEOHead';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';

const PrivacyPage = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = `${t('siteName')} — Privacy Policy`;
  }, [t]);

  return (
    <Layout>
      <SEOHead title="Privacy Policy" description="Privacy Policy - DevFirm" />
      <Container as="section" className="py-20">
        <SectionTitle title="Privacy Policy" subtitle="How we handle your data" align="left" animated={false} />
        <div className="mt-8 space-y-6 text-text-secondary leading-relaxed max-w-3xl">
          <p>
            This Privacy Policy describes how DevFirm collects, uses, and protects
            your personal information when you use our website and services.
          </p>
          <h3 className="text-xl font-semibold text-text-primary">Information We Collect</h3>
          <p>
            We collect information you provide directly, such as your name and email
            address when you fill out our contact form. We also collect basic usage
            data through standard analytics.
          </p>
          <h3 className="text-xl font-semibold text-text-primary">How We Use Your Information</h3>
          <p>
            We use your information to respond to your inquiries, provide our services,
            and improve our website. We do not sell your personal data to third parties.
          </p>
          <h3 className="text-xl font-semibold text-text-primary">Contact</h3>
          <p>
            If you have questions about this policy, please contact us at{' '}
            <a href="mailto:hello@devfirm.com" className="text-primary hover:underline">
              hello@devfirm.com
            </a>.
          </p>
        </div>
      </Container>
    </Layout>
  );
};

export default PrivacyPage;
