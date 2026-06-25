import { useState, useEffect, useRef, useCallback } from 'react';

export interface ScrollPosition {
  isScrolled: boolean;
  scrollY: number;
  direction: 'up' | 'down';
}

interface UseScrollPositionOptions {
  /** Pixel threshold before `isScrolled` becomes `true`. Default: 50. */
  threshold?: number;
}

/**
 * Tracks scroll position with rAF-throttled updates.
 * Returns `isScrolled`, `scrollY`, and scroll `direction`.
 */
export function useScrollPosition(options: UseScrollPositionOptions = {}): ScrollPosition {
  const { threshold = 50 } = options;
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('down');
  const prevScrollY = useRef(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const currentY = window.scrollY;

    if (prevScrollY.current !== currentY) {
      setDirection(currentY > prevScrollY.current ? 'down' : 'up');
      prevScrollY.current = currentY;
    }

    setScrollY(currentY);
    setIsScrolled(currentY > threshold);
    ticking.current = false;
  }, [threshold]);

  useEffect(() => {
    function handleScroll() {
      if (!ticking.current) {
        window.requestAnimationFrame(update);
        ticking.current = true;
      }
    }

    // Set initial value
    update();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [update]);

  return { isScrolled, scrollY, direction };
}
