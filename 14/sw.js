// SW fires event on install and activate so we listen for them.

// install event
// only reinstalled if sw has changed - goes to in waiting till all tabs closed or forced to install.

const version = "14";
self.addEventListener('install', function (event) {
  console.log('[SW] Service worker V' + version + ' installed.');
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