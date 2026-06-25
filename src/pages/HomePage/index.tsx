import { useTranslation } from 'react-i18next';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/ui/SEOHead';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PortfolioSection } from '@/components/sections/PortfolioSection';
import { TeamSection } from '@/components/sections/TeamSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { useContentStore } from '@/stores/contentStore';

const langMap = { ru: 'labelRu', en: 'labelEn', uk: 'labelUk' } as const;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const {
    projects,
    projectCategories,
    services,
    teamMembers,
    testimonials,
    aboutStatItems,
  } = useContentStore();

  const aboutStats = aboutStatItems
    ? aboutStatItems.map((item) => ({
        value: item.value,
        label: item[langMap[i18n.language as keyof typeof langMap] ?? 'labelRu'],
        suffix: item.suffix,
      }))
    : undefined;

  return (
    <Layout>
      <SEOHead
        title={t('meta.home.title')}
        description={t('meta.home.description')}
      />
      <HeroSection />
      <AboutSection stats={aboutStats} />
      <ServicesSection services={services ?? undefined} />
      <PortfolioSection
        projects={projects ?? undefined}
        categories={projectCategories ?? undefined}
      />
      <TeamSection members={teamMembers ?? undefined} />
      <TestimonialsSection testimonials={testimonials ?? undefined} />
      <ContactSection />
    </Layout>
  );
};

export default HomePage;
