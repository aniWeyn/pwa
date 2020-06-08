var version = '24';

// Set fallback page. We can have several and select acordingly in fetch>catch code at bottom of file.
var FALLBACK_PAGE = 'fallback.html'; // grey background
var FALLBACK_PAGE2 = 'fallback2.html'; //white background

// If not using ignore:querySearch then use this fallback in catch for article.php?id=XXXX
//var ARTICLE_FALLBACK_PAGE = "article.php"; // necessary for article.php?id=xxxx

console.log('+++ VERSION ' + version + ' +++');
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
	'./fallback2.html',
	'../_images/wppwa.png',
	'../_css/w3.css',
	'../_css/pwa-course.css'

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
	event.waitUntil(
		// waits until all done before install event is deemed to have finished
		caches
		.open(staticLocalCacheName)
		.then(function (cache) {
			//console.log('+++ caching APP SHELL assets +++');
			cache.addAll(localAssets);
		})
		.then(
			caches.open(staticRemoteCacheName).then(function (cache) {
				// we split local and remote preCache in case there are issues with other servers etc
				// if one failed all fail.
				//console.log('+++ caching REMOTE assets +++');
				cache.addAll(remoteAssets);
			})
		)
		.then(self.skipWaiting()) // forces installation of new sw
		.catch(function (error) {
			console.log(error);
		})
	);
});

// limit number of entries (size) in a cache
const limitCacheSize = (name, size) => { //!size is number of entries not file size
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

	// ++++++++++++++++
	// clear old caches
	// ++++++++++++++++
	event.waitUntil(
		caches.keys()
		.then(function (keyList) {
			console.log("!!! Clearing old caches");
			// remove previous version caches where current version != current version
			return Promise.all(keyList.map(function (key) {
				console.log(key) // versions of cache
				if (key !== staticLocalCacheName && key !== staticRemoteCacheName && key !== dynamicCacheName) {
					console.log(`[Service Worker] Current cache V${version} - Removing old cache ${key}`);
					return caches.delete(key);
				}
			}));
		}));
	return self.clients.claim();

	// with skipWaiting ensures all tabs/pages have new sw
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
								limitCacheSize(dynamicCacheName, 4);
								// ++++++++++++++++++++++++++++++++++++
								return networkResponse;
							});
					});
			}
		})
		.catch(function () {
			// catch occurs if failure occurs
			// If both fail, show a generic fallback for html pages in this example:

			// ANALYSE REQUEST AND RESPOND WITH A CACHING STRATEGY
			const parsedUrl = new URL(event.request.url);
			//console.log("Paresed URL: ", parsedUrl);
			const pathname = parsedUrl.pathname;
			console.log(pathname);

			// FALLBACK PAGE
			if (pathname.indexOf('.html') > -1) {
				console.log("         ");
				console.log("         ");
				console.log("!!!!!!!!!!!!!");
				console.log("PATHNAME " + pathname);
				console.log("         ");
				console.log("HTML file => cache strategy HTML");
				console.log("         ");
				console.log("USE FALLBACK_PAGE");
				console.log("         ");
				console.log("!!!!!!!!!!!!!");
				console.log("         ");
				console.log("         ");
				if (pathname.indexOf('form.html') > -1) {
					return caches.match(FALLBACK_PAGE);
				} else {
					return caches.match(FALLBACK_PAGE2);
				}
			}
		})
	);
});