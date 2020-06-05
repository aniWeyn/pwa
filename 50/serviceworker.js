var localAssets = [
    'index.html'
];


self.addEventListener("install", event => {
    event.waitUntil(
        caches.open("TEST-CACHE")
        .then(cache => {
            cache.addAll(localAssets);
        })
        .then(self.skipWaiting()) // forces installation of new sw
        .catch(function (error) {
            console.log(error);
        })
    )

});

self.addEventListener("message", event => {
    console.log(event);
    const message = event.data;
    caches.open("UPDATE-CACHE")
        .then(function (cache) {
            cache.add(message.filename)
                .then(() => {
                    console.log("added wp-html")
                    alertPagesUpdate();
                })
        })

});

function alertPagesUpdate() {
    self.clients.matchAll({
        includeUncontrolled: false,
        type: "window"
    }).then(clients => {
        self.clients.forEach(client => {
            const clientId = client.id;
            const type = client.type;
            const url = client.url;
            let msg = "resources-updated";
            console.log("CLIENT: " + clientId);
            console.log("TYPE: " + type);
            console.log("URL: " + url);
            console.log("POSTING MESSAGE: " + msg);
            client.postMessage({
                action: msg
            })
        })
    })
}




self.addEventListener("fetch", event => {
    console.log("[SW] FETCH EVENT");
})