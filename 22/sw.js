const version = "22";
console.log("+++ VERSION  +++");
const staticLocalCacheName = 'PRECACHE-V' + version;
// in case remote fails it does not affect local assets which are promises
// one fails then all fails
const staticRemoteCacheName = 'PRECACHE-REMOTE-V' + version;
const localAssets = [
  './manifest.json',
  './', // for when not page specified, we need the base url
  './index.html',
  '../_images/wppwa.png',
  '../_css/w3.css',
  '../_css/pwa-course.css',

  // if you mistype or call a file not available, they all fail to load as it is a promise and transaction based.
];
const remoteAssets = [
  'https://fonts.googleapis.com/css?family=Quicksand&display=swa'
];

// SW fires event on install and activate so we listen for them.

// install event
// only reinstalled if sw has changed - goes to in waiting till all tabs closed or forced to install.
self.addEventListener('install', function (event) {
  console.log('[SW] Service worker ' + version + ' installed.');
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

// Cache OR Network "Cache then Network"
self.addEventListener('fetch', function (event) {
  //console.log(`Fetching ${event.request.url}`);
  event.respondWith(
    caches.match(event.request)
    .then(function (response) {
      return response || fetch(event.request);
    })
  );
});

// Using ASYNC/AWAIT
// self.addEventListener('fetch', (event) => {
// 	event.respondWith(
// 		(async function() {
// 			const response = await caches.match(event.request);
// 			return response || fetch(event.request);
// 		})()
// 	);
// });