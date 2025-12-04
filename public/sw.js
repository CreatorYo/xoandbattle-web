const CACHE_NAME = 'xoandbattle-v1';
const STATIC_CACHE_NAME = 'xoandbattle-static-v1';

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
    caches.match(request).then((cachedResponse) => {
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

      return fetch(request).then((response) => {
        if (response && response.ok) {
          const responseToCache = response.clone();
          const cacheToUse = /\.(?:png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(url.pathname) 
            ? STATIC_CACHE_NAME 
            : CACHE_NAME;
          caches.open(cacheToUse).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        if (request.destination === 'document' || url.pathname === '/' || url.pathname.endsWith('.html')) {
          return caches.match('/index.html').then((cachedHtml) => {
            if (cachedHtml) {
              return cachedHtml;
            }
            return caches.match('/').then((rootResponse) => {
              return rootResponse || new Response('Offline', { status: 503 });
            });
          });
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
