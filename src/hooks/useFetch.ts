import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Return value of the {@link useFetch} hook.
 * @template T The shape of the parsed JSON response.
 */
export interface UseFetchResult<T> {
  /** The parsed response data, or `null` before the first successful fetch. */
  data: T | null;
  /** Human-readable error message, or `null` if there is no error. */
  error: string | null;
  /** `true` while the request is in-flight. */
  isLoading: boolean;
  /** Re-trigger the fetch manually. */
  refetch: () => void;
  /** Abort the current in-flight request. */
  abort: () => void;
}

/**
 * Declarative data-fetching hook.
 *
 * - Auto-fetches on mount and whenever `url` changes.
 * - Cancels the in-flight request on unmount or `url` change to prevent
 *   state updates on unmounted components.
 * - Exposes `refetch` for manual re-fetching and `abort` for cancellation.
 *
 * @template T Parsed JSON shape.
 * @param url The endpoint to fetch (passed directly to `fetch`).
 * @param options Standard `RequestInit`; merged with the internal signal.
 *
 * @example
 * ```tsx
 * const { data, isLoading, error } = useFetch<User[]>('/api/users');
 * ```
 */
export function useFetch<T = unknown>(
  url: string,
  options?: RequestInit,
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Keep track of the current AbortController and whether the component
  // is still mounted.
  const controllerRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  // Signal we use to detect unmount.  We increment a key to force
  // re-renders on `refetch`.
  const [, setFetchKey] = useState(0);

  const execute = useCallback(() => {
    // Abort any previous in-flight request
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetch(url, { ...options, signal: controller.signal })
      .then(async (response) => {
        if (!mountedRef.current) return;

        if (!response.ok) {
          let message = response.statusText;
          try {
            const body = (await response.json()) as Record<string, unknown>;
            if (typeof body.message === 'string') message = body.message;
          } catch {
            // Could not parse error body; keep statusText
          }
          throw new Error(message);
        }

        // Handle empty responses (204 No Content, etc.)
        const text = await response.text();
        if (!mountedRef.current) return;
        setData(text.length > 0 ? (JSON.parse(text) as T) : null);
      })
      .catch((err: unknown) => {
        if (!mountedRef.current) return;
        // Silently ignore abort errors — they're expected on unmount / url change
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      })
      .finally(() => {
        if (mountedRef.current) setIsLoading(false);
      });
  }, [url, options]);

  // Run fetch on mount and when url/options change
  useEffect(() => {
    mountedRef.current = true;
    execute();

    return () => {
      mountedRef.current = false;
      controllerRef.current?.abort();
    };
  }, [execute]);

  const refetch = useCallback(() => {
    setFetchKey((k) => k + 1); // triggers the effect above
  }, []);

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    if (mountedRef.current) setIsLoading(false);
  }, []);

  return { data, error, isLoading, refetch, abort };
}
