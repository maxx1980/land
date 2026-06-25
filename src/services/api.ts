/**
 * API Response wrapper returned by all API calls.
 * @template T The shape of the successful payload.
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request completed successfully (HTTP 2xx). */
  success: boolean;
  /** The parsed response body on success. */
  data?: T;
  /** A human-readable message from the server. */
  message?: string;
  /** Field-level validation errors (keyed by field name). */
  errors?: Record<string, string>;
}

/**
 * Structured error produced by {@link apiRequest}.
 */
export interface ApiError {
  /** Machine-readable error code. */
  code: 'NETWORK_ERROR' | 'TIMEOUT' | 'SERVER_ERROR' | 'VALIDATION_ERROR' | 'UNKNOWN';
  /** Human-readable description. */
  message: string;
  /** HTTP status code when the server responded. */
  status?: number;
}

/**
 * Options for {@link apiRequest}, extending the standard `RequestInit`.
 * Provides a **timeout** (default 10 000 ms) and JSON-friendly defaults.
 */
export interface RequestOptions extends RequestInit {
  /**
   * Request timeout in milliseconds.
   * @default 10000
   */
  timeout?: number;
}

const DEFAULT_TIMEOUT = 10_000;

function buildApiError(
  code: ApiError['code'],
  message: string,
  status?: number,
): ApiError {
  return { code, message, status };
}

/**
 * Thin wrapper around `fetch` that:
 * - Sets `Content-Type: application/json` automatically.
 * - Adds a configurable timeout via {@link AbortSignal.timeout}.
 * - Parses JSON responses.
 * - Normalises errors into typed {@link ApiError} codes.
 *
 * Always returns an {@link ApiResponse}. Callers should inspect
 * `response.success` rather than catching.
 *
 * @example
 * ```ts
 * const res = await apiRequest<{ ok: boolean }>('/api/health');
 * if (res.success) console.log(res.data.ok);
 * ```
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const { timeout = DEFAULT_TIMEOUT, headers, ...rest } = options;

  // Build an AbortSignal that fires on timeout or an external signal.
  const controller = new AbortController();
  const signal = AbortSignal.any([
    controller.signal,
    AbortSignal.timeout(timeout),
  ]);

  try {
    const response = await fetch(endpoint, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      signal,
    });

    // -----------------------------------------------------------------------
    // Success
    // -----------------------------------------------------------------------
    if (response.ok) {
      try {
        const data = (await response.json()) as T;
        return { success: true, data };
      } catch {
        // The body may be empty (204, etc.) — that's still success.
        return { success: true };
      }
    }

    // -----------------------------------------------------------------------
    // Server responded with an error status
    // -----------------------------------------------------------------------
    let serverMessage = response.statusText;
    let serverErrors: Record<string, string> | undefined;

    try {
      const body = (await response.json()) as Record<string, unknown>;
      if (typeof body.message === 'string') serverMessage = body.message;
      if (typeof body.errors === 'object' && body.errors !== null) {
        serverErrors = body.errors as Record<string, string>;
      }
    } catch {
      // Could not parse the error body — fall back to status text.
    }

    return {
      success: false,
      message: serverMessage,
      errors: serverErrors,
    };
  } catch (error: unknown) {
    // -----------------------------------------------------------------------
    // Network / timeout errors
    // -----------------------------------------------------------------------
    if (error instanceof DOMException && error.name === 'AbortError') {
      // Distinguish our own timeout from an external abort
      if (controller.signal.aborted) {
        // Aborted externally — re-throw so the caller can handle it
        throw buildApiError('TIMEOUT', 'Request timed out', undefined);
      }
      // Aborted by the caller via AbortController — let it propagate
      throw error;
    }

    if (error instanceof TypeError) {
      // Typically a network error (no connection / CORS)
      return {
        success: false,
        message: 'Network error — please check your connection',
      };
    }

    // Truly unknown
    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}
