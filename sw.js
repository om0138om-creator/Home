/**
 * =====================================================
 * 🚀 Font Studio Pro - Service Worker v2.0
 * =====================================================
 */

const CACHE_VERSION = 'v2.0.3';
const CACHE_NAME = 'fontstudio-' + CACHE_VERSION;

// التثبيت
self.addEventListener('install', () => {
    console.log('⚡ SW ' + CACHE_VERSION + ' installing...');
    self.skipWaiting();
});

// التفعيل وحذف الكاش القديم
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => 
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
    console.log('✅ SW ' + CACHE_VERSION + ' activated');
});

// استراتيجية Network First
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith('http')) return;
    
    event.respondWith(
        fetch(event.request)
            .then((res) => {
                if (res.ok) {
                    const clone = res.clone();
                    caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
                }
                return res;
            })
            .catch(() => caches.match(event.request))
    );
});

self.addEventListener('message', (e) => {
    if (e.data === 'skipWaiting') self.skipWaiting();
});
