const SERVICE_WORKER = './sw.js';
// Register the service worker on every page.
// Promised based.
if ('serviceWorker' in navigator) {
    console.log("Registering...");
    navigator.serviceWorker.register(SERVICE_WORKER).then(function (registration) {
        console.log("Registration of " + SERVICE_WORKER + " was successful.");
    }).catch(function (error) {
        //test by using xsw.js
        console.log("ERROR registering service worker: ", error)
    });
}