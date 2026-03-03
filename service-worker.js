const CACHE_NAME = 'aurora-vibe-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/yandex_0ead59de0cb476b1.html',
  '/manifest.json'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэш открыт');
        return cache.addAll(urlsToCache);
      })
  );
});

// Обработка запросов (стратегия "кэш, затем сеть")
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Если ресурс есть в кэше, отдаем его
        if (response) {
          return response;
        }
        // Иначе, идем в сеть
        return fetch(event.request);
      }
    )
  );
});

// Активация Service Worker и очистка старого кэша
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
