/**
 * =====================================================
 * 🔧 Font Studio Pro - Service Worker
 * =====================================================
 * يوفر التخزين المؤقت والعمل بدون اتصال
 */

const CACHE_NAME = 'font-studio-v1.0.0';
const STATIC_CACHE = 'font-studio-static-v1';
const DYNAMIC_CACHE = 'font-studio-dynamic-v1';
const FONT_CACHE = 'font-studio-fonts-v1';

// الملفات الأساسية للتخزين المؤقت
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/js/app.js',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
    
    // External CDN resources
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js',
    
    // Google Fonts
    'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800;900&display=swap'
];

// =====================================================
// 📥 Install Event
// =====================================================

self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Static assets cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Failed to cache static assets:', error);
            })
    );
});

// =====================================================
// 🔄 Activate Event
// =====================================================

self.addEventListener('activate', (event) => {
    console.log('🔧 Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE && 
                                   cacheName !== FONT_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// =====================================================
// 🌐 Fetch Event
// =====================================================

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isStaticAsset(url)) {
        // Cache-first for static assets
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isFontRequest(url)) {
        // Cache-first for fonts
        event.respondWith(cacheFirst(request, FONT_CACHE));
    } else if (isApiRequest(url)) {
        // Network-first for API calls
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // Stale-while-revalidate for other requests
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

// =====================================================
// 📋 Caching Strategies
// =====================================================

// Cache First - للأصول الثابتة
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Network request failed:', error);
        return new Response('Offline', { status: 503 });
    }
}

// Network First - للـ API
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response(JSON.stringify({ error: 'Offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Stale While Revalidate - للمحتوى الديناميكي
async function staleWhileRevalidate(request, cacheName) {
    const cachedResponse = await caches.match(request);
    
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                caches.open(cacheName)
                    .then((cache) => cache.put(request, networkResponse.clone()));
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// =====================================================
// 🔍 Helper Functions
// =====================================================

function isStaticAsset(url) {
    const staticExtensions = ['.html', '.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext)) || url.pathname === '/';
}

function isFontRequest(url) {
    const fontExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    return fontExtensions.some(ext => url.pathname.endsWith(ext)) ||
           url.hostname === 'fonts.googleapis.com' ||
           url.hostname === 'fonts.gstatic.com';
}

function isApiRequest(url) {
    return url.pathname.startsWith('/api/');
}

// =====================================================
// 📨 Message Handling
// =====================================================

self.addEventListener('message', (event) => {
    const { action, data } = event.data;
    
    switch (action) {
        case 'skipWaiting':
            self.skipWaiting();
            break;
            
        case 'clearCache':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'cacheFont':
            cacheFontFile(data.url, data.name).then(() => {
                event.ports[0].postMessage({ success: true });
            });
            break;
            
        case 'getCacheSize':
            getCacheSize().then((size) => {
                event.ports[0].postMessage({ size });
            });
            break;
    }
});

async function clearAllCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
}

async function cacheFontFile(url, name) {
    const cache = await caches.open(FONT_CACHE);
    const response = await fetch(url);
    await cache.put(url, response);
}

async function getCacheSize() {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
            usage: estimate.usage,
            quota: estimate.quota,
            percentage: ((estimate.usage / estimate.quota) * 100).toFixed(2)
        };
    }
    return null;
}

// =====================================================
// 🔔 Push Notifications
// =====================================================

self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'تحديث جديد من فونت ستوديو',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'open', title: 'فتح التطبيق' },
            { action: 'close', title: 'إغلاق' }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('فونت ستوديو', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// =====================================================
// 🔄 Background Sync
// =====================================================

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-projects') {
        event.waitUntil(syncProjects());
    }
});

async function syncProjects() {
    // Sync logic here
    console.log('Syncing projects...');
}

console.log('🚀 Font Studio Service Worker loaded');
