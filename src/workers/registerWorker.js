if('serviceWorker' in navigator){
    navigator.serviceWorker.register("./sw.js")
    .then(reg=>console.log('Service worker registrado'))
    .catch(err=>console.warn('error al registrar service worker', err))
}