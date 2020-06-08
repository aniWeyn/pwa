// Note: put() will overwrite any key/value pair previously stored in the cache that matches the request.
// It is like cache.add except it has two valuse of request and response.
// cache.add just uses request

// Note: Cache.add/Cache.addAll do not cache responses with Response.status values that are not in the 200 range, whereas Cache.put lets you store any request/response pair. As a result, Cache.add/Cache.addAll can't be used to store opaque responses, whereas Cache.put can.

// https://developer.mozilla.org/en-US/docs/Web/API/Cache/put

// https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network


////////////////////////////////////////////////////////
// Cache OR Network "Cache Then Network"

self.addEventListener('fetch', function (event) {
    console.log('fetch event', event);
    event.respondWith(
        caches.match(event.request) // try to find entry for this request in CACHE API
        .then(function (cacheResponse) {
            // check cache then return result if not null
            // if so (|| equals OR) go on to network as normal
            return cacheResponse || fetch(event.request);
        })
    );
});

////////////////////////////////////////////////////////
// Cache OR (Network AND make and cache copy)

self.addEventListener('fetch', event => {
    //console.log('fetch event', event);
    event.respondWith(
        caches.match(event.request).then(cacheRes => {
            // go to cache and if null go to network
            return cacheRes || fetch(event.request).then(fetchRes => {
                // open up dynamic cache 
                return caches.open(dynamicCacheName).then(cache => {
                    // make a clone and store in dynamic cache for future use
                    // as the response is a STREAM we can only consume once so 
                    // make a copy/clone
                    cache.put(event.request.url, fetchRes.clone());
                    // return rsult of network request
                    return fetchRes;
                })
            });
        })
    );
});


////////////////////////////////////////////////////////
// Cache OR (Network make and cache copy OR generic fallback)
// As Cache then Network and Store but if the network request fails
// then CATCH the error and return the fallback page.

self.addEventListener('fetch', event => {
    const parsedUrl = new URL(event.request.url);
    //console.log('fetch event', event);
    event.respondWith(
        caches.match(event.request)
        .then(cacheRes => {
            return cacheRes || fetch(event.request)
                .then(fetchRes => {
                    return caches.open(dynamicCacheName).then(cache => {
                        cache.put(event.request.url, fetchRes.clone());
                        return fetchRes;
                    })
                });
        })

        .catch(() => {
            // can have different fallbacks depending on file type.
            if (parsedUrl.contains('.html')) {
                caches.match('fallback.html')
            }
        })

    );
});

////////////////////////////////////////////////////////
// Cache THEN (Network make and cache copy OR generic fallback)
// "Stale while revalidate"
// https://jakearchibald.com/2014/offline-cookbook/#stale-while-revalidate

self.addEventListener('fetch', (event) => {
    event.respondWith(async function () {
        const cache = await caches.open(dynamicCacheName);
        const cachedResponse = await cache.match(event.request);
        const networkResponsePromise = fetch(event.request);

        event.waitUntil(async function () {
            const networkResponse = await networkResponsePromise;
            await cache.put(event.request, networkResponse.clone());
        }());

        // Returned the cached response if we have one, otherwise return the network response.
        return cachedResponse || networkResponsePromise;
    }());
});