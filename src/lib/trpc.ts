import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
import type { ChatRouter } from '../../api/chat';

export const trpc = createTRPCReact<ChatRouter>();

export function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  return process.env.API_URL || 'http://localhost:3001';
}

export function createTRPCClient() {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
      }),
    ],
  });
}
