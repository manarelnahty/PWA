// Cache version - increment this to force cache update
const CACHE_VERSION = 'v1';
const CACHE_NAME = `pwa-lab-${CACHE_VERSION}`;

// Files to cache for offline functionality
const CACHE_FILES = [
    '/',
    '/index.html',
    '/other.html',
    '/below/another.html',
    '/js/main.js',
    '/js/other.js',
    '/js/another.js',
    '/styles/index.css',
    '/styles/other.css',
    '/styles/another.css',
    '/manifest/manifest.webmanifest',
    '/manifest/iti-logo-192.png',
    '/manifest/iti-logo-512.png'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(CACHE_FILES);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                // Force the waiting service worker to become active
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

// Activate event - clean up old caches (BONUS: Handle cache updates)
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // Delete old caches
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            // Keep only current cache, delete others
                            return cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                // Take control of all pages immediately
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching:', event.request.url);
    
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached version if available
                if (cachedResponse) {
                    console.log('[Service Worker] Serving from cache:', event.request.url);
                    
                    // BONUS: Check for updates in the background
                    // This implements "stale-while-revalidate" strategy
                    fetch(event.request)
                        .then((networkResponse) => {
                            // Update cache with fresh content
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, networkResponse);
                                    console.log('[Service Worker] Cache updated:', event.request.url);
                                });
                            }
                        })
                        .catch(() => {
                            // Network failed, but we have cached version
                            console.log('[Service Worker] Network failed, using cache');
                        });
                    
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                console.log('[Service Worker] Fetching from network:', event.request.url);
                return fetch(event.request)
                    .then((networkResponse) => {
                        // Cache the new resource for future use
                        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                            const responseClone = networkResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseClone);
                                console.log('[Service Worker] Cached new resource:', event.request.url);
                            });
                        }
                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[Service Worker] Fetch failed:', error);
                        // You could return a custom offline page here
                        throw error;
                    });
            })
    );
});

// BONUS: Listen for message events to manually update cache
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[Service Worker] Skipping waiting phase');
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'UPDATE_CACHE') {
        console.log('[Service Worker] Manual cache update requested');
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => cache.addAll(CACHE_FILES))
                .then(() => {
                    console.log('[Service Worker] Cache updated successfully');
                })
        );
    }
});

