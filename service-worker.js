const CACHE_NAME = 'gaca12-app-v1';
const BASE_PATH = '/gaca12-app/';

const ASSETS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'styles.css',
  BASE_PATH + 'script.js',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'assets/logo.jpg',
  // icons
  BASE_PATH + 'assets/icon-48x48.png',
  BASE_PATH + 'assets/icon-72x72.png',
  BASE_PATH + 'assets/icon-96x96.png',
  BASE_PATH + 'assets/icon-144x144.png',
  BASE_PATH + 'assets/icon-192x192.png',
  BASE_PATH + 'assets/icon-256x256.png',
  BASE_PATH + 'assets/icon-384x384.png',
  BASE_PATH + 'assets/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k)))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Para navegación (SPA-like), red de primero y luego caché
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => caches.match(BASE_PATH + 'index.html'))
    );
    return;
  }

  // Caché primero para archivos estáticos del mismo origen
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
            return res;
          })
        );
      })
    );
  }
});
