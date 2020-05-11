window.addEventListener('load', function () {
  var status = document.getElementById("status");
  //var log = document.getElementById("log");

  function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";
    if (condition === "offline") {
      status.className = "offline";
      status.innerHTML = "<span class='offline' style='color:red;font-weight:bold;font-size:1.5rem;'>YOU ARE NOW: " + condition.toUpperCase() + "</span>";
      // set background to grey to emphasise offline
      document.body.style.backgroundColor = "#ccc";
    } else {
      status.className = "";
      status.innerHTML = "";
      document.body.style.backgroundColor = "#fff";
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});