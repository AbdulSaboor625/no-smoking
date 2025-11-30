# Copilot Instructions: Smoking Quit App

## Architecture Overview

**Monorepo Structure**: Turborepo with pnpm workspaces managing 3 packages:
- `apps/backend`: Fastify + tRPC API server
- `apps/frontend`: React + Vite SPA
- `packages/shared-types`: Shared Zod schemas and TypeScript types

**Key Design Decisions**:
- **End-to-end type safety**: tRPC provides type inference from backend to frontend without code generation
- **Single source of truth**: Zod schemas in `packages/shared-types/src/schemas.ts` define validation and types
- **Authentication flow**: JWT-based auth (transitioning to Clerk) with middleware in `apps/backend/src/middleware/auth.ts`
- **Database pattern**: Drizzle ORM with schema-first design (`apps/backend/src/db/schema.ts`)

## Critical Developer Workflows

### Starting Development
```bash
# From root - starts both frontend and backend
pnpm dev

# Or separately:
cd apps/backend && pnpm dev    # Port 3000
cd apps/frontend && pnpm dev   # Port 5173
```

### Database Operations
```bash
# Generate migrations from schema changes
cd apps/backend && pnpm db:generate

# Apply migrations (uses push for dev)
pnpm db:migrate

# Open Drizzle Studio GUI
pnpm db:studio  # http://localhost:4983
```

### Type Checking Across Workspace
```bash
pnpm type-check  # Turbo runs all type checks in parallel
```

## Project-Specific Patterns

### tRPC Router Structure
Routes are organized by domain in `apps/backend/src/trpc/router.ts` using nested routers:
```typescript
export const appRouter = router({
  quitAttempts: router({
    create: protectedProcedure.input(schema).mutation(...),
    getActive: protectedProcedure.query(...),
  }),
  progressLogs: router({ ... }),
});
```

**Always use `protectedProcedure`** for authenticated endpoints (throws `UNAUTHORIZED` if no `ctx.userId`).

### Frontend API Calls
```typescript
// Import shared schemas for input validation
import { createQuitAttemptSchema } from '@smoking-quit/shared-types';

// Use tRPC hooks - NOT fetch or axios
const createMutation = trpc.quitAttempts.create.useMutation();
const { data } = trpc.quitAttempts.getActive.useQuery();
```

### Database Schema Conventions
- All tables use UUIDs except `profiles.id` (Clerk user ID is varchar)
- Foreign keys cascade on delete
- JSONB columns typed with `.$type<T>()`: `jsonb('triggers').$type<string[]>()`
- Timestamps always include timezone: `timestamp('created_at', { withTimezone: true })`

### State Management Split
- **Server state**: React Query (via tRPC) - preferred for all backend data
- **Client state**: Zustand stores in `apps/frontend/src/stores/`
  - `authStore.ts`: User authentication state (persisted)
  - `appStore.ts`: UI state, modals, navigation
  - `settingsStore.ts`: User preferences

### Component Organization
**Modified Atomic Design** in `apps/frontend/src/components/`:
- `atoms/`: Basic building blocks (currently empty - use `ui/` instead)
- `ui/`: shadcn/ui components (Button, Card, Dialog, etc.)
- `layout/`: App structure (AppShell, Header, Sidebar)
- `molecules/`: Composite components
- `organisms/`: Complex features
- `pages/`: Route components (imported in `router.tsx`)

**Prefer `ui/` for primitives** - atoms folder exists for future custom components.

### Environment Variables
Backend requires `.env` file (see `apps/backend/.env.example`):
- `DATABASE_URL`: Postgres connection string
- `JWT_SECRET`: For token signing (dev: any string, prod: secure random)
- `FRONTEND_URL`: CORS origin (default: `http://localhost:5173`)
- `PORT`: API port (default: 3000)

Frontend uses Vite env vars in `.env.local`:
- `VITE_API_URL`: Backend URL (default: `http://localhost:3000`)
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk auth key

## Integration Points

### Shared Types Flow
1. Define Zod schema in `packages/shared-types/src/schemas.ts`
2. Export inferred type: `export type CreateQuitAttempt = z.infer<typeof createQuitAttemptSchema>`
3. Import in backend router for `.input()` validation
4. Type automatically flows to frontend tRPC hooks

### Database → API → Frontend
```
schema.ts (Drizzle) → router.ts (tRPC) → frontend (React Query hooks)
                          ↑
                   shared-types (Zod)
```

### Authentication Middleware
Context creation in `apps/backend/src/trpc/context.ts` extracts JWT from `Authorization: Bearer <token>`:
- Sets `ctx.userId` if valid token
- `protectedProcedure` checks for `ctx.userId` and throws if missing
- Frontend should include token in tRPC client headers (currently using cookies)

## Common Gotchas

1. **Import paths**: Frontend uses `@/` alias for `src/` directory (configured in `vite.config.ts`)
2. **Postgres via Docker**: Must run `docker-compose up -d` before backend starts (connection to `localhost:5432`)
3. **Turbo caching**: Build outputs cached by Turborepo - use `pnpm build --force` to bypass
4. **Type errors after schema changes**: Run `pnpm type-check` from root to catch all instances
5. **tRPC router types**: Import `AppRouter` type from backend for frontend client setup (see `apps/frontend/src/lib/trpc.ts`)
