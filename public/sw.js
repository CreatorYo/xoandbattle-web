const CACHE_NAME = 'xobattle-v2';
const STATIC_CACHE_NAME = 'xobattle-static-v2';

const staticAssets = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  '/assets/apple-touch-icon.png',
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/XO_Battle_Logo_Transparent.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(staticAssets.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
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

  if (request.destination === 'image' || 
      request.url.includes('/assets/') ||
      request.url.endsWith('.png') ||
      request.url.endsWith('.jpg') ||
      request.url.endsWith('.jpeg') ||
      request.url.endsWith('.svg') ||
      request.url.endsWith('.ico') ||
      request.url.endsWith('.webp')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          if (request.url.includes('/assets/')) {
            return caches.match('/assets/android-chrome-192x192.png');
          }
          return new Response('', { status: 404 });
        });
      })
    );
    return;
  }

  if (request.destination === 'document' || request.url.endsWith('.html') || request.url === '/' || request.url === location.origin + '/') {
    event.respondWith(
      caches.match('/index.html').then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put('/index.html', responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match('/index.html').then((cached) => {
              if (cached) {
                return cached;
              }
              return new Response('<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1></body></html>', {
                headers: { 'Content-Type': 'text/html' }
              });
            });
          });
      })
    );
    return;
  }

  if (request.destination === 'script' || 
      request.destination === 'style' ||
      request.url.includes('/src/') ||
      request.url.endsWith('.js') ||
      request.url.endsWith('.css') ||
      request.url.endsWith('.mjs') ||
      request.url.endsWith('.ts') ||
      request.url.endsWith('.tsx')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request).then((cached) => {
              if (cached) {
                return cached;
              }
              return new Response('', { status: 404 });
            });
          });
      })
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('', { status: 404 });
        });
      })
  );
});

