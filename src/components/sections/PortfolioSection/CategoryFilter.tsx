import { useRef, useEffect } from 'react';
import { cn } from '@/utils';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
  allLabel: string;
}

/**
 * Horizontal chip-based category filter.
 * On narrow screens the row scrolls horizontally.
 */
export function CategoryFilter({
  categories,
  activeCategory,
  onChange,
  allLabel,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to the active chip so it stays visible on mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const activeEl = container.querySelector('[aria-selected="true"]');
    if (activeEl instanceof HTMLElement) {
      const { offsetLeft, offsetWidth } = activeEl;
      const { scrollLeft, clientWidth } = container;

      if (offsetLeft < scrollLeft || offsetLeft + offsetWidth > scrollLeft + clientWidth) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeCategory]);

  return (
    <div
      ref={scrollRef}
      role="tablist"
      aria-label={allLabel}
      className="flex flex-nowrap gap-2 overflow-x-auto pb-1 scrollbar-hide"
    >
      {['__all__', ...categories].map((cat) => {
        const displayLabel = cat === '__all__' ? allLabel : cat;
        const isActive = cat === activeCategory;

        return (
          <button
            key={cat}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(cat)}
            aria-label={
              cat === '__all__'
                ? allLabel
                : `${displayLabel}`
            }
            className={cn(
              'shrink-0 px-4 py-2 text-sm font-medium rounded-full border transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
              isActive
                ? 'bg-primary text-text-inverse border-primary'
                : 'border-border bg-surface text-text-secondary hover:text-text-primary hover:border-primary/40',
            )}
          >
            {displayLabel}
          </button>
        );
      })}
    </div>
  );
}
