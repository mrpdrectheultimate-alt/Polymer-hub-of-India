// public/sw.js — PolymerHub Production Live Service Worker (v4)
const CACHE_NAME = 'polymerhub-v4-final-live';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET, APIs, Supabase, Auth, and Vercel internal routes
  if (
    event.request.method !== 'GET' || 
    url.pathname.startsWith('/api') || 
    url.pathname.includes('/supabase/') ||
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/_next/webpack-hmr')
  ) {
    return;
  }

  // ALWAYS Network-Only for HTML Navigation Requests to prevent stale HTML referencing deleted CSS hashes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/').then((response) => response || new Response('Offline', { status: 503 }));
      })
    );
    return;
  }

  // Network-First for static assets, fallback to cache
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && url.origin === location.origin) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New notification from PolymerHub',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      data: { url: data.url || '/' }
    };
    event.waitUntil(self.registration.showNotification(data.title || 'PolymerHub', options));
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
