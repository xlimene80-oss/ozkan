const CACHE_NAME = '13sigorta-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

// Service Worker Kurulumu ve Önbellekleme
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Statik varlıklar önbelleğe alınırken uyarı:', err);
      });
    })
  );
  self.skipWaiting();
});

// Eski Önbellekleri Temizleme
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// İstek Yönetimi: API rotaları doğrudan ağa, statik dosyalar önbellek öncelikli
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. API İstekleri: Her zaman doğrudan ağa gider (Önbelleğe alınmaz)
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/.netlify')) {
    event.respondWith(
      fetch(event.request).catch((err) => {
        return new Response(
          JSON.stringify({ success: false, error: 'Ağ bağlantısı kesildi. Lütfen internetinizi kontrol edin.' }),
          { headers: { 'Content-Type': 'application/json' }, status: 503 }
        );
      })
    );
    return;
  }

  // 2. Sayfa Navigasyonları (SPA rotaları): Ağ öncelikli, bağlantı yoksa önbellekteki index.html
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 3. Statik Varlıklar (CSS, JS, Resimler, Yazı Tipleri): Stale-While-Revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
