// Note: put() will overwrite any key/value pair previously stored in the cache that matches the request.
// It is like cache.add except it has two valuse of request and response.
// cache.add just uses request

// Note: Cache.add/Cache.addAll do not cache responses with Response.status values that are not in the 200 range, whereas Cache.put lets you store any request/response pair. As a result, Cache.add/Cache.addAll can't be used to store opaque responses, whereas Cache.put can.

// https://developer.mozilla.org/en-US/docs/Web/API/Cache/put

// https://jakearchibald.com/2014/offline-cookbook/#cache-falling-back-to-network

// fetch event
// Cache OR Network
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

// fetch event
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


// fetch event
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
        }).catch(() => {
            // can have different fallbacks depending on file type.
            if (parsedUrl.contains('.html')) {
                caches.match('fallback.html')
            }
        })

    );
});

// Mix and match cache
// We have access to the exact URL from event.request.url
// We can then pick a caching strategy based on the URL
// JS indexOf, startsWith, includes or RegEx

// https://www.w3schools.com/jsref/jsref_includes.asp
// https://www.w3schools.com/jsref/jsref_indexof.asp
// https://www.w3schools.com/jsref/jsref_startswith.asp
// https://www.w3schools.com/jsref/jsref_obj_regexp.asp

// var str = "The best things in life are free";
// var patt = new RegExp("e");
// var res = patt.test(str);