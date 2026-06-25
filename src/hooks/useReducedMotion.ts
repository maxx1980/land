import { useState, useEffect } from 'react';

/**
 * Detects whether the user has requested reduced motion
 * via the `prefers-reduced-motion` OS/browser setting.
 *
 * Returns `true` when animations should be reduced or disabled.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

    function handleChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }

    setReduced(mql.matches);
    mql.addEventListener('change', handleChange);
    return () => mql.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}
