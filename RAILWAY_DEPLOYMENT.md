# Railway Deployment Guide

This guide will help you deploy your smoking cessation app to Railway.

## 🚨 IMPORTANT: Monorepo Configuration

**This is a monorepo!** You can either:
- Run **backend and frontend in a single Railway service** (recommended for simplicity), or
- Run **separate services** for backend and frontend.

For a **single service** setup:
- **Service Root Directory**: the **repo root** (`.`)
- The Nixpacks plan (`nixpacks.toml`) builds:
  - `@smoking-quit/shared-types`
  - `@smoking-quit/frontend`
  - `@smoking-quit/backend`
  - then copies `apps/frontend/dist` into `apps/backend/public` for Fastify to serve.

For a **two-service** setup:
- **Backend Root Directory**: `apps/backend`
- **Frontend Root Directory**: `apps/frontend`

Without setting the Root Directory correctly, Railway can fail to build with "No start command could be found".

## Quick Start (TL;DR)

1. Create new Railway project from your GitHub repo
2. Decide on **single service** (simpler) vs **two services**
3. For **single service**:
   - Set Root Directory to `.` (repo root)
   - Build Command: `pnpm install --frozen-lockfile && pnpm build`
   - Start Command: `cd apps/backend && pnpm start`
4. For **two services**, follow the detailed sections below.
5. Add PostgreSQL database
6. Add environment variables (see templates in `.env.example` files)
7. Deploy!

## Project Structure

This is a monorepo with two deployable services:
- **Backend**: Fastify + tRPC API (`apps/backend`)
- **Frontend**: React + Vite SPA (`apps/frontend`)

## Prerequisites

1. [Railway account](https://railway.app/)
2. Railway CLI (optional but recommended): `npm i -g @railway/cli`
3. PostgreSQL database (can be provisioned on Railway)

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended for beginners)

#### Deploy Backend

1. **Create New Project**
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **⚠️ CRITICAL: Configure Backend Service Root Directory**
   - Click on the created service
   - Go to "Settings" tab
   - Scroll to **"Service"** section
   - Find **"Root Directory"** field
   - Enter: `apps/backend` (this is REQUIRED for monorepos!)
   - Click "Save" or the changes will auto-save
   - **Optional**: You can also set custom build/start commands:
     - **Build Command**: `pnpm install --frozen-lockfile && pnpm build`
     - **Start Command**: `pnpm start`
   - Railway will automatically redeploy

3. **Add PostgreSQL Database**
   - In your project, click "New"
   - Select "Database" → "Add PostgreSQL"
   - Railway will automatically create a `DATABASE_URL` variable

4. **Set Environment Variables**
   - Go to your backend service → "Variables"
   - Add these variables:
     ```
     NODE_ENV=production
     PORT=3000
     HOST=0.0.0.0
     JWT_SECRET=<generate-a-secure-random-string>
     FRONTEND_URL=<will-add-after-frontend-deployment>
     ```
   - The `DATABASE_URL` should be automatically added by Railway

5. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

#### Deploy Frontend

1. **Add New Service**
   - In the same project, click "New" → "GitHub Repo"
   - Select the same repository
   - Name it "frontend"

2. **⚠️ CRITICAL: Configure Frontend Service Root Directory**
   - Go to "Settings" tab
   - Scroll to **"Service"** section
   - Find **"Root Directory"** field
   - Enter: `apps/frontend` (this is REQUIRED for monorepos!)
   - Click "Save" or the changes will auto-save
   - **Optional**: You can also set custom build/start commands:
     - **Build Command**: `pnpm install --frozen-lockfile && pnpm build`
     - **Start Command**: `pnpm preview`
   - Railway will automatically redeploy

3. **Set Environment Variables**
   - Go to Variables tab
   - Add:
     ```
     VITE_API_URL=<your-backend-url-from-step-5>
     VITE_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
     ```

4. **Update Backend CORS**
   - Go back to backend service → Variables
   - Update `FRONTEND_URL` with your frontend URL

5. **Redeploy Both Services**
   - Trigger redeployment of both services to apply new environment variables

### Option 2: Deploy via Railway CLI

```bash
# Login to Railway
railway login

# Link to your project (or create new)
railway link

# Deploy backend
cd apps/backend
railway up --service backend

# Deploy frontend
cd ../frontend
railway up --service frontend
```

## Configuration Files Explained

### `nixpacks.toml` (Backend)
Tells Railway/Nixpacks how to build your Node.js app with pnpm in a monorepo.

### `railway.toml`
Railway-specific configuration for health checks and deployment settings.

### `.railwayignore`
Excludes Python files and unnecessary directories from Railway builds.

## Database Setup

After deploying the backend:

1. **Run Migrations**
   ```bash
   railway run --service backend pnpm db:migrate
   ```

2. **Seed Database (Optional)**
   ```bash
   railway run --service backend pnpm db:seed
   ```

## Troubleshooting

### Build fails with Python detection
- Ensure `.railwayignore` is in the root directory
- Check that Root Directory is set correctly in Railway settings

### pnpm not found
- Make sure `nixpacks.toml` includes pnpm setup
- Check build logs for errors

### Database connection fails
- Verify `DATABASE_URL` is set correctly
- Ensure PostgreSQL service is running
- Check that your connection string format is correct

### CORS errors
- Verify `FRONTEND_URL` matches your actual frontend URL
- Check that frontend is making requests to the correct backend URL

### Health check fails
- Check logs: `railway logs --service backend`
- Verify the app is listening on `0.0.0.0:$PORT`
- Ensure health endpoint `/health` returns 200 status

## Environment Variables Checklist

### Backend
- [ ] `PORT` (automatically set by Railway)
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (automatically set when you add PostgreSQL)
- [ ] `JWT_SECRET` (generate secure random string)
- [ ] `FRONTEND_URL` (your frontend Railway URL)
- [ ] `CLERK_PUBLISHABLE_KEY` (optional, if using Clerk)
- [ ] `CLERK_SECRET_KEY` (optional, if using Clerk)

### Frontend
- [ ] `VITE_API_URL` (your backend Railway URL)
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` (if using Clerk)

## Monitoring

- **View Logs**: Railway Dashboard → Service → "Logs" tab
- **Metrics**: Railway Dashboard → Service → "Metrics" tab
- **Health**: Visit `https://your-backend-url.railway.app/health`

## Cost Optimization

- Railway provides $5 free credit per month
- Monitor usage in the Railway dashboard
- Consider using hobby plan for production apps

## Custom Domains (Optional)

1. Go to service → "Settings" → "Domains"
2. Click "Add Domain"
3. Follow instructions to configure DNS

## Support

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [GitHub Issues](https://github.com/railwayapp/nixpacks/issues)
