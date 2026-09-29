import { QueryClient } from '@tanstack/react-query';
import { logger } from '@core/logging/MFLogger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:                2,
      staleTime:            30_000,
      gcTime:               5 * 60_000,
      refetchOnWindowFocus: false,
    },
  },
});
