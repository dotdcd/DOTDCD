const CACHENAME = 'v1_cache_DOTDCD',
urlsToCache=[
    '/'
]

self.addEventListener('install', e=>{
    e.waitUntil(
        caches.open(CACHENAME)
        .then(cache =>{
            return cache.addAll(urlsToCache)
            .then(()=>self.skipWaiting())
        })
        .catch(err=>console.log('Error al registrar cache', err))
    )
})

//funcionar sin conexion
self.addEventListener('activate', e=>{
    const cacheWhitelist = [CACHENAME]

    e.waitUntil(
        caches.keys()
        .then(cacheNames=>{
            cacheNames.map(cacheName=>{
                if(cacheWhitelist.indexOf(cacheName) ==-1){
                    return caches.delete(cacheName)
                }
            })
        })
        .then(()=>self.clients.claim())
    )
})

self.addEventListener('fetch', e=>{
    e.respondWith(
        caches.match(e.request)
        .then(res=>{
            if(res){
                return res
            }
            
            return fetch(e.request)
        })
    )
})
