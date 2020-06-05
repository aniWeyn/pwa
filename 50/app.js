// Listend for mssage from SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("serviceworker.js");
    navigator.serviceWorker.addEventListener("message", event => {
        switch (event.data.action) {
            case "resources-updated":
                alert("resources-updated [sent from SW]");
                break;
        }
    });
}
// send msg from PAGE to SW
function sendMessageToSW(message) {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage(message);
        console.log("SEND MESSAGE TO SW");
    } else {
        console.log("There is no SW controlling this page");
    }
}
// Listen for button clicked in page
function update() {
    sendMessageToSW({
        action: "update-resources",
        filename: 'fallback.html'
    });
}