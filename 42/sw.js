// importScripts('js/idb-keyval.js');
// importScripts('js/idb.js');
// importScripts('js/idb-fn.js');
importScripts('../_js/localforage.min.js');
var version = "42";
// Set fallback page. We can have several and select acordingly in fetch>catch code at bottom of file.
var FALLBACK_PAGE = "fallback.html";
// If not using ignore:querySearch then use this fallback in catch for article.php?id=XXXX
// var ARTICLE_FALLBACK_PAGE = "article.php"; // necessary for article.php?id=xxxx
console.log("+++ VERSION " + version + " +++");
var staticLocalCacheName = 'PRECACHE-V' + version;
// in case remote fails it does not affect local assets which are promises
// one fails then all fails
var staticRemoteCacheName = 'PRECACHE-REMOTE-V' + version;
// NEW-----
// DYNAMIC CACHE
var dynamicCacheName = 'DYNAMIC-V' + version;
var localAssets = [
  './manifest.json',
  './', // for when not page specified, we need the base url
  './index.html',
  './fallback.html',
  './article.html',
  './articles.html',
  './contacts.html',
  '../_images/wppwa.png',
  '../_css/w3.css',
  '../_css/pwa-course.css',
  '../_js/idb-fn.js', // our IndexedDB utility functions
  '../_js/idb.js', // IndexedDB library          
  '../_js/dexie.js', // IndexedDB library
  '../_js/idb-keyval.js', // IndexedDB library
  '../_js/promise.js', // polyfills
  '../_js/fetch.js', // polyfills
  '../_js/localforage.min.js', // localforage
  '../_js/style-offline.js',
  '../_js/gone-offline.js'
  // if you mistype or call a file not available, they all fail to load as it is a promise and transaction based.
];
var remoteAssets = [
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
    .then(self.skipWaiting()) // forces installation of new sw
    .catch(function (error) {
      console.log(error);
    })
  );
});
// limit number of entries in a cache
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        //delete oldest (first) entry
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    })
  })
};
self.addEventListener('activate', function (event) {
  console.log('+++ service worker activation +++');
  console.log('[Service Worker] Activating Service Worker  ' + version + ' ....', event);
  // clear old caches
  // sendMessage(`ACTIVATE: SW Version: ${version - 2} now active...please refresh page`);
  alertPagesUpdate(`<h1 style="color:green;">SERVICE WORKER ACTIVATED Version: ${version}<h1>`);
  event.waitUntil(
    caches.keys()
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== staticLocalCacheName && key !== staticRemoteCacheName && key !== dynamicCacheName) {
          //console.log('[Service Worker] Removing old cache.', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim(); // with skipWaiting ensures all tabs/pages have new sw
  //The claim() method of the Clients allows an active service worker to set itself as the controller for all clients within its scope. This triggers a "controllerchange" event on navigator.serviceWorker in any clients that become controlled by this service worker.
  //When a service worker is initially registered, pages won't use it until they next load. The claim() method causes those pages to be controlled immediately. Be aware that this results in your service worker controlling pages that loaded regularly over the network, or possibly via a different service worker.
});
//cacheThenNetworkAndStoreThenFallback
self.addEventListener('fetch', function (event) {
  //console.log(event);
  event.respondWith(
    caches.match(event.request, {
      ignoreSearch: true
    })
    // {ignoreSearch: true} add to ignore querystring rather than use catch 
    // to handle various urls that would be formed.
    .then(function (cacheResponse) {
      if (cacheResponse) {
        return cacheResponse;
      } else {
        //console.log(event.request);
        return fetch(event.request) //
          .then(function (networkResponse) {
            return caches.open(dynamicCacheName)
              .then(function (cache) {
                //console.log('+++ STORING : ' + event.request.url + ' in CACHE: ' + dynamicCacheName + " +++");
                cache.put(event.request.url, networkResponse.clone());
                // response is a stream
                // and can only be consumed once so we make a clone/copy.
                // ++++++++ limit Cache Size ++++++++++
                // limitCacheSize(dynamicCacheName, 5);
                // ++++++++++++++++++++++++++++++++++++
                return networkResponse;
              });
          });
      }
    })
    .catch(function () { // catch occurs if failure occurs
      // If both fail, show a generic fallback:
      return caches.match(FALLBACK_PAGE);
    })
  );
});
//+++++ BACKGROUND SYNC +++++
// This is for BackgroundSync where we store form data from CONTACT page, for example,
// that is then sent when back online.
// If we are online then this will run immediately.
self.addEventListener('sync', function (event) {
  if (event.tag == 'SEND') {
    console.log("===== in serviceWorker =====");
    console.log(event);
    console.log("SEND SYNC TAG heard");
    console.log("Sending form data...");
    // console.log("DELETE IndexedDB data...")
    // localforage.removeItem('FORM-DATA').then(function () {
    //   // Run this code once the key has been removed.
    //   console.log('FROM-DATA is cleared!');
    // }).catch(function (err) {
    //   // This code runs if there were any errors
    //   console.log(err);
    // });
    const title = 'Form has been sent';
    const options = {
      body: 'Your form has been sent to us..\nWe will contact you shortly. :)'
    };
    self.registration.showNotification(title, options);
    // postMessage API to send message to form
    sendMessage(`<div style="font-size:22px;font-weight:bold;color:green;"--->--->--->---> FORM SENT...</div>`);
  }
});
//COMMUNICATION TO AND FROM PAGE/SW
//------------------------------------
// SW => PAGE
function sendMessage(msg) {
  console.log("FN sendMessage");
  self.clients.matchAll()
    .then(
      function (clients) {
        clients.forEach(function (client) {
          console.log("[SW] sending message to PAGE " + msg);
          console.log("CLIENT " + client);
          client.postMessage(msg);
        })
      }
    )
}
// SW => PAGE
function alertPagesUpdate(msg) {
  clients.matchAll({
    includeUncontrolled: true,
    type: "window"
  }).then(clients => {
    clients.forEach(client => {
      const clientId = client.id;
      const type = client.type;
      const url = client.url;
      client.postMessage(msg)
    })
  })
}
// FROM PAGE => SW
self.addEventListener("message", event => {
  const message = event.data;
  console.log("");
  console.log("----- SW receiving messge from PAGE -----");
  console.log(message);
  console.log("----- SW receiving messge from PAGE -----");
  console.log("");
});