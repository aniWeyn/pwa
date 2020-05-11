console.log("We are a service worker 3");

self.addEventListener("install", event => {
   console.log("Install event - 2");
});
//
self.addEventListener("activate", event => {
   console.log("Activate event - 3");
   // once loaded we uncomment below and the browser will detect a change
   // it will install the SW again but keep it in 'waiting'
   // once we use skipWaiting or Update On Reload checkbox, then the second activate will fire.

});