// Simple offline-first Service Worker for GitHub Pages
// - Caches core assets on install
// - Serves cached responses when offline

const CACHE_NAME = 'puzzle-pages-v1';

// Add files you want available offline.
// Keep paths relative to the site root.
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  // icons
  './icons/icon-192.png',
  './icons/icon-512.png',
  // your page assets (add/remove as needed)
  './icon_3.png',
  './icon_4.png',
  './icon_5.png',
  './icon_16.png',
  './icon_17.png',
  './icon_18.png',
  './icon_21.png',
  './icon_22.png',
  './icon_49.png',
  './icon_50.png',
  './oht.png',
  './pealuu.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

// Cache-first for same-origin GET requests, network fallback.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) =>
      cached || fetch(req).then((resp) => {
        // Optionally cache new files as they are fetched
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return resp;
      }).catch(() => cached)
    )
  );
});
