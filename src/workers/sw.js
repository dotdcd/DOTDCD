const CACHENAME = 'v1_cache_DOTDCD',
urlsToCache=[
    './',
    'https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;1,800&display=swap',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/@popperjs/core@2.10.2/dist/umd/popper.min.js',
    "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.min.js",
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js',
    
    
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
