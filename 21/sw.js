const version = 21;
const staticLocalCacheName = 'PRECACHE-LOCAL-V' + version;
// in case remote fails it does not affect local assets which are promises
// one fails then all fails
const staticRemoteCacheName = 'PRECACHE-REMOTE-V' + version;

const localAssets = [
  './manifest.json',
  './', // for when not page specified, we need the base url
  // '', // for when not page specified, we need the base url
  './index.html',

  // if you mistype or call a file not available, they all fail to load as it is a promise and transaction based.
];

const remoteAssets = [
  'https://fonts.googleapis.com/css?family=Quicksand&display=swa'
];

// SW fires event on install and activate so we listen for them.

// install event
// only reinstalled if sw has changed - goes to in waiting till all tabs closed or forced to install.
self.addEventListener('install', function (event) {
  console.log('[SW] Service worker installed.');
  event.waitUntil( // waits until all done before install event is deemed to have finished
    caches.open(staticLocalCacheName).then(function (cache) {
      //console.log('+++ caching APP SHELL assets +++');
      cache.addAll(localAssets);
    })
    .then(
      caches.open(staticRemoteCacheName).then(function (cache) {
        // we split local and remote preCache in case there are issues with other servers etc 
        // if one failed all fail.
        //console.log('+++ caching REMOTE assets +++');
        cache.addAll(remoteAssets);
      }))
    // SKIPWAITING
    //.then(self.skipWaiting()) // forces installation of new sw
    .catch(function (error) {
      console.log(error);
    })
  );

});

// However, only activated once all tabs closed, i.e. no page is using old sw.

self.addEventListener('activate', function (event) {
  console.log('+++ service worker activation +++');
  console.log('[Service Worker] Activating Service Worker....', event);

});

//cacheThenNetworkAndStoreThenFallback
self.addEventListener('fetch', function (event) {
  //console.log(`Fetching ${event.request.url}`);
});