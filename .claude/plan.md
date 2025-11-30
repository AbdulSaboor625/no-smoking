# The New Way to Stop Smoking - Implementation Plan

## 📋 Project Overview

A comprehensive web application for smoking cessation using education, awareness, and daily commitment. Created by John Hopper, who smoked for 30 years and quit effortlessly.

**Core Philosophy**:
- Education → Awareness → One-Day Commitment → Track Progress → Celebrate Milestones
- No nicotine replacement products
- "One day at a time" mindset

---

## 🎯 Technology Stack (Final Decision)

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS (purple `#7B1FA2` + yellow `#F57F17` brand colors)
- React Router v6
- tRPC (end-to-end type safety)
- React Query (server state)
- Zustand (client state)
- React Hook Form + Zod validation
- Clerk (authentication)

### Backend
- Fastify + TypeScript (2-4x faster than Express)
- tRPC (type-safe API, no REST boilerplate)
- PostgreSQL 16 (Railway or cloud database)
- Drizzle ORM (lightweight, fastest)
- Clerk (authentication)
- Helmet + Rate Limiting (security)

### Project Structure
- **Monorepo**: pnpm workspaces + Turborepo
- **Apps**: `apps/backend` (Fastify), `apps/frontend` (React)
- **Packages**: `packages/shared-types` (Zod schemas + TypeScript types)

### Deployment
- **Hosting**: Railway (NOT Vercel)
- **Database**: PostgreSQL on Railway (NOT Supabase)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry

---

## 📊 Database Schema (8 Tables)

### 1. **profiles**
- Extends Clerk users
- Fields: id, username, avatarUrl, createdAt, updatedAt

### 2. **quit_attempts**
- User quit attempts
- Fields: id, userId, quitDate, productType, dailyUsage, cost, reasons[], triggers[], isActive
- Product types: cigarettes, vape_disposable, vape_refillable, pouches, dip, multiple

### 3. **progress_logs**
- Daily tracking
- Fields: id, quitAttemptId, logDate, cravingsCount, moodRating, notes

### 4. **trigger_logs**
- Trigger occurrences
- Fields: id, quitAttemptId, triggerType, intensity (1-5), location, copingStrategy, wasSuccessful, occurredAt, notes
- Trigger types: coffee, after_meals, driving, work, stress, boredom, social, before_bed, waking_up, alcohol, outside, phone, emotional

### 5. **slip_logs**
- Relapse tracking
- Fields: id, quitAttemptId, occurredAt, quantity, triggerType, circumstances, feelings, lessonLearned

### 6. **milestones**
- Achievement tracking
- Fields: id, quitAttemptId, milestoneType, achievedAt, celebrated, sharedPublicly
- Types: 1_hour, 3_hours, 6_hours, 12_hours, 24_hours, 2_days, 3_days, 7_days, 14_days, 21_days, 30_days, 60_days, 90_days, 180_days, 365_days

### 7. **user_settings**
- User preferences
- Fields: userId, notificationsEnabled, notificationTimes[], theme, currency, cigaretteCost, cigarettesPerDay

### 8. **education_progress**
- Lesson completion
- Fields: id, userId, moduleId, lessonId, completedAt

---

## 🔧 tRPC API Endpoints (25+)

### Quit Attempts
- `quitAttempts.create` - Start new quit attempt
- `quitAttempts.getActive` - Get current active attempt
- `quitAttempts.getAll` - Get all user attempts
- `quitAttempts.deactivate` - End quit attempt

### Progress Logs
- `progressLogs.create` - Log daily progress
- `progressLogs.getByAttempt` - Get progress history

### Trigger Logs
- `triggerLogs.create` - Log trigger occurrence
- `triggerLogs.getByAttempt` - Get all triggers
- `triggerLogs.getRecent` - Get recent triggers (limit 10)

### Slip Logs
- `slipLogs.create` - Log relapse
- `slipLogs.getByAttempt` - Get slip history

### Milestones
- `milestones.create` - Unlock milestone
- `milestones.getByAttempt` - Get achievements
- `milestones.markCelebrated` - Mark as celebrated

### Settings
- `settings.get` - Get user settings
- `settings.update` - Update preferences

### Education
- `education.complete` - Mark lesson complete
- `education.getProgress` - Get lesson progress

---

## 📚 App Features (From Specification)

### 1. **Onboarding Flow (8 Steps)**
1. Welcome screen
2. Product type selection (cigarettes, vape, pouches, dip, multiple)
3. Usage level (customized per product)
4. Trigger identification (multi-select: coffee, meals, driving, stress, etc.)
5. Reasons to quit
6. Fears assessment
7. Readiness slider (1-10)
8. Quit timing (today, tomorrow, within 3 days, learn first)

### 2. **Education Modules (5 Modules, 15+ Lessons)**

**Module 1: Understanding the Addiction**
- Lesson 1: This Is Not a Habit — It's an Addiction
- Lesson 2: Why You Light Up Without Thinking
- Lesson 3: What Nicotine Actually Does in Your Body
- Lesson 4: Why Most People Fail "Cold Turkey"

**Module 2: Breaking Automatic Behavior**
- Lesson 1: The Autopilot Loop
- Lesson 2: How Triggers Control You
- Lesson 3: How to Interrupt Any Craving
- Lesson 4: Awareness Breaks the Pattern

**Module 3: Preparing for Quit Day**
- Lesson 1: What to Expect on Quit Day
- Lesson 2: The 5-Minute Craving Rule
- Lesson 3: How to Handle Coffee, Meals & Driving
- Lesson 4: The Success Checklist

**Module 4: Becoming a Non-Smoker**
- Lesson 1: Identity Change Is the Goal
- Lesson 2: The Addiction Voice
- Lesson 3: Why Cravings Fade Over Time
- Lesson 4: The 90-Day Freedom Path

**Module 5: Staying Free**
- Lesson 1: Handling Stress Without Nicotine
- Lesson 2: Social Situations & Alcohol
- Lesson 3: Preventing Relapse Long-Term
- Lesson 4: Freedom for Life

### 3. **Daily Coaching System (365 Days)**
- Days 1-30: Custom messages (from spec)
- Days 31-365: Template-based messages
- Display "Today's Lesson" on dashboard based on days since quit

### 4. **Dashboard**
- Real-time streak counter (days, hours, minutes)
- Money saved calculator (multi-product support)
- Time freed up calculator
- Units avoided counter
- "Today's Commitment" button
- Streak display
- Today's coaching message

### 5. **Trigger Awareness System ("Caution Tape")**
- Trigger logging form (type, intensity, coping strategy, successful)
- Trigger timeline view
- Trigger-specific coaching for each type
- Success rate tracking
- Post-trigger reflection

### 6. **Emergency Help**
- 5-minute breathing exercises
- Urge surfing guidance
- Reality checks
- Countdown timer
- "I Beat This Craving" button
- "I Slipped" button → Relapse recovery flow

### 7. **Relapse Recovery (3 Screens)**
- Screen 1: "You Didn't Fail" encouragement
- Screen 2: Trigger analysis (what happened?)
- Screen 3: Reframe + quick recovery plan
- **NO Day 1 reset** - show "X days nicotine-free" + "Recent slips: Y"

### 8. **Milestones & Rewards**
- 15+ milestone badges (1h, 24h, 3d, 7d, 30d, 90d, 1yr, etc.)
- Celebration screens with health benefits
- Badge collection page
- Progress timeline

### 9. **Calculator Logic**
- Multi-product support (cigarettes, vape, pouches, dip)
- Money saved calculation
- Time freed calculation (minutes → hours → days)
- Units avoided calculation
- 5-year projection

### 10. **Web Notifications**
- Morning identity notifications
- Trigger warnings (coffee, meals, driving)
- Craving interruption messages
- Motivation messages
- Evening success messages
- Milestone celebrations

---

## ✅ COMPLETED (Phases 1-2)

### Phase 1: Foundation Setup ✅
- [x] Initialized pnpm monorepo with workspaces
- [x] Configured Turborepo for build orchestration
- [x] Created folder structure (apps/backend, apps/frontend, packages/shared-types)
- [x] Set up backend (Fastify + TypeScript)
- [x] Set up frontend (React + Vite + TypeScript)
- [x] Configured Tailwind CSS with brand colors (purple/yellow)
- [x] Created shared-types package with Zod schemas
- [x] Created README.md with setup instructions
- [x] Created .gitignore

**Files Created**:
- `package.json` (root)
- `pnpm-workspace.yaml`
- `turbo.json`
- `apps/backend/package.json`
- `apps/backend/tsconfig.json`
- `apps/backend/src/server.ts`
- `apps/frontend/package.json`
- `apps/frontend/tsconfig.json`
- `apps/frontend/vite.config.ts`
- `apps/frontend/tailwind.config.js`
- `apps/frontend/src/App.tsx`
- `apps/frontend/src/main.tsx`
- `apps/frontend/src/styles/globals.css`
- `packages/shared-types/package.json`
- `packages/shared-types/src/schemas.ts`
- `packages/shared-types/src/types.ts`
- `README.md`

### Phase 2: Backend Core + Database ✅
- [x] Created Drizzle ORM schema (8 tables)
- [x] Set up database connection
- [x] Created tRPC router with 25+ endpoints
- [x] Integrated tRPC into Fastify server
- [x] Added security (Helmet, CORS, Rate Limiting)
- [x] Updated .env.example for Railway PostgreSQL

**Files Created**:
- `apps/backend/drizzle.config.ts`
- `apps/backend/src/db/db.ts`
- `apps/backend/src/db/schema.ts`
- `apps/backend/src/trpc/context.ts`
- `apps/backend/src/trpc/trpc.ts`
- `apps/backend/src/trpc/router.ts`
- Updated `apps/backend/src/server.ts`

---

## 🚧 IN PROGRESS / NEXT STEPS

### Immediate Next Steps
1. Install dependencies: `pnpm install`
2. Set up Railway PostgreSQL database
3. Create `apps/backend/.env` with DATABASE_URL
4. Run migrations: `pnpm db:generate && pnpm db:migrate`
5. Test backend: `pnpm dev`

### Phase 3: Frontend tRPC Client Setup (Day 3)
- [ ] Create tRPC client configuration
- [ ] Set up React Query provider
- [ ] Create Zustand stores (auth, app, settings)
- [ ] Set up Clerk authentication
- [ ] Create layout templates (Dashboard, Auth, Onboarding)
- [ ] Build atomic components (Button, Input, Badge, Icon)

### Phase 4: Onboarding Flow (Days 5-6)
- [ ] Create 8-step quiz component with stepper
- [ ] Implement product type selection
- [ ] Build usage level questions (dynamic per product)
- [ ] Create trigger identification multi-select
- [ ] Add reasons to quit + fears assessment
- [ ] Implement readiness slider
- [ ] Create quit timing selector
- [ ] Save quiz data to database via tRPC
- [ ] Show dashboard preview
- [ ] Write E2E test for quiz flow

### Phase 5: Dashboard & Tracking (Days 7-8)
- [ ] Create dashboard layout
- [ ] Build real-time streak counter (useTimer hook)
- [ ] Implement money saved calculator
- [ ] Build time freed up calculator
- [ ] Create units avoided counter
- [ ] Add "Today's Commitment" button
- [ ] Display current streak
- [ ] Show today's coaching message
- [ ] Create "My Quit Stats" page
- [ ] Build cost breakdown visualization
- [ ] Add time breakdown visualization
- [ ] Show 5-year projection
- [ ] Implement Server-Sent Events (SSE) for real-time updates
- [ ] Write unit tests for calculations

### Phase 6: Education & Coaching (Days 9-10)
- [ ] Create education content structure (5 modules, 15+ lessons)
- [ ] Build lesson viewer component
- [ ] Add lesson navigation
- [ ] Track lesson completion
- [ ] Create 365-day coaching message library
- [ ] Implement "Today's Lesson" display
- [ ] Build Web Notifications integration
- [ ] Add notification scheduling system

### Phase 7: Trigger System & Emergency Help (Days 11-12)
- [ ] Build trigger logging form
- [ ] Create trigger timeline view
- [ ] Implement trigger-specific coaching
- [ ] Add trigger success rate tracking
- [ ] Build post-trigger reflection flow
- [ ] Create emergency help page
- [ ] Build 5-minute breathing exercises
- [ ] Implement urge surfing guidance
- [ ] Add craving countdown timer
- [ ] Create "I Beat This Craving" / "I Slipped" buttons
- [ ] Build 3-screen relapse recovery flow
- [ ] Implement momentum-based tracking (no Day 1 reset)

### Phase 8: Milestones & Rewards (Day 13)
- [ ] Define 15+ milestone triggers
- [ ] Create milestone detection logic
- [ ] Build badge unlock system
- [ ] Design celebration screens
- [ ] Implement milestone timeline view
- [ ] Add badge collection page
- [ ] Write E2E test for milestone achievement

### Phase 9: Testing Infrastructure (Day 14)
- [ ] Set up Vitest configuration
- [ ] Set up Playwright configuration
- [ ] Write unit tests (utils, hooks - 80%+ coverage)
- [ ] Write component tests (forms, cards - 70%+ coverage)
- [ ] Write E2E tests (auth, quiz, dashboard, milestones)
- [ ] Configure coverage reporting
- [ ] Set up GitHub Actions workflows
- [ ] Configure branch protection

### Phase 10: Deployment & Production (Day 15)
- [ ] Create Railway project
- [ ] Configure Railway services (backend, frontend, PostgreSQL)
- [ ] Set environment variables
- [ ] Set up automated PostgreSQL backups
- [ ] Configure Sentry error tracking
- [ ] Add service worker for offline support
- [ ] Create PWA manifest with brand icons
- [ ] Configure offline queue (IndexedDB)
- [ ] Add loading states and error boundaries
- [ ] Optimize bundle size (code splitting, lazy loading)
- [ ] Test accessibility (WCAG AA compliance)
- [ ] Final E2E test run
- [ ] Deploy to production

---

## 🤖 Claude Agents Plan

### Backend Agent
**Responsibilities**:
- Design PostgreSQL schema ✅
- Create Drizzle ORM schemas ✅
- Implement tRPC router ✅
- Set up authentication middleware (Clerk) ⏳
- Add rate limiting & security headers ✅
- Create seed data ⏳

### Testing Agent
**Responsibilities**:
- Configure Vitest + React Testing Library
- Configure Playwright for E2E
- Write unit tests (80%+ coverage)
- Write component tests (70%+ coverage)
- Write E2E tests (critical paths)
- Set up coverage reporting

### GitHub Agent
**Responsibilities**:
- Set up GitHub repo
- Create branch protection rules
- Create PR template
- Set up GitHub Actions workflows (test, deploy, e2e)
- Configure Railway GitHub integration
- Set up environment secrets

### Deployment Agent
**Responsibilities**:
- Create Railway project
- Configure 3 services (backend, frontend, PostgreSQL)
- Set environment variables
- Configure custom domain (optional)
- Set up automated PostgreSQL backups
- Configure Sentry error tracking
- Add monitoring alerts

---

## 📝 Content to Create

### Education Module Content
- Module 1: 4 lessons (full text from spec)
- Module 2: 4 lessons (full text from spec)
- Module 3: 4 lessons (full text from spec)
- Module 4: 4 lessons (full text from spec)
- Module 5: 4 lessons (full text from spec)

### Daily Coaching Messages
- Days 1-30: Custom messages (provided in spec)
- Days 31-365: Template-based generation

### Milestone Definitions
- 15+ milestones with descriptions and health benefits

### Notification Templates
- Morning identity messages
- Trigger warning messages (per trigger type)
- Craving interruption messages
- Motivation messages
- Evening success messages
- Milestone celebration messages

---

## 💰 Estimated Costs (Monthly)

### 0-1,000 users
- Railway: $15-20/month
- Clerk: Free (up to 10K MAUs)
- Sentry: Free (5K errors/month)
- **Total**: $15-20/month

### 1,000-10,000 users
- Railway: $30-50/month
- Clerk: $25/month (after 10K users)
- Sentry: Free
- **Total**: $55-75/month

---

## 🎯 Success Metrics

### Technical KPIs
- Test coverage: 80%+ (statements, functions), 75%+ (branches)
- Lighthouse score: 90+ (all categories)
- Core Web Vitals: All green
- Uptime: 99.9%+
- Response time: < 200ms (p95)
- Error rate: < 0.1%

### User KPIs (post-launch)
- 7-day retention: 60%+
- 30-day retention: 40%+
- 90-day retention: 25%+
- Average streak: 14+ days
- Milestone achievement rate: 70%+ (24-hour milestone)
- Slip recovery rate: 60%+ (users who continue after slip)

---

## 📅 Timeline Summary

- **Days 1-2**: Foundation & Backend Core ✅ DONE
- **Day 3**: Frontend Setup & tRPC Client
- **Day 4**: Authentication (Clerk)
- **Days 5-6**: Onboarding Flow (8-step quiz)
- **Days 7-8**: Dashboard & Tracking
- **Days 9-10**: Education & Coaching
- **Days 11-12**: Triggers & Emergency Help
- **Day 13**: Milestones & Rewards
- **Day 14**: Testing Infrastructure
- **Day 15**: Deployment & Production

**Total**: 15 days for full MVP

---

## 🔗 Important Links

- **Repository**: (GitHub URL to be added)
- **Backend API**: http://localhost:3000 (dev)
- **Frontend**: http://localhost:5173 (dev)
- **Production**: (Railway URL to be added)
- **Figma/Design**: (if applicable)

---

## 📌 Notes & Decisions

1. **No Docker** - Using Railway PostgreSQL directly (no local Docker setup)
2. **No Supabase** - Using custom Fastify backend + Drizzle ORM
3. **No Vercel** - Using Railway for both frontend and backend
4. **tRPC over REST** - End-to-end type safety, less boilerplate
5. **Monorepo** - Easier to share types, atomic commits
6. **Clerk for Auth** - Better DX than DIY JWT, affordable pricing
7. **SSE for Real-time** - Simpler than WebSockets for one-way updates
8. **Drizzle over Prisma** - Faster, lighter, better for Railway

---

**Last Updated**: 2025-11-17
**Current Phase**: Phase 2 Complete, Starting Phase 3
**Next Task**: Install dependencies and set up Railway PostgreSQL
