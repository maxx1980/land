import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import type { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const LINE_CLAMP_CLASSES = 'line-clamp-5';

/**
 * A single testimonial displayed as a figure with blockquote and figcaption.
 * Long quotes are clamped to 5 lines with a "read more" toggle.
 */
export function TestimonialCard({
  testimonial,
  isActive: _isActive = false,
}: TestimonialCardProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const resolvedText = (lang === 'ru' ? testimonial.textRu : lang === 'uk' ? testimonial.textUk : undefined) || testimonial.text;

  const [expanded, setExpanded] = useState(false);
  const [needsExpansion, setNeedsExpansion] = useState(false);
  const textRef = useCallback(
    (node: HTMLParagraphElement | null) => {
      if (!node) return;
      setNeedsExpansion(node.scrollHeight > node.clientHeight);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resolvedText],
  );

  const handleToggle = () => setExpanded((prev) => !prev);

  const { name, company, photo } = testimonial;

  return (
    <motion.figure
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center text-center max-w-2xl mx-auto"
    >
      <blockquote className="relative">
        {/* Opening quote mark */}
        <span
          aria-hidden="true"
          className="absolute -top-3 -left-2 text-5xl leading-none text-primary/20 select-none"
        >
          &ldquo;
        </span>

        <p
          ref={textRef}
          className={[
            'text-text-secondary italic leading-relaxed text-base md:text-lg',
            expanded ? '' : LINE_CLAMP_CLASSES,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {resolvedText}
        </p>

        {needsExpansion && (
          <button
            type="button"
            onClick={handleToggle}
            className="mt-1 text-sm text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}

        {/* Closing quote mark */}
        <span
          aria-hidden="true"
          className="absolute -bottom-6 -right-2 text-5xl leading-none text-primary/20 select-none"
        >
          &rdquo;
        </span>
      </blockquote>

      <figcaption className="mt-8 flex flex-col items-center gap-3">
        {/* Avatar */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-primary/10 border-2 border-primary/20">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Hide broken image, show initials fallback
                const target = e.currentTarget;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <span
            className={[
              'absolute inset-0 flex items-center justify-center text-primary font-bold text-lg',
              photo ? 'hidden' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {getInitials(name)}
          </span>
        </div>

        <div>
          <cite className="not-italic text-base font-semibold text-text-primary">
            {name}
          </cite>
          <p className="text-sm text-text-secondary">{company}</p>
        </div>
      </figcaption>
    </motion.figure>
  );
}
