import { useState, useCallback } from "react";
import { CHATWOOT_CONSTANTS } from "../../config/constants";

interface RetryOptions {
  maxRetries?: number;
  backoffFactor?: number;
  initialDelay?: number;
}

/**
 * Hook to execute an async function with automatic retries and exponential backoff
 *
 * @param fetchFn - The async function to execute
 * @param options - Retry configuration options
 * @returns Object containing the execute function and current retry count
 */
export const useApiWithRetry = <T>(fetchFn: () => Promise<T>, options: RetryOptions = {}) => {
  const [retryCount, setRetryCount] = useState(0);
  const {
    maxRetries = CHATWOOT_CONSTANTS.MAX_RETRIES,
    backoffFactor = 2,
    initialDelay = CHATWOOT_CONSTANTS.RETRY_BACKOFF_MS,
  } = options;

  const execute = useCallback(async () => {
    let attempt = 0;
    let currentDelay = initialDelay;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const result = await fetchFn();
        // Reset retry count on success
        if (attempt > 0) {
          setRetryCount(0);
        }
        return result;
      } catch (error) {
        attempt++;
        setRetryCount(attempt);

        // If we've reached max retries, throw the error
        if (attempt > maxRetries) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, currentDelay));
        currentDelay *= backoffFactor;
      }
    }
  }, [fetchFn, maxRetries, backoffFactor, initialDelay]);

  return { execute, retryCount };
};
