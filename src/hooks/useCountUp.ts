import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCountUpOptions {
  /** Target value to animate to */
  end: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Whether to start the animation immediately */
  startOnMount?: boolean;
  /** Easing function: receives progress 0-1, returns eased progress 0-1 */
  easing?: (t: number) => number;
}

interface UseCountUpResult {
  /** Current animated count value */
  count: number;
  /** Whether the animation is currently running */
  isAnimating: boolean;
  /** Manually start the animation */
  start: () => void;
}

const defaultEasing = (t: number): number => {
  // ease-out cubic
  return 1 - Math.pow(1 - t, 3);
};

/**
 * Animates a number from 0 to the target value.
 * Respects prefers-reduced-motion: sets the final value instantly.
 */
export function useCountUp({
  end,
  duration = 2000,
  startOnMount = true,
  easing = defaultEasing,
}: UseCountUpOptions): UseCountUpResult {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const endRef = useRef(end);

  // Keep the target value up to date
  useEffect(() => {
    endRef.current = end;
  }, [end]);

  const animate = useCallback(
    (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const current = Math.round(easedProgress * endRef.current);

      setCount(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(endRef.current);
        setIsAnimating(false);
      }
    },
    [duration, easing],
  );

  const start = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReducedMotion) {
      setCount(endRef.current);
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = null;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    if (startOnMount) {
      start();
    }

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [startOnMount, start]);

  return { count, isAnimating, start };
}
