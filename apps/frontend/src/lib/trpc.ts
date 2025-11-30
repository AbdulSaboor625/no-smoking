import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../../backend/src/trpc/router';

// Create tRPC React hooks
export const trpc = createTRPCReact<AppRouter>();

// Get API URL from environment
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Browser: use environment variable or relative URL for dev
    return import.meta.env.VITE_API_URL || '';
  }
  // SSR: use absolute URL
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window === 'undefined') return null;

  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) return null;

    const { state } = JSON.parse(authStorage);
    return state?.token || null;
  } catch {
    return null;
  }
};

// Create tRPC client
export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/trpc`,
      async headers() {
        const token = getAuthToken();
        return {
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        };
      },
    }),
  ],
});
