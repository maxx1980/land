import { useEffect } from 'react';

/**
 * Locks or unlocks the body scroll by setting `overflow: hidden`
 * on the `<body>` element. Commonly used for modals and mobile menus.
 *
 * Restores the original overflow value on unmount or when `locked` changes.
 */
export function useLockedBody(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = original;
    };
  }, [locked]);
}
