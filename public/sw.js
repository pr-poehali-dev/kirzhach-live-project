const CACHE_NAME = 'kirzach-live-v1';
const urlsToCache = [
  '/',
  '/src/main.tsx',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Новая новость в КиржачLive!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: 'kirzach-news',
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification('КиржачLive.ru', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  } else if (event.action === 'dismiss') {
    // Просто закрываем уведомление
  } else {
    // Клик по самому уведомлению
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});