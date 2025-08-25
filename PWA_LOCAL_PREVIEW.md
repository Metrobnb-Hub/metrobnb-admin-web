# PWA Local Preview Guide

## Steps to Preview PWA Locally

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Start preview server:**
   ```bash
   npm run preview
   ```

3. **Access PWA features:**
   - Open `http://localhost:3000` in Chrome/Edge
   - Open DevTools > Application > Service Workers
   - Check "Offline" to test offline functionality
   - Look for install banner on mobile or desktop

## PWA Testing Checklist

✅ **Install Prompt**: Should appear after a few seconds
✅ **Offline Mode**: Toggle offline in DevTools to test cached data
✅ **Service Worker**: Check registration in DevTools > Application
✅ **Manifest**: Verify in DevTools > Application > Manifest
✅ **Caching**: API responses should be cached for offline use

## Troubleshooting

- **No install prompt**: Try incognito mode or clear browser data
- **Service worker not registering**: Check console for errors
- **Offline not working**: Ensure you've visited pages while online first

## Mobile Testing

For mobile PWA testing:
1. Use Chrome on Android or Safari on iOS
2. Access via `http://your-local-ip:3000`
3. Add to home screen option should appear