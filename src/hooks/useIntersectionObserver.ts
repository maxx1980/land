import { useState, useRef, useCallback, useEffect } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** If true, stops observing after the element becomes visible once */
  triggerOnce?: boolean;
}

interface UseIntersectionObserverResult {
  /** Callback ref to attach to the target element */
  ref: (node: Element | null) => void;
  /** Whether the observed element is currently intersecting */
  isVisible: boolean;
  /** The most recent IntersectionObserver entry, or null */
  entry: IntersectionObserverEntry | null;
}

/**
 * Tracks whether an element is visible in the viewport.
 * Useful for triggering animations when an element scrolls into view.
 */
export function useIntersectionObserver({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  triggerOnce = false,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverResult {
  const [isVisible, setIsVisible] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const triggeredRef = useRef(false);

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  const ref = useCallback(
    (node: Element | null) => {
      cleanup();

      // If triggerOnce was already triggered on a previous node, reset it for the new node
      if (node === null) {
        triggeredRef.current = false;
        return;
      }

      // If triggerOnce was triggered for this node already, set visible immediately
      if (triggerOnce && triggeredRef.current) {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          setEntry(entry);

          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              triggeredRef.current = true;
              observer.unobserve(entry.target);
              observer.disconnect();
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        },
        { root, rootMargin, threshold },
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [root, rootMargin, threshold, triggerOnce, cleanup],
  );

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return { ref, isVisible, entry };
}
