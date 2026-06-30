# Starmap web app

The app is now set up as a **Progressive Web App (PWA)**, meaning it can be installed on any device and works offline.

## Installation

### On Desktop (Chrome, Edge, Brave):
1. Visit the hosted app
2. Click the "Install" button in the address bar (or browser menu → "Install app")
3. The app will be installed as a desktop application

### On Mobile (iOS/Android):
1. Visit the app in your browser
2. Tap the share button → "Add to Home Screen" (iOS) or use the browser menu → "Install app" (Android)
3. The app will appear as an icon on your home screen

## Development

From the [webui](.) folder:

```bash
npm install
npm run dev
```

## Production

Build the app for deployment:

```bash
npm run build
```

The built files are in `.svelte-kit/output/client/` and ready to deploy to any static host.

### Included PWA Features:
- **Offline support**: App works without internet connection
- **Auto-updates**: Service worker caches assets and updates in background
- **Installable**: Can be installed like a native app on desktop and mobile
- **Web manifest**: Custom app icon, colors, and metadata

## What happened to Tauri?

The app was originally scaffolded with Tauri (a native desktop wrapper), but we switched to a pure PWA approach instead. This is much lighter weight and provides the same "desktop app" experience across all platforms (Windows, Mac, Linux, iOS, Android) without the overhead of bundling a browser engine.
