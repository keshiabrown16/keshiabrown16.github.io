var cacheName = 'v5';


var urlsToCache = [
        './',
        './index.html',
        './style.css',
        './js/scripts.js',
        './js/main.js',
        './manifest.json',
        './images/momentsblack.png',
        './images/momentswhite.png',
        './images/momentswhitexs.png',
        './images/icons/favicons/apple-icon-57x57.png',
        './images/icons/favicons/apple-icon-60x60.png',
        './images/icons/favicons/apple-icon-72x72.png',
        './images/icons/favicons/apple-icon-76x76.png',
        './images/icons/favicons/apple-icon-114x114.png',
        './images/icons/favicons/apple-icon-120x120.png',
        './images/icons/favicons/apple-icon-144x144.png',
        './images/icons/favicons/apple-icon-152x152.png',
        './images/icons/favicons/apple-icon-180x180.png',
        './images/icons/favicons/android-icon-192x192.png',
        './images/icons/favicons/favicon-32x32.png',
        './images/icons/favicons/favicon-96x96.png',
        './images/icons/favicons/favicon-16x16.png',
        './images/icons/icon-152x152.png',
        './images/icons/icon-144x144.png',
        './images/icons/icon-256x256.png',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css',
        'https://fonts.googleapis.com/css?family=Roboto:400,700|Lato|Roboto+Condensed:300,400,700'
];

/* Install */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(urlsToCache).then(function() {
        return self.skipWaiting();
      });
    })
  );
});

/* Activate */
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

/* Fetch */
self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});