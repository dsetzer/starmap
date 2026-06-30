/// <reference types="vite/client" />

import { build, files, version } from '$service-worker';

const CACHE_NAME = `starmap-cache-${version}`;
const APP_SHELL = [...build, ...files];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.waitUntil(caches.open(CACHE_NAME));
    return event.respondWith(fetch(event.request).catch(() => caches.match('/')));
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});
