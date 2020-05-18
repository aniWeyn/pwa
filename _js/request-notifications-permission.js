const btn = document.getElementById('notifications');
btn.addEventListener('click', requestNotificationPermission);

function requestNotificationPermission() {
    const btn = document.getElementById('notifications');
    Notification.requestPermission(function (result) { //default
        if (result == 'granted') {
            displayConfirmNotification();
            console.log('notification permission granted! :)');
            // disable button to prevent user clicking it.
            btn.disabled = true;
            btn.innerHTML = 'NOTIFICATIONS ENABLED';
        }
        if (result == 'denied') {
            console.log('notification permission DENIED!');
            btn.disabled = false;
        }
    });
}

function displayConfirmNotification() {
    if ('serviceWorker' in navigator) {
        var options = {
            body: 'SW: You successfully subscribed to our Notification service!',
            icon: '../_images/wppwa.png',
            image: '../_images/avatar2.png',
            dir: 'ltr',
            lang: 'en-US', // BCP 47,
            // vibrate: [100, 50, 200],
            badge: '../_images/avatar6.png', // on top bar
        };
        navigator.serviceWorker.ready
            .then(function (swreg) {
                swreg.showNotification('Successfully subscribed (from SW)!', options);
            });
    }
}