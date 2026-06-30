# Starmap desktop wrapper

This folder adds a lightweight Electron shell around the existing Starmap web app.

## Development

```bash
cd desktop
npm install
npm start
```

## Packaging

```bash
cd desktop
npm install
npm run dist
```

The packaging step builds the SvelteKit app first, then bundles it into an Electron app.
