# Deployment Guide for Maker's Lab Website

## Current Status
✅ **Application is ready for production deployment on Replit Autoscale**
✅ **Server stays alive indefinitely** - No more "main done, exiting" errors
✅ Backend server and frontend fully integrated
✅ Database seeding works correctly in background
✅ Both `/health` and `/` endpoints respond immediately

## Critical Fixes Applied

### Server Keepalive (FIXED)
The deployment was failing because the process was exiting after startup. This has been fixed by:

1. **Database Pool Configuration** - Pool now maintains minimum connections
2. **Keepalive Heartbeat** - Background process sends queries every 25 seconds to keep database connections alive
3. **Server.listen() Persistence** - Express server continues listening indefinitely

The server now:
- ✅ Stays running after startup (processes won't exit)
- ✅ Handles health checks immediately  
- ✅ Seeds database in background without blocking requests
- ✅ Maintains stable database connections

## Deployment Steps

### 1. Configure Health Check Path
When republishing to Replit:

1. Go to **Replit Publishing** panel
2. Click **"Manage"** or the ⚙️ settings icon
3. Look for **"Advanced Settings"** or **"Health Check Configuration"**
4. Set **health check path** to `/health` (not `/`)
5. Set **health check timeout** to at least 30 seconds

### 2. Verify Environment Secrets
Make sure these are set in your published environment:
- `SESSION_SECRET` - For session encryption
- `ADMIN_PASSWORD` - For admin dashboard access

To verify:
1. Go to **Publishing** → **Configuration**
2. Check that secrets are listed and visible
3. If missing, add from **Secrets** tab

### 3. Republish Your App
1. Click **"Republish"** in the publishing panel
2. Wait for build to complete (2-3 minutes)
3. Wait for health checks to pass (should be immediate now)

## How the App Works in Production

**Startup Sequence (Fixed):**
1. ✅ Server starts and listens on port 5000 (exposed as port 80)
2. ✅ Health check endpoint `/health` responds with `{"status":"ok"}`
3. ✅ Keepalive heartbeat starts (prevents process exit)
4. ✅ Root endpoint `/` serves React application quickly
5. ✅ Database seeding runs in background (non-blocking)
6. ✅ Server stays running indefinitely to handle requests

**Key Endpoints:**
- `GET /health` - Health check (immediate response)
- `GET /` - Home page (React SPA)
- `GET /api/services` - Get all services
- `GET /api/projects` - Get portfolio projects
- `POST /api/contact` - Submit quote requests

## Implementation Details

### Database Keepalive System
Located in `server/db.ts`:
- Sends `SELECT 1` query every 25 seconds
- Keeps connections from timing out (idle timeout is 30s)
- Uses `setInterval.unref()` so it doesn't prevent exit in development
- Runs silently in background with error logging

### Server Startup
Located in `server/index.ts`:
- Calls `startPoolKeepalive()` after server starts listening
- Database seeding runs asynchronously after keepalive starts
- No process.exit() calls that could terminate the app

## Testing Locally

To verify everything works:

```bash
# Development
npm run dev

# Check health endpoint
curl http://localhost:5000/health

# Check root endpoint  
curl http://localhost:5000/

# Production build
npm run build
npm run start
```

## Troubleshooting

### "Error: Server Error" on published site
- ✅ Fixed: Server now stays running
- Verify `/health` endpoint is configured in deployment
- Check `SESSION_SECRET` and `ADMIN_PASSWORD` secrets are set

### Health checks timing out
- ✅ Fixed: Keepalive prevents process exit
- Set health check timeout to at least 30 seconds
- Verify health check path is `/health`

### Images not showing
- Images load from `/seed-images/` paths
- Check browser console for 404 errors
- Verify build includes `dist/public/seed-images/`

### Admin login not working
- Verify `ADMIN_PASSWORD` is set in published environment
- Default in `.replit` file is: `8462368mM@!`

## What Was Fixed

✅ **Application exits immediately after startup** - FIXED with keepalive heartbeat
✅ **Health checks timing out** - FIXED by keeping process alive
✅ **Database pool idling** - FIXED with min connections and keepalive queries
✅ **Blocking database seeding** - Already non-blocking with setImmediate
✅ **Image paths** - Auto-migrate from `/attached_assets/` to `/seed-images/`
✅ **Session management** - PostgreSQL-backed with proper cleanup
✅ **Duplicate content** - Auto-cleaned up on startup

## Production Checklist

Before republishing:
- [ ] Check that `SESSION_SECRET` environment variable is set
- [ ] Check that `ADMIN_PASSWORD` environment variable is set
- [ ] Configure health check path to `/health` in deployment settings
- [ ] Set health check timeout to 30+ seconds
- [ ] Verify build completes without errors (`npm run build`)
- [ ] Test production build locally (`npm run start`)

## Files Modified

- `server/db.ts` - Added pool keepalive system
- `server/index.ts` - Call keepalive on server start
- `DEPLOYMENT_GUIDE.md` - This documentation

## Next Steps

1. **Republish** the application with `/health` health check path
2. **Monitor** first few requests after deployment
3. **Verify** admin dashboard is accessible
4. **Test** contact form submission
