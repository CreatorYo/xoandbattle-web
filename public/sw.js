const CACHE_NAME = 'xoandbattle-v221';
const STATIC_CACHE_NAME = 'xoandbattle-static-v122';

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

  const checkPWA = async () => {
    if (!event.clientId) {
      return false;
    }
    try {
      const client = await clients.get(event.clientId);
      if (!client) {
        return false;
      }
      return client.displayMode === 'standalone' || client.displayMode === 'fullscreen';
    } catch (e) {
      return false;
    }
  };

  event.respondWith((async () => {
    const isPWA = await checkPWA();
    if (!isPWA) {
      return fetch(request);
    }

    if (/\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url.pathname)) {
      return caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            return new Response('', { status: 404 });
          });
        });
      });
    }

    if (/\.(?:js|mjs|css)$/i.test(url.pathname)) {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            fetch(request).then((response) => {
              if (response && response.ok) {
                cache.put(request, response.clone());
              }
            }).catch(() => {});
            return cachedResponse;
          }
          return fetch(request).then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            return new Response('Resource not available offline', { status: 404 });
          });
        });
      });
    }

    if (request.destination === 'document' || url.pathname === '/' || url.pathname.endsWith('.html')) {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match('/index.html').then((cachedHtml) => {
          return fetch(request)
            .then((response) => {
              if (response && response.ok) {
                cache.put(request, response.clone());
              }
              return response;
            })
            .catch(() => {
              if (cachedHtml) {
                return cachedHtml;
              }
              return cache.match('/').then((rootResponse) => {
                return rootResponse || new Response('Offline', { status: 503 });
              });
            });
        });
      });
    }

    return caches.open(CACHE_NAME).then((cache) => {
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => {
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            if (request.destination === 'document') {
              return cache.match('/index.html');
            }
            return new Response('Offline', { status: 503 });
          });
        });
    });
  })());
});
