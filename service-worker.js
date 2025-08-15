const CACHE_NAME = 'gaca12-app-v3';
const STATIC_ASSETS = [
  '/gaca12-app/',
  '/gaca12-app/index.html',
  '/gaca12-app/styles.css',
  '/gaca12-app/script.js',
  '/gaca12-app/manifest.json',
  '/gaca12-app/assets/logo.jpg',
  '/gaca12-app/assets/icon-192x192.png',
  '/gaca12-app/assets/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).catch(() => {})
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

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Navegación SPA
  if (req.mode === 'navigate' && url.origin === location.origin) {
    event.respondWith((async () => {
      try {
        const net = await fetch(req);
        return net;
      } catch {
        const cached = await caches.match('/gaca12-app/index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  // Recursos del mismo origen
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((res) => {
        if (res && res.status === 200 && (req.method === 'GET')) {
          cache.put(req, res.clone());
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
    return;
  }

  // Recursos externos
  event.respondWith(fetch(req).catch(() => new Response('', { status: 502 })));
});
