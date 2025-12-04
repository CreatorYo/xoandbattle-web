const CACHE_NAME = 'xoandbattle-v2122';
const STATIC_CACHE_NAME = 'xoandbattle-static-v2122';

const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(staticAssets).catch((err) => {
        console.log('Cache addAll failed:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== location.origin) {
    return;
  }

  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      
      if (cachedResponse) {
        fetch(request).then((response) => {
          if (response && response.ok) {
            const cacheToUse = /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(url.pathname) 
              ? STATIC_CACHE_NAME 
              : CACHE_NAME;
            caches.open(cacheToUse).then((cache) => {
              cache.put(request, response.clone());
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cacheToUse = /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(url.pathname) 
            ? STATIC_CACHE_NAME 
            : CACHE_NAME;
          const cache = await caches.open(cacheToUse);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (fetchError) {
        if (request.destination === 'document' || url.pathname === '/' || url.pathname.endsWith('.html')) {
          const cachedHtml = await caches.match('/index.html');
          if (cachedHtml) {
            return cachedHtml;
          }
          const rootResponse = await caches.match('/');
          if (rootResponse) {
            return rootResponse;
          }
        }
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});
