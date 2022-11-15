
if('serviceWorker' in navigator){
    try {
        navigator.serviceWorker.register("/js/workers/sw.js", {scope: "./",})
        console.log('Service worker registrado')
    } catch (error) {
        console.warn('error al registrar service worker', err)
    }
}

console.log('asd')