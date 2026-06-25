import { useState, useEffect, useRef } from 'react';
import { useScrollPosition } from './useScrollPosition';

/**
 * Tracks which section of the page is currently in view,
 * for scroll-spy navigation highlighting.
 *
 * @param sectionIds - Array of DOM element `id` values to observe.
 * @param offset - Pixel offset from the top of the viewport (default 120).
 * @returns The `id` of the currently active section, or `null`.
 */
export function useActiveSection(sectionIds: string[], offset = 120): string | null {
  const [active, setActive] = useState<string | null>(null);
  const { scrollY } = useScrollPosition();
  const heights = useRef<Map<string, { top: number; bottom: number }>>(new Map());

  useEffect(() => {
    const map = heights.current;
    map.clear();

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        // Store positions relative to document, not viewport
        map.set(id, {
          top: rect.top + window.scrollY,
          bottom: rect.bottom + window.scrollY,
        });
      }
    }
  }, [sectionIds, scrollY]); // Re-measure on scroll to handle dynamic content

  useEffect(() => {
    const viewportTop = scrollY + offset;

    let bestSection: string | null = null;
    let bestTop = -Infinity;

    for (const [id, { top }] of heights.current) {
      // Section whose top is at or above the viewport threshold
      if (top <= viewportTop && top > bestTop) {
        bestTop = top;
        bestSection = id;
      }
    }

    setActive(bestSection);
  }, [scrollY, offset]);

  return active;
}
