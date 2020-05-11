const version = 4;
console.log(`VERSION ${version}`);

try {
    importScripts("events.js");
} catch (e) {

}

console.log("after loading the events.js script");