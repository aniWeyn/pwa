window.addEventListener('load', function () {

  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    const status = document.querySelector('#status');
    if (condition === "offline") {
      console.log("!!! GONE OFFLINE")
      status.className = "offline";
      status.innerHTML = "<span class='offline' style='color:red;font-weight:bold;font-size:1.5rem;'>YOU ARE NOW: " + condition.toUpperCase() + "</span>";
      // set background to grey to emphasise offline
      document.body.style.backgroundColor = "#ccc";
    } else {
      console.log("!!! BACK ONLINE")
      status.className = "";
      status.innerHTML = "";
      document.body.style.backgroundColor = "#fff";
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});