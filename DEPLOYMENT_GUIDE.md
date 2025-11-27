# Deployment Guide for Maker's Lab Website

## Current Status
✅ Application is ready for production deployment on Replit Autoscale
✅ Backend server and frontend are fully integrated
✅ Database seeding is working correctly
✅ Both `/health` and `/` endpoints respond with 200 OK

## Deployment Steps

### 1. Configure Health Check (IMPORTANT)
The deployment needs to be configured to use the `/health` endpoint for health checks:

1. Go to your **Replit Publishing panel**
2. Click **"Manage"** next to "Deployments" or "Configuration"
3. Look for **"Advanced Settings"** or **"Health Check Configuration"**
4. Set the **health check path** to `/health` (instead of `/`)
5. Set the **health check timeout** to at least 30 seconds (database seeding takes ~3-5 seconds)

If you can't find these settings in the UI, you can also:
- Try clicking the gear icon ⚙️ in the deployments panel
- Look for "Health Check Path" or similar option

### 2. Verify Environment Secrets
Make sure these secrets are set in your **published environment** (not just development):
- `SESSION_SECRET` - For session encryption
- `ADMIN_PASSWORD` - For admin dashboard access

To check:
1. Go to **Replit Publishing panel** → **Configuration**
2. Verify secrets are listed
3. If missing, add them from the **Secrets** tab

### 3. Republish Your App
1. Click **"Republish"** button in the publishing panel
2. Wait for the build to complete (2-3 minutes)
3. Wait for health checks to pass

## How the App Works in Production

**Startup Sequence:**
1. Server starts and listens on port 5000 (exposed as port 80)
2. Health check endpoint `/health` responds immediately with `{"status":"ok"}`
3. Root endpoint `/` serves the React application from `dist/public`
4. Database seeding runs in background (doesn't block requests)
5. Images are served from `/seed-images/` directory

**Key Endpoints:**
- `GET /health` - Health check (responds immediately)
- `GET /` - Home page (React SPA)
- `GET /api/*` - API endpoints (services, projects, etc.)
- `GET /seed-images/*` - Project/equipment images

## Troubleshooting

### "Error: Server Error" on published site
- Check that `/health` endpoint is configured in deployment settings
- Check that `SESSION_SECRET` and `ADMIN_PASSWORD` secrets are set
- Wait 30 seconds for health checks to pass after deployment

### Images not showing
- Images should load from `/seed-images/` paths
- Check browser console for 404 errors
- Verify the build includes `dist/public/seed-images/` directory

### Admin login not working
- Verify `ADMIN_PASSWORD` environment variable is set in published environment
- Default password is set in the `.replit` file's `[userenv.shared]` section

## What Was Fixed

✅ Image paths automatically migrate from `/attached_assets/` to `/seed-images/`
✅ Database seeding runs after server starts (doesn't block health check)
✅ Session and seed_log tables managed via raw SQL (no Drizzle migration conflicts)
✅ Health check endpoint responds immediately
✅ Root endpoint serves static files quickly
✅ Duplicate content automatically cleaned up on startup

## Local Development

To run locally:
```bash
npm run dev
```

Then open http://localhost:5000

To build for production:
```bash
npm run build
npm run start
```
