/**
 * Font Studio Pro - Service Worker v2.0
 * تم التحديث لحل مشكلة الكاش
 */

const CACHE_VERSION = 'v2.0.1'; // ⭐ غيّر هذا الرقم كل مرة تحدث فيها الملفات
const CACHE_NAME = 'font-studio-' + CACHE_VERSION;

// =====================================================
// 📥 Install - تثبيت وتخطي الانتظار فوراً
// =====================================================
self.addEventListener('install', (event) => {
    console.log('🔧 SW: Installing new version...');
    self.skipWaiting(); // ⭐ تفعيل فوري بدون انتظار
});

// =====================================================
// 🔄 Activate - حذف جميع الكاش القديم
// =====================================================
self.addEventListener('activate', (event) => {
    console.log('🔧 SW: Activating...');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // حذف أي كاش لا يطابق الإصدار الحالي
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ SW: Activated and claimed clients');
            return self.clients.claim(); // ⭐ التحكم فوراً في جميع الصفحات
        })
    );
});

// =====================================================
// 🌐 Fetch - استراتيجية Network First (الشبكة أولاً)
// =====================================================
self.addEventListener('fetch', (event) => {
    // تجاهل الطلبات غير GET
    if (event.request.method !== 'GET') return;
    
    // تجاهل طلبات chrome-extension وغيرها
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        // ⭐ جرب الشبكة أولاً (للحصول على أحدث نسخة)
        fetch(event.request)
            .then((response) => {
                // إذا نجح، خزّن نسخة في الكاش
                if (response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                // إذا فشلت الشبكة، استخدم الكاش
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // صفحة Offline إذا لم يوجد كاش
                    return new Response('Offline', { 
                        status: 503, 
                        statusText: 'Service Unavailable' 
                    });
                });
            })
    );
});

// =====================================================
// 📨 Message - استقبال الرسائل من التطبيق
// =====================================================
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data === 'clearCache') {
        caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
        });
    }
});

console.log('🚀 Font Studio SW v' + CACHE_VERSION + ' loaded');
