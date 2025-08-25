# Mobile PWA Testing Guide

## Steps to Test on Phone

1. **Find your local IP address:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   Look for something like `192.168.1.xxx`

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   Server will be accessible on `0.0.0.0:3000`

3. **Access from phone:**
   - Connect phone to same WiFi network
   - Open browser on phone
   - Go to `http://YOUR_IP_ADDRESS:3000`
   - Example: `http://192.168.1.100:3000`

## PWA Features to Test on Mobile

✅ **Install Banner**: Should appear after browsing
✅ **Add to Home Screen**: Available in browser menu
✅ **Offline Mode**: Turn off WiFi to test cached data
✅ **App-like Experience**: Full screen, no browser UI
✅ **Touch Navigation**: Responsive design

## For Production Testing

1. **Build and preview:**
   ```bash
   npm run build
   npm run preview -- --host 0.0.0.0
   ```

2. **Access via:** `http://YOUR_IP_ADDRESS:3000`

## Troubleshooting

- **Can't connect**: Check firewall settings
- **No PWA features**: Use HTTPS or localhost only
- **Install not working**: Try Chrome/Safari on mobile