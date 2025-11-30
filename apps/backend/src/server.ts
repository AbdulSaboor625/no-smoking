import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import fastifyStatic from '@fastify/static';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, readdirSync } from 'fs';
import 'dotenv/config';

import { appRouter } from './trpc/router.js';
import { createContext } from './trpc/context.js';
import { authRoutes } from './routes/auth.js';
import { authMiddleware } from './middleware/auth.js';
import { stripeWebhookRoutes } from './routes/stripe-webhook.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

// Security headers
await fastify.register(helmet, {
  contentSecurityPolicy: false, // Disable for development, configure in production
});

// CORS - Allow requests from multiple origins
await fastify.register(cors, {
  origin: (origin, callback) => {
    // Allow requests with no origin (same-origin, mobile apps, Postman, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    // In production on Railway, allow the production domain
    const productionDomains = [
      'https://smoking-quit-production.up.railway.app',
      'http://smoking-quit-production.up.railway.app'
    ];

    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      ...productionDomains,
      process.env.FRONTEND_URL,
    ].filter((url): url is string => Boolean(url)); // Remove undefined values

    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
});

// Rate limiting
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '15 minutes',
});

// Register authentication middleware
fastify.decorate('authenticate', authMiddleware);

// Auth routes
await fastify.register(authRoutes);

// Stripe webhook routes (must be before body parser plugins)
await fastify.register(stripeWebhookRoutes);

// tRPC Plugin
await fastify.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }: { path?: string; error: Error }) {
      console.error(`❌ tRPC Error on ${path}:`, error);
    },
  },
});

// Health check
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API status route (moved to /api/status to not conflict with frontend)
fastify.get('/api/status', async () => {
  return { status: 'ok', message: 'Backend API is running' };
});

// Serve frontend static files
// Try multiple possible paths for frontend dist
const possiblePaths = [
  join(__dirname, '../public'),                     // From backend/dist to backend/public (Railway copy)
  join(process.cwd(), 'public'),                    // From backend/ to public/
  join(__dirname, '../../frontend/dist'),           // From backend/dist to frontend/dist
  join(process.cwd(), '../frontend/dist'),          // From backend/ to frontend/dist
  join(process.cwd(), 'apps/frontend/dist'),        // From repo root
];

const frontendDistPath = possiblePaths.find(path => existsSync(path));

if (frontendDistPath) {
  console.log(`📁 Serving frontend from: ${frontendDistPath}`);

  // List the actual contents to verify files are there
  const assetsPath = join(frontendDistPath, 'assets');
  if (existsSync(assetsPath)) {
    console.log(`📂 Assets directory contents:`, readdirSync(assetsPath));
  } else {
    console.log(`⚠️ Assets directory not found at: ${assetsPath}`);
  }

  // Register static plugin to serve built frontend files
  await fastify.register(fastifyStatic, {
    root: frontendDistPath,
    prefix: '/',
  });

  // Add a hook to log all requests for debugging
  fastify.addHook('onRequest', async (request, _reply) => {
    if (request.url.startsWith('/assets/')) {
      console.log(`🔍 Asset request: ${request.url}`);
      console.log(`   Looking in: ${frontendDistPath}`);
    }
  });

  // Fallback to index.html for client-side routing (SPA)
  // This handles routes like /dashboard, /onboarding, etc.
  fastify.setNotFoundHandler((request, reply) => {
    const url = request.url;
    console.log(`🔍 NotFoundHandler checking: ${url}`);

    // Let static assets 404 naturally - don't send index.html for them
    if (url.startsWith('/assets/') || url.includes('.')) {
      console.log(`❌ Asset not found: ${url}`);
      reply.code(404).send({ error: 'File not found' });
      return;
    }

    // For all other routes (SPA client-side routing), serve index.html
    // But NOT for API endpoints
    if (!url.startsWith('/trpc') && !url.startsWith('/auth') && !url.startsWith('/health') && !url.startsWith('/webhooks') && !url.startsWith('/api')) {
      console.log(`📄 Serving index.html for SPA route: ${url}`);
      reply.sendFile('index.html');
    } else {
      reply.code(404).send({ error: 'Not Found' });
    }
  });
} else {
  console.warn('⚠️  Frontend dist folder not found. API-only mode.');
  console.warn(`   Tried paths: ${possiblePaths.join(', ')}`);
  console.warn(`   __dirname: ${__dirname}`);
  console.warn(`   cwd: ${process.cwd()}`);
}

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`🚀 Server running at http://${host}:${port}`);
    console.log(`📡 tRPC endpoint: http://${host}:${port}/trpc`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
