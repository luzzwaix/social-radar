import { useCallback, useEffect, useRef, useState } from "react";
import { getAdvice } from "../api/advice.js";

export function useAdvice(payload, options = {}) {
  const { enabled = true, debounceMs = 250, autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && autoFetch && payload));
  const [error, setError] = useState(null);
  const requestIdRef = useRef(0);
  const payloadRef = useRef(payload);

  useEffect(() => {
    payloadRef.current = payload;
  }, [payload]);

  const refetch = useCallback(
    async (overridePayload = payloadRef.current) => {
      if (!enabled) {
        return null;
      }

      const nextRequestId = requestIdRef.current + 1;
      requestIdRef.current = nextRequestId;
      setLoading(true);
      setError(null);

      try {
        const result = await getAdvice(overridePayload);
        if (requestIdRef.current === nextRequestId) {
          setData(result);
        }
        return result;
      } catch (nextError) {
        if (requestIdRef.current === nextRequestId) {
          setError(nextError);
        }
        throw nextError;
      } finally {
        if (requestIdRef.current === nextRequestId) {
          setLoading(false);
        }
      }
    },
    [enabled]
  );

  useEffect(() => {
    if (!enabled || !autoFetch || !payload) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      refetch(payload).catch(() => {
        // Error state is already captured above.
      });
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [autoFetch, debounceMs, enabled, payload, refetch]);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
}

