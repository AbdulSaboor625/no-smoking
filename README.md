# The New Way to Stop Smoking

> A comprehensive web application to help people quit smoking, vaping, and other nicotine products using education, awareness, and daily commitment.

## 🎯 Overview

This is a full-stack TypeScript monorepo application built with modern web technologies:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Fastify + TypeScript + tRPC
- **Database**: PostgreSQL 16 (via Docker) + Drizzle ORM
- **Authentication**: Clerk
- **Deployment**: Railway

## 📁 Project Structure

```
smoking-quit/
├── apps/
│   ├── backend/          # Fastify API server
│   └── frontend/         # React SPA
├── packages/
│   └── shared-types/     # Shared TypeScript types & Zod schemas
├── db/
│   └── seeds/            # Database seed data
├── tests/
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── docker-compose.yml    # PostgreSQL container
├── turbo.json            # Turborepo configuration
└── pnpm-workspace.yaml   # pnpm workspace config
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: >= 20.0.0
- **pnpm**: >= 9.0.0
- **Docker**: For running PostgreSQL locally

### Installation

1. **Clone the repository** (or you're already here!)

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start PostgreSQL**:
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**:

   **Backend** (`apps/backend/.env`):
   ```bash
   cp apps/backend/.env.example apps/backend/.env
   ```

   Edit `apps/backend/.env` and add your configuration.

   **Frontend** (`apps/frontend/.env.local`):
   ```bash
   # Create .env.local file
   echo "VITE_API_URL=http://localhost:3000" > apps/frontend/.env.local
   echo "VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key" >> apps/frontend/.env.local
   ```

5. **Run database migrations** (once database schema is created):
   ```bash
   pnpm db:migrate
   ```

6. **Seed the database** (optional):
   ```bash
   pnpm db:seed
   ```

7. **Start development servers**:
   ```bash
   pnpm dev
   ```

   This will start:
   - Backend API: http://localhost:3000
   - Frontend: http://localhost:5173

## 📝 Available Scripts

### Root Commands

- `pnpm dev` - Start all apps in development mode
- `pnpm build` - Build all apps for production
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all code
- `pnpm type-check` - TypeScript type checking
- `pnpm db:migrate` - Run database migrations
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Drizzle Studio (database GUI)

### Backend Commands

```bash
cd apps/backend

pnpm dev          # Start dev server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server
pnpm type-check   # TypeScript check
pnpm lint         # ESLint
```

### Frontend Commands

```bash
cd apps/frontend

pnpm dev          # Start Vite dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm type-check   # TypeScript check
pnpm lint         # ESLint
```

## 🗄️ Database

### PostgreSQL via Docker

The project uses PostgreSQL 16 in a Docker container. Configuration is in `docker-compose.yml`.

**Database Credentials** (development):
- Host: `localhost`
- Port: `5432`
- Database: `smoking_quit`
- User: `dev`
- Password: `dev_password`

### Drizzle ORM

We use Drizzle ORM for type-safe database access.

**Important commands**:
- `pnpm db:generate` - Generate migration files
- `pnpm db:migrate` - Apply migrations to database
- `pnpm db:studio` - Open database GUI at http://localhost:4983

## 🎨 Tech Stack Details

### Frontend

- **React 18**: Modern React with hooks
- **TypeScript**: Type safety throughout
- **Vite**: Lightning-fast dev server and build tool
- **Tailwind CSS**: Utility-first CSS framework (purple/yellow brand colors)
- **React Router**: Client-side routing
- **tRPC**: End-to-end type-safe API calls
- **React Query**: Server state management
- **Zustand**: Client state management
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Clerk**: Authentication

### Backend

- **Fastify**: High-performance Node.js web framework (2-4x faster than Express)
- **TypeScript**: Type safety
- **tRPC**: Type-safe API without code generation
- **Drizzle ORM**: Lightweight, performant ORM
- **PostgreSQL**: Relational database
- **Clerk**: Authentication
- **Helmet**: Security headers
- **Rate Limiting**: API protection

### DevOps

- **Turborepo**: Monorepo build system with caching
- **pnpm**: Fast, efficient package manager
- **Docker**: Containerization (PostgreSQL)
- **Railway**: Deployment platform
- **GitHub Actions**: CI/CD pipelines
- **Vitest**: Unit testing
- **Playwright**: End-to-end testing

## 🔧 Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with hot reload running:
   ```bash
   pnpm dev
   ```

3. **Type check and lint**:
   ```bash
   pnpm type-check
   pnpm lint
   ```

4. **Run tests**:
   ```bash
   pnpm test
   ```

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## 🧪 Testing

- **Unit Tests**: Vitest for utility functions and calculations
- **Component Tests**: React Testing Library
- **E2E Tests**: Playwright for critical user flows

```bash
pnpm test               # Run all tests
pnpm test:unit          # Unit tests only
pnpm test:e2e           # E2E tests only
pnpm test:coverage      # With coverage report
```

## 🚢 Deployment

The app is configured for deployment on **Railway**.

### Railway Setup

1. Create Railway account
2. Connect GitHub repository
3. Railway auto-detects monorepo structure
4. Configure environment variables
5. Deploy!

See deployment documentation in `/docs/deployment.md` (coming soon).

## 🌈 Brand Colors

The app uses a purple and yellow color scheme:

- **Primary (Yellow)**: `#F57F17`
- **Secondary (Purple)**: `#7B1FA2`

Configured in `apps/frontend/tailwind.config.js`.

## 📚 Documentation

- [API Documentation](./docs/api.md) - Coming soon
- [Database Schema](./docs/database.md) - Coming soon
- [Component Guide](./docs/components.md) - Coming soon

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines first.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**John Hopper** - Former smoker for 30 years, quit effortlessly with the right approach

---

**Built with ❤️ to help people break free from nicotine addiction**
# no-smoking
