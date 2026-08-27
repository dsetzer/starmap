# Starmap

Browser-based star map for the Roblox game Waste of Space. Search for planets and stars, click one to see its info.

![Starmap screenshot](docs/screenshot.png)

## Live Site

**https://dsetzer.github.io/starmap/**

The original Starmap needed Node.js installed and a local server running in the background before you could open the map. This one is just a web page on GitHub Pages. It's completely self-contained and everything runs locally in your browser with no server connection needed.

## Is anything I search logged?

No. Your searches never leave your device.

When the page loads, the entire universe database is downloaded into your browser. Every search, filter, and planet you click is handled right there on your own computer. None of it gets sent anywhere.

## Save It As An App

Add it to your home screen or desktop and it opens from its own icon in its own window, with no internet needed. It's completely self-contained and fully functional.

- Chrome: install icon on the right side of the address bar, or menu > Cast, save and share > Install page as app
- Edge: menu > Apps > Install this site as an app
- Android: menu > Add to Home screen
- iPhone or iPad: Share button > Add to Home Screen
- Safari on Mac: File > Add to Dock
- Chrome, Edge, Opera: Right-click → Save as... (or Ctrl+S) → select "Webpage, Single File (.mhtml)"

Firefox on desktop doesn't offer native installation, but a bookmark works just as well.

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

The live site is already available at https://dsetzer.github.io/starmap/, so you do not need to run anything locally just to use it. Local setup is only needed if you want to develop or run the project locally.

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
