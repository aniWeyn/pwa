// version 3
try {
    importScripts("events.js");
} catch (e) {}

self.addEventListener("fetch", event => {
    console.log(`Fetching ${event.request.url}`);
    const url = event.request.url;
    const parsedUrl = new URL(event.request.url);
    if (parsedUrl.pathname.match(/api/)) {
        const response = new Response("API in RegEx.");
        event.respondWith(response);
        return
    }

    const body = `
        <!doctype html>
        <title>07 Service Worker HTML generation</title>
        <p>F04 Request Object</p>
        <h3>
        The URL is ${event.request.url}
        </h3>
        <ul>
            <li>Cache: ${event.request.cache}</li>
            <li>Credentials: ${event.request.credential}</li>
            <li>Destination: ${event.request.destination}</li>
            <li>Method: ${event.request.method}</li>
            <li>Referrer: ${event.request.referrer}</li>
        </ul>
    `;
    const response = new Response(body, {
        status: 200,
        statusText: "OK",
        headers: {
            "Content-type": "text/html"
        }
    });
    event.respondWith(response);
});