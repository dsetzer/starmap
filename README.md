# starmap

starmap for the hit game waste of space on the nintendo switch

credits to [dorpg](https://github.com/dorpg9) for the textures

credits to [Zalander](https://github.com/anonymousomeone) for search functions

# live site

hosted on GitHub Pages: https://dsetzer.github.io/starmap/

deploys automatically from `main` via `.github/workflows/deploy.yml`

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

# steps on how to prod host

install docker https://docs.docker.com/get-docker/

`git clone https://github.com/dsetzer/starmap.git`

`cd starmap`

`docker compose up -d --build`

the app runs on `http://localhost:4000` (and `http://localhost:4001` for the second instance)

to update to the latest version: `./deploy.sh`

to force a full rebuild: `./deploy.sh --force`
