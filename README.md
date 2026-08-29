# Starmap

Browser-based star map for the Roblox game Waste of Space. Search for planets and stars, click one to see its info.

![Starmap screenshot](docs/screenshot.png)

## Live Site

**https://dsetzer.github.io/starmap/**

The original Starmap required Node.js and a local server running in the background. This version is a single, self-contained HTML file — GitHub Pages is just a convenient place to host that file, not something the app depends on. There's no backend, no server-side logic, and nothing running behind the scenes: once the page loads, it's just a file sitting in your browser.

## Privacy

Your searches never leave your device. On load, the universe data is downloaded and cached in the browser; every search, filter, and click is handled locally.

## Save It As An App

Since the universe data and app are cached in your browser, Starmap works fully offline once loaded. You can install it as a standalone app, save it as a single-file webpage, or just bookmark it:

- Chrome: install icon in the address bar, or menu → Cast, save and share → Install page as app
- Edge: menu → Apps → Install this site as an app
- Android: menu → Add to Home screen
- iPhone/iPad: Share → Add to Home Screen
- Safari on Mac: File → Add to Dock
- Chrome/Edge/Opera: Right-click → Save as... (or Ctrl+S) → "Webpage, Single File (.mhtml)"

Firefox on desktop doesn't support native installation, but you can still save the page locally or bookmark the live site.

## Desktop App

`desktop/` wraps the web app in Electron.

```bash
cd desktop
npm install
npm start
```

To build a distributable:

```bash
npm run dist
```

## Running Locally

The live site covers most use cases — you only need to run this locally if you're developing the project.

Install [Bun](https://bun.com/docs/installation), then:

```bash
git clone https://github.com/dsetzer/starmap.git
cd starmap/webui
bun install
bun run dev
```

### Hosting on your LAN

Find your local IP (e.g. `192.168.x.x`), then:

```bash
bun run dev -- --host
```

The app will be accessible from any device on your network at `http://<your-local-ip>:5173`.

## Credits

- Original Starmap by [someoneidoknow](https://github.com/someoneidoknow)
- Textures by [dorpg](https://github.com/dorpg9)
- Search functions by [Zalander](https://github.com/anonymousomeone)
- Universe data by [ArvidSilverlock](https://github.com/ArvidSilverlock) and others.
