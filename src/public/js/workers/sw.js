const CACHENAME = 'v1_cache_DOTDCD'

//funcionar sin conexion
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHENAME]

    e.waitUntil(
        caches.keys()
            .then(cacheNames => {
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) == -1) {
                        return caches.delete(cacheName)
                    }
                })
            })
            .then(() => self.clients.claim())
    )
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if (res) {
                    return res
                }

                return fetch(e.request)
            })
    )
})

self.addEventListener('push', function (e) {
    const message = e.data.json(); // 1

    const options = { // 2
        body: message.body,
        data: 'https://dotdcd.com.mx/',
        actions: [
            {
                action: 'Detail',
                title: 'Detalles'
            }
        ]
    };

    e.waitUntil(self.registration.showNotification(message.title, options)); // 3
});