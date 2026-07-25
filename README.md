# Starmap

Browser-based star map for the Roblox game Waste of Space. Search for planets and stars, click one to see its info.

![Starmap screenshot](docs/screenshot.png)

## Live Site

You can use the live version at https://dsetzer.github.io/starmap/ right away.

## Works Offline (PWA)

It's a PWA. Open the site once, then use your browser's "Install app" / "Add to Home Screen" option. After that it works offline.

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

The live site is already available at https://dsetzer.github.io/starmap/, so you do not need to run anything locally just to use it. Local setup is only needed if you want to develop or run the project yourself.

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
- Universe data by ArvidSilverlock
