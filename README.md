# starmap

starmap for the hit game waste of space on the nintendo switch

credits to [dorpg](https://github.com/dorpg9) for the textures

credits to [Zalander](https://github.com/anonymousomeone) for search functions

# live site

hosted on GitHub Pages: https://dsetzer.github.io/starmap/

deploys automatically from `main` via `.github/workflows/deploy.yml`

the site is a PWA — use your browser's "Install app" / "Add to Home Screen" option to install it and use it offline after the first load

# desktop app

the `desktop/` folder wraps the web app in Electron for a native desktop build

```bash
cd desktop
npm install
npm start
```

to package a distributable build: `npm run dist` (builds the web app first, then bundles it with Electron)

# steps on how to run locally

install bun https://bun.com/docs/installation

`git clone https://github.com/dsetzer/starmap.git`

`cd starmap/webui`

`bun install`

`bun run dev`

# steps on how to dev host to LAN

find your local IP address (e.g. `192.168.x.x`)

`bun run dev -- --host`

the app will be accessible from any device on your network at `http://<your-local-ip>:5173`
