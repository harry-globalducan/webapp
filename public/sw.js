// Minimal service worker: makes the site installable (required for the PWA
// share target) without caching anything, so dev and deploys stay fresh.
// Add real offline caching here later if wanted.
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))
self.addEventListener('fetch', () => {
  // network passthrough — a fetch handler must exist for installability
})
