// QrMenu Service Worker — Supabase Storage Image Cache
// Şəkilləri brauzer kəşinə qoyur ki, hər açılışda Supabase-dən yenidən yüklənməsin

const CACHE_NAME = 'qrmenu-images-v1';

// Supabase Storage URL-lərini tanı
const isSupabaseImage = (url) => {
  return url.includes('supabase.co/storage') || url.includes('.supabase.co/storage');
};

// Yükləmə hadisəsi — kəşi hazırla
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch hadisəsi — Supabase şəkilləri kəşdən ver
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Yalnız GET sorğularını kəşlə
  if (event.request.method !== 'GET') return;

  // Yalnız Supabase Storage şəkillərini kəşlə
  if (!isSupabaseImage(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cached) => {
        if (cached) {
          // ✅ Kəşdə var — birbaşa qaytarır (Supabase-ə heç bir sorğu getmir!)
          return cached;
        }

        // 🌐 Kəşdə yoxdur — Supabase-dən yüklə və kəşə qoy
        return fetch(event.request).then((response) => {
          if (response.ok || response.status === 0) {
            cache.put(event.request, response.clone());
          }
          return response;
        }).catch(() => {
          // Şəbəkə xətası — kəşdən ver (offline dəstək)
          return cache.match(event.request);
        });
      });
    })
  );
});
