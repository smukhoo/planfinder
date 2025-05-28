// public/sw.js
const CACHE_NAME = 'connectplan-ai-cache-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png', // Assuming you will add these
  '/icons/icon-512x512.png'  // Assuming you will add these
  // Add other critical assets if needed, like a specific offline page
  // Example: '/offline.html'
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Opened cache:', CACHE_NAME);
        // It's safer to cache specific, known assets.
        // Caching bundled JS/CSS from Next.js is more complex and better handled by tools like next-pwa.
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/_next/')));
      })
      .catch(err => {
        console.error('[ServiceWorker] Failed to cache initial urls:', err);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Skip Genkit API calls and Next.js internal requests from service worker handling
  if (event.request.url.includes('/api/genkit/') || event.request.url.includes('/_next/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            // If network fails, try to serve from cache
            return caches.match(event.request)
              .then(cachedResponse => {
                return cachedResponse || caches.match('/'); // Fallback to home page or an offline page
              });
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/'); // Fallback to home page or an offline.html if you have one
            });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response; // Serve from cache
          }
          // Not in cache, fetch from network
          return fetch(event.request).then(
            (networkResponse) => {
              if(!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return networkResponse;
              }
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              return networkResponse;
            }
          ).catch(err => {
            console.error('[ServiceWorker] Fetch failed for non-navigation request:', event.request.url, err);
            // Optionally return a placeholder for failed assets like images
          });
        })
    );
  }
});
