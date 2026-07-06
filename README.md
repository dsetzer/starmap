# Starmap

A browser-based companion tool for the game **Waste of Space**. It lets you browse and search the game's universe — planets, stars, and systems — outside the game itself.

![Starmap screenshot](docs/screenshot.png)

## Live Site

Hosted on GitHub Pages: https://dsetzer.github.io/starmap/

Deploys automatically from `main` via `.github/workflows/deploy.yml`.

## Works Offline (PWA)

Starmap is a Progressive Web App. Open the live site once, then use your browser's "Install app" / "Add to Home Screen" option to install it — after that first load, it keeps working fully offline with no internet connection required.

## Desktop App

The `desktop/` folder wraps the web app in Electron for a native desktop build.

```bash
cd desktop
npm install
npm start
```

To package a distributable build:

```bash
npm run dist
```

This builds the web app first, then bundles it with Electron.

## Running Locally

Install [Bun](https://bun.com/docs/installation), then:

```bash
git clone https://github.com/dsetzer/starmap.git
cd starmap/webui
bun install
bun run dev
```

### Hosting on your LAN

Find your local IP address (e.g. `192.168.x.x`), then run:

```bash
bun run dev -- --host
```

The app will be accessible from any device on your network at `http://<your-local-ip>:5173`.

## Credits

Originally forked from [someoneidoknow](https://github.com/someoneidoknow)'s Starmap, since substantially reworked into its own project.

- Textures by [dorpg](https://github.com/dorpg9)
- Search functions by [Zalander](https://github.com/anonymousomeone)
