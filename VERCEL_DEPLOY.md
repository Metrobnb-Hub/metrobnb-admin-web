# Deploy PWA to Vercel

## Quick Deploy from Console

```bash
# 1. Commit your PWA changes
git add .
git commit -m "Add PWA functionality"

# 2. Push to feat/pwa branch
git push origin feat/pwa

# 3. Deploy to Vercel (if connected to GitHub)
# Vercel will auto-deploy from GitHub

# OR manual deploy with Vercel CLI
npx vercel --prod
```

## Environment Variables for Vercel

Set in Vercel Dashboard:
- `API_BASE_URL=https://metrobnb-api.onrender.com`
- `NODE_ENV=production`

## Vercel Configuration

The app is configured to:
- Use Vercel preset in production
- Support PWA features
- Handle API proxy correctly

## Test PWA on Vercel

1. Deploy completes → Get Vercel URL
2. Open on mobile browser
3. Install PWA from live site
4. Test offline functionality

## Branch Deployment

If you want to deploy feat/pwa branch specifically:
1. Go to Vercel Dashboard
2. Project Settings → Git
3. Add feat/pwa as deployment branch
4. Or merge feat/pwa to main for auto-deploy