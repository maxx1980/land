import { cn } from '@/utils';

interface CarouselNavProps {
  total: number;
  activeIndex: number;
  onChange: (index: number) => void;
}

/**
 * Dot-based navigation for the testimonials carousel.
 */
export function CarouselNav({
  total,
  activeIndex,
  onChange,
}: CarouselNavProps) {
  return (
    <nav
      className="flex items-center justify-center gap-2"
      role="tablist"
      aria-label="Testimonial navigation"
    >
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={i === activeIndex}
          aria-current={i === activeIndex ? 'true' : undefined}
          aria-label={`Go to slide ${i + 1}`}
          onClick={() => onChange(i)}
          className={cn(
            'w-3 h-3 rounded-full transition-all duration-300',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
            i === activeIndex
              ? 'bg-primary scale-110'
              : 'bg-border hover:bg-primary/40',
          )}
        />
      ))}
    </nav>
  );
}
