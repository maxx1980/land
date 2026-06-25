import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEOHead } from '@/components/ui/SEOHead';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { projects } from '@/data/projects';

const ProjectDetailPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();

  const project = projects.find((p) => p.slug === slug);

  useEffect(() => {
    document.title = project ? `${project.title} — DevFirm` : '404 — DevFirm';
  }, [project]);

  if (!project) {
    return (
      <Layout>
        <SEOHead title="Project Not Found" description="The requested project does not exist" />
        <Container as="section" className="py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-text-secondary mb-8">The project "{slug}" does not exist.</p>
          <Link to="/">
            <Button variant="primary">{t('notFound.cta')}</Button>
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title={`${project.title} — DevFirm`}
        description={project.description}
      />
      <Container as="section" className="py-20">
        <div className="mb-8">
          <Link to="/#portfolio" className="text-primary hover:underline text-sm">&larr; Back to portfolio</Link>
        </div>
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
            {project.title}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed mb-8">
            {project.description}
          </p>
          {project.thumbnail && (
            <div className="rounded-xl overflow-hidden shadow-lg mb-8">
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default ProjectDetailPage;
