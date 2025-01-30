import { QueryClient } from "@tanstack/react-query";
import { FetchError } from "ofetch";

const STALE_TIME_SECONDS = 10;
const STALE_TIME = STALE_TIME_SECONDS * 1000;
const MAX_RETRY_ATTEMPTS = 3;

const shouldRetryQuery = (error: unknown): boolean => {
  if (error instanceof FetchError) {
    // Don't retry for specific error cases
    if (error.statusCode === undefined) return false;
    if (error.statusCode >= 400 && error.statusCode < 500) return false;
  }
  return true;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      refetchOnWindowFocus: false,
      retryDelay: 1000,
      retry(failureCount, error) {
        // Use proper error logging service in production
        if (process.env.NODE_ENV === "development") {
          console.error(error);
        }
        return failureCount < MAX_RETRY_ATTEMPTS && shouldRetryQuery(error);
      },
    },
  },
});

export { queryClient };
