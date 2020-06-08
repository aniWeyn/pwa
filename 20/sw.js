const version = 20;
self.addEventListener("install", event => {
  console.log(`SW Version ${version} installed.`);
});
//
self.addEventListener("activate", event => {
  console.log(`SW Version ${version} ACTIVATED.`);
  // once loaded we uncomment below and the browser will detect a change
  // it will install the SW again but keep in waiting
  // once we skipWaiting etc, then the second activate will fire.
});

// the FETCH event listener can be used to intercept all requests and
// then act accordingly

self.addEventListener("fetch", event => {

  // console.log("-------------------------");
  // console.log(`Fetching ${event.request.url}`);
  // // ANALYSE REQUEST AND RESPOND WITH A CACHING STRATEGY
  // const parsedUrl = new URL(event.request.url);
  // console.log("Paresed URL: ", parsedUrl);
  // const pathname = parsedUrl.pathname;
  // const regEx = /png/;
  // if (pathname.includes('.js')) {
  //   console.log("JS file => cache strategy JS")
  // }
  // if (pathname.indexOf('.css') > -1) {
  //   console.log("CSS file => cache strategy CSS")
  // }
  // if (parsedUrl.pathname.match(regEx)) {
  //   console.log("PNG file => cache strategy IMG")
  // }
  // // We can also send back a custom response
  // if (pathname.includes('ndc')) {
  //   console.log(`Fetching ${event.request.url}`);
  //   const body = `
  //         <!doctype html>
  //         <head>
  //             <title>Service Worker HTML generation</title>
  //         </head>
  //         <body>
  //             <p style="color:red;">
  //                 The URL is ${event.request.url}
  //             </p>
  //             <p>Pathname is ${pathname}
  //             <ul>
  //                 <li>Cache: ${event.request.cache}</li>
  //                 <li>Credentials: ${event.request.credential}</li>
  //                 <li>Destination: ${event.request.destination}</li>
  //                 <li>Method: ${event.request.method}</li>
  //                 <li>Referrer: ${event.request.referrer}</li>
  //             </ul>
  //         </body>
  //         </html>
  //     `;
  //   const response = new Response(body, {
  //     status: 200,
  //     statusText: "OK",
  //     headers: {
  //       "Content-type": "text/html"
  //     }
  //   });
  //   event.respondWith(response);
  // }
});