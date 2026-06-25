import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/utils';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Project } from '@/types';

interface PortfolioCardProps {
  project: Project;
}

function getInitials(title: string): string {
  return title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * A card displaying a single portfolio project.
 *
 * States:
 * - normal — renders the project card
 * - hovered — overlay appears with title and tags
 * - imageLoading — pulse skeleton over the image area
 * - imageError — gradient fallback with initials
 */
export function PortfolioCard({ project }: PortfolioCardProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const title = (lang === 'ru' ? project.titleRu : lang === 'uk' ? project.titleUk : undefined) || project.title;
  const description = (lang === 'ru' ? project.descriptionRu : lang === 'uk' ? project.descriptionUk : undefined) || project.description;

  const [imageState, setImageState] = useState<'loading' | 'loaded' | 'error'>(
    project.thumbnail ? 'loading' : 'error',
  );
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => setImageState('loaded');
  const handleImageError = () => setImageState('error');

  return (
    <motion.article
      role="article"
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-lg bg-surface border border-border group"
    >
      {/* ---- Image or fallback ---- */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {imageState === 'loading' && (
          <Skeleton variant="card" className="absolute inset-0" />
        )}

        {project.thumbnail && imageState !== 'error' && (
          <img
            src={project.thumbnail}
            alt={title}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              imageState === 'loaded' ? 'opacity-100' : 'opacity-0',
            )}
          />
        )}

        {imageState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <span
              aria-hidden="true"
              className="text-4xl font-bold text-primary/50"
            >
              {getInitials(title)}
            </span>
          </div>
        )}
      </div>

      {/* ---- Default info (visible when not hovered) ---- */}
      <div
        className={cn(
          'p-4 transition-opacity duration-200',
          isHovered ? 'opacity-0' : 'opacity-100',
        )}
      >
        <h3 className="text-base font-semibold text-text-primary truncate">
          {title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ---- Hover overlay ---- */}
      <div
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center gap-2 p-4',
          'bg-primary/90 transition-opacity duration-200',
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <h3 className="text-lg font-bold text-text-inverse text-center">
          {title}
        </h3>
        <p className="text-sm text-text-inverse/80 text-center line-clamp-3">
          {description}
        </p>
        <div className="mt-1 flex flex-wrap justify-center gap-1">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-text-inverse/20 text-text-inverse"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
