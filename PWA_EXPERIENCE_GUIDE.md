# PWA Experience Testing Guide

## Full PWA Experience Steps

### 1. Build for Production (PWA only works in built version)
```bash
npm run build
npm run preview -- --host 0.0.0.0
```

### 2. Access on Phone
- Find your IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Open `http://YOUR_IP:3000` in Chrome/Safari on phone

### 3. Experience PWA Features

**📱 Install the App:**
- Browse for 30+ seconds
- Install banner will appear
- Tap "Install" or use browser menu "Add to Home Screen"
- App icon appears on home screen

**🚀 Launch Like Native App:**
- Tap the home screen icon
- Opens in full screen (no browser UI)
- Splash screen appears
- Feels like native app

**📶 Test Offline Mode:**
- Use app while online first (loads data)
- Turn off WiFi/mobile data
- App still works with cached data
- Orange offline indicator appears

**🔄 Background Updates:**
- Turn WiFi back on
- App automatically syncs new data
- Updates happen seamlessly

### 4. PWA vs Web Comparison
- **Web**: Browser UI, address bar, tabs
- **PWA**: Full screen, app-like, home screen icon, offline capable

## Best Testing Sequence
1. Build → Preview → Install → Use Offline → Go Online → Experience native-like behavior