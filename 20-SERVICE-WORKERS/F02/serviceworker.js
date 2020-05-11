const version = 9;
console.log(`Service Worker V${version}`);

try {
    importScripts("./events.js");
    // for many files we could do several importScripts but using 
    // importScripts("file1.js2", "file2.js") 
    // means the may be downloaded in parallel rather than serially

    // navigator.serviceWorker.register(<url>, {'updateViaCache':'imports|none|all'})
    // when we register SW, we can specify whether we use the broswer http cache
    // imports = just those in importScripts
    // none = bypass cache for all files
    // all = use cache for all files
} catch (e) {

}

console.log("after loading the events.js script");