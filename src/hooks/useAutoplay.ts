import { useState, useRef, useCallback, useEffect } from 'react';

interface UseAutoplayResult {
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

/**
 * Auto-advances at the given interval.
 * Respects `prefers-reduced-motion` — disables when the user prefers reduced motion.
 * Cleans up the interval on unmount.
 */
export function useAutoplay(
  callback: () => void,
  interval: number,
  enabled = true,
): UseAutoplayResult {
  const [isPaused, setIsPaused] = useState(false);
  const callbackRef = useRef(callback);
  const prefersReducedMotion = useRef(false);

  // Keep callback ref fresh
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Check media query once
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mql.matches;

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!enabled || prefersReducedMotion.current) return;

    const id = setInterval(() => {
      if (!isPaused) {
        callbackRef.current();
      }
    }, interval);

    return () => clearInterval(id);
  }, [interval, enabled, isPaused]);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  return { pause, resume, isPaused };
}
