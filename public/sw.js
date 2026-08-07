// PWA service worker — keep installable; don't intercept cross-origin
// partner images (that raced with the page Cache Storage / CORS fetch and
// blanked the store rail icons). Icon caching is handled by StoreLogo.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', () => {
  // network passthrough
})
