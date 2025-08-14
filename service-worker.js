const CACHE_NAME = 'gaca12-app-v2';
const ASSETS = [
  '/gaca12-app/',
  '/gaca12-app/index.html',
  '/gaca12-app/styles.css',
  '/gaca12-app/script.js',
  '/gaca12-app/manifest.json',
  '/gaca12-app/assets/logo.jpg',
  '/gaca12-app/assets/icon-192x192.png',
  '/gaca12-app/assets/icon-512x512.png'
];

// Instalar y cachear recursos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar y limpiar cachés viejos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Estrategia: network-first para HTML, cache-first para estáticos
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Si es navegación (HTML), intentar red
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/gaca12-app/index.html'))
    );
    return;
  }

  // Cache-first para recursos estáticos
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
      );
    })
  );
});

