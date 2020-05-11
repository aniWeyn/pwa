let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Capture the event so it can be triggered later.
    deferredPrompt = e;

});
const btnAdd = document.getElementById('add')
btnAdd.addEventListener('click', (e) => {
    //alert("Testing...")
    // hide our user interface that shows our A2HS button

    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    // We can remove button as required.
})