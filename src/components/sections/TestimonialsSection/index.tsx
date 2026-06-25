import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Skeleton } from '@/components/ui/Skeleton';
import { testimonials as defaultTestimonials } from '@/data/testimonials';
import { useAutoplay } from '@/hooks/useAutoplay';
import { TestimonialCard } from './TestimonialCard';
import { CarouselNav } from './CarouselNav';
import { CarouselArrow } from './CarouselArrow';
import { cn } from '@/utils';
import type { Testimonial } from '@/types';

interface TestimonialsSectionProps {
  className?: string;
  /** Override default testimonials */
  testimonials?: Testimonial[];
  /** Loading state */
  loading?: boolean;
  /** Error state */
  error?: string | null;
}

const AUTOPLAY_INTERVAL = 5000;

export const TestimonialsSection = ({
  className,
  testimonials: testimonialsProp,
  loading = false,
  error = null,
}: TestimonialsSectionProps) => {
  const { t } = useTranslation();
  const data = testimonialsProp ?? defaultTestimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const totalPaused = isHovered || isFocused;

  const isMultiple = data.length > 1;
  // Memoize activeIndex check separately so it's always current in the callback
  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const goNext = useCallback(() => {
    if (data.length === 0) return;
    const nextIndex = activeIndexRef.current >= data.length - 1 ? 0 : activeIndexRef.current + 1;
    setActiveIndex(nextIndex);
    activeIndexRef.current = nextIndex;
  }, [data.length]);

  const goPrev = useCallback(() => {
    if (data.length === 0) return;
    const prevIndex = activeIndexRef.current <= 0 ? data.length - 1 : activeIndexRef.current - 1;
    setActiveIndex(prevIndex);
    activeIndexRef.current = prevIndex;
  }, [data.length]);

  // Reset index when data changes
  useEffect(() => {
    setActiveIndex(0);
    activeIndexRef.current = 0;
  }, [data]);

  const { pause, resume } = useAutoplay(goNext, AUTOPLAY_INTERVAL, isMultiple && !totalPaused);

  // Pause autoplay on hover / focus
  useEffect(() => {
    if (totalPaused) {
      pause();
    } else {
      resume();
    }
  }, [totalPaused, pause, resume]);

  // ---- Error state ----
  if (error) {
    return (
      <section
        id="testimonials"
        aria-labelledby="testimonials-title"
        className={cn('py-12 md:py-20 bg-bg-alt', className)}
      >
        <Container>
          <SectionTitle
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
            id="testimonials-title"
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
        id="testimonials"
        aria-label={t('testimonials.title')}
        aria-busy="true"
        className={cn('py-12 md:py-20 bg-bg-alt', className)}
      >
        <Container>
          <SectionTitle
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
          />
          <div className="mt-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-4 mt-4">
              <Skeleton variant="circle" className="w-16 h-16" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // ---- Empty state — hide the section ----
  if (data.length === 0) {
    return null;
  }

  // ---- Normal state ----
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      aria-roledescription="carousel"
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
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
            animated={false}
            id="testimonials-title"
          />

          <div
            className="mt-10 w-full max-w-2xl mx-auto"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onFocusCapture={() => setIsFocused(true)}
            onBlurCapture={() => setIsFocused(false)}
          >
            {/* Carousel viewport */}
            <div
              className="relative flex items-center"
              aria-live="polite"
              aria-atomic="true"
            >
              {/* Left arrow */}
              {isMultiple && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2">
                  <CarouselArrow
                    direction="prev"
                    onClick={goPrev}
                    disabled={!isMultiple}
                  />
                </div>
              )}

              {/* Active testimonial */}
              <div className="flex-1 px-12 min-h-[220px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {data[activeIndex] && (
                    <TestimonialCard
                      key={data[activeIndex].id}
                      testimonial={data[activeIndex]}
                      isActive
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* Right arrow */}
              {isMultiple && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2">
                  <CarouselArrow
                    direction="next"
                    onClick={goNext}
                    disabled={!isMultiple}
                  />
                </div>
              )}
            </div>

            {/* Dot navigation — hidden when only one testimonial */}
            {isMultiple && (
              <div className="mt-8">
                <CarouselNav
                  total={data.length}
                  activeIndex={activeIndex}
                  onChange={setActiveIndex}
                />
              </div>
            )}
          </div>
        </motion.div>
      </Container>
    </section>
  );
};
