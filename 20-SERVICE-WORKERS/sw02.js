console.log("We are a service worker using an imported JS file.");

try {
    // this is SYNCHROMOUS
    importScripts("events.js");
} catch (e) {

}
//
console.log("after loading the events.js script");