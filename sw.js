const CACHE_NAME = 'crm-ashqaf-v2';
const urlsToCache = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Proses Install: Menyimpan aset-aset utama ke cache lokal HP
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache');
        return cache.addAll(urlsToCache).catch(err => console.log('Beberapa aset gagal di-cache', err));
      })
  );
  self.skipWaiting();
});

// Proses Fetch: Syarat wajib agar Chrome membuat WebAPK (App Drawer)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Kembalikan dari cache jika ada, jika tidak ambil dari internet
        return response || fetch(event.request);
      })
  );
});

// Proses Activate: Membersihkan cache versi lama
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
    })
  );
});