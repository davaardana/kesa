// Service Worker para PT. Kharisma Elsyadai Sukses Abadi
const CACHE_NAME = 'kesa-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/services.html',
  '/contact.html',
  '/404.html',
  '/css/style.css',
  '/js/main.js',
  '/robots.txt',
  '/sitemap.xml',
  '/og-image.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.log('Cache addAll error:', err);
        return cache.addAll(STATIC_ASSETS.filter(url => url !== '/' && !url.includes('google')));
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external CDN requests (let them go to network)
  if (event.request.url.includes('fonts.googleapis.com') || 
      event.request.url.includes('fonts.gstatic.com') ||
      event.request.url.includes('cdnjs.cloudflare.com') ||
      event.request.url.includes('unsplash.com') ||
      event.request.url.includes('formspree.io') ||
      event.request.url.includes('wa.me') ||
      event.request.url.includes('google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached response if available
      if (response) {
        return response;
      }

      // Otherwise fetch from network
      return fetch(event.request).then(response => {
        // Don't cache non-successful responses or non-GET
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone response to cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/404.html');
        }
        return null;
      });
    })
  );
});
