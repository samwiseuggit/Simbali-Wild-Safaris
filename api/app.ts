import { Hono } from 'hono';
import { trpcServer } from '@trpc/server/adapters/fetch';
import { chatRouter } from './chat';

const app = new Hono();

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// tRPC endpoint
app.use('/api/trpc/*', async (c) => {
  return trpcServer({
    router: chatRouter,
    createContext: () => ({ req: c.req }),
  })(c);
});

export default app;
