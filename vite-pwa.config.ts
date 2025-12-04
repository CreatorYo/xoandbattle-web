import { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: 'prompt', // automatically update when new version is available
  strategies: 'generateSW',
  includeAssets: [
    'favicon.ico',
    'apple-touch-icon.png',
    'favicon-32x32.png',
    'favicon-16x16.png',
    'XO_Battle_Logo_Transparent.png'
  ],
  manifest: {
    name: 'X&O Battle',
    short_name: 'X&O Battle',
    description: 'X&O Battle is a playful take on tic-tac-toe, perfect for when you\'re feeling bored. Play with a friend or challenge an AI opponent with adjustable difficulty ranging from easy to unbeatable. Customise themes and explore fun features to make each match your own! The web version of X&O Battle.',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    orientation: 'portrait-primary',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: '/assets/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/assets/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      }
    ],
    categories: ['games', 'entertainment']
  },
  workbox: {
    globPatterns: ['**/*.*'], // caches everything in your dist folder
    navigateFallback: '/index.html',
    navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
    cleanupOutdatedCaches: true,
    skipWaiting: true,
    clientsClaim: true,
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
          cacheableResponse: { statuses: [0, 200] }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      },
      {
        urlPattern: /\.(?:js|mjs|css)$/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'static-resources',
          expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 }
        }
      },
      {
        urlPattern: /\.(?:html)$/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'html-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 3
        }
      },
      {
        urlPattern: ({ url }) => url.pathname.startsWith('/') && !url.pathname.startsWith('/api'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages-cache',
          expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
          networkTimeoutSeconds: 3
        }
      }
    ]
  },
  // DEV options removed for reliable offline caching in production
  injectRegister: 'auto'
};