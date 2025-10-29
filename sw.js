const CACHE_NAME = 'nclock-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // 必要ならCSSやJSも追加
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
