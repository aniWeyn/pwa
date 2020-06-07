self.addEventListener('install', function (event) {
    console.log('[SW] Service worker installed.');
});

// activate event - only occurs after installation so page refresh just re-registers page unles sw file has changed.
// However, only activated once all tabs closed, i.e. no page is using old sw.

self.addEventListener('activate', function (event) {
    console.log('+++ service worker activation +++');
    console.log('[Service Worker] Activating Service Worker....', event);

});

//cacheThenNetworkAndStoreThenFallback
self.addEventListener('fetch', function (event) {
    console.log("Fetch event...", event.request.url);
});