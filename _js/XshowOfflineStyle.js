var status = document.getElementById("status");
if (!navigator.onLine) {
    document.body.style.backgroundColor = "#ccc";
    status.innerHTML = "<span class='offline' style='color:red;font-weight:bold;font-size:1.5rem;'>YOU ARE NOW: OFFLINE</span>";
} else {
    document.body.style.backgroundColor = "#fff";
}