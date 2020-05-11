self.addEventListener("install", event => {
    console.log("Install event");
});

self.addEventListener("activate", event => {
    console.log("Activate event");
});

self.addEventListener("fetch", event => {
    console.log(`Fetching ${event.request.url}`);
    const body = `
        <!doctype html>
        <title>This TITLE was changed in SW</title>
        <h3 style="color:red;">
        The URL is ${event.request.url}
        </h3>
        <p>Notice how the TITLE on tab has changed
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