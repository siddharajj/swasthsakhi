const CACHE_NAME = 'swasthsakhi-pwa-v7';
const ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './manifest.webmanifest',
  './icon.svg',
  './assets/hero-women.jpg',
  './js/app.js',
  './js/clinicalData.js',
  './js/statsData.js',
  './js/analyzerEngine.js',
  './js/i18n.js',
  './js/vault.js',
  './js/viewsLandingOnboarding.js',
  './js/viewsPlan.js',
  './js/viewsAnalyzerStats.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first with offline cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request).then((c) => c || caches.match('./index.html')))
  );
});
