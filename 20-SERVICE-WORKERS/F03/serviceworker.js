// version 6
try {
    importScripts("events.js");
} catch (e) {}

self.addEventListener("fetch", event => {
    console.log(`Fetching ${event.request.url}`);
    const parsedUrl = new URL(event.request.url);
    const pathname = parsedUrl.pathname;
    if (pathname == '/PWA/20-SERVICE-WORKERS/F03/html') {
        console.log(`Fetching ${event.request.url}`);
        const body = `
            <!doctype html>
            <head>
                <title>Service Worker HTML generation</title>
            </head>
            <body>
                <p style="color:red;">
                    The URL is ${event.request.url}
                </p>
                <p>Pathname is ${pathname}
                <ul>
                    <li>Cache: ${event.request.cache}</li>
                    <li>Credentials: ${event.request.credential}</li>
                    <li>Destination: ${event.request.destination}</li>
                    <li>Method: ${event.request.method}</li>
                    <li>Referrer: ${event.request.referrer}</li>
                </ul>
            </body>
            </html>
        `;
        const response = new Response(body, {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-type": "text/html"
            }
        });
        event.respondWith(response);
        return;
    }
    if (pathname == '/PWA/20-SERVICE-WORKERS/F03/api') {
        console.log(`API ${event.request.url}`)
        const object = {
            temp: 56
        }
        const jsonResponse = new Response(JSON.stringify(object), {
            status: 200,
            statusText: "OK",
            headers: {
                "Content-Type": "application/json"
            }
        })
        event.respondWith(jsonResponse);
    }


});