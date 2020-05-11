// v2

self.addEventListener("install", event => {
    console.log("Install event");
});

self.addEventListener("activate", event => {
    console.log("Activate event");
});

self.addEventListener("fetch", function (event) {
    // ES6 template litereal - back tick allows multiline and JS inside
    console.log(`Fetching ${event.request.url}`);
    const response = new Response(`
        Note: This is TEXT only<br>
        The URL is ${event.request.url}<br>
        We are using ES6 teplate literals.
        `);
    event.respondWith(response);
});