function openApp(app) {
  document.getElementById("app-window").classList.remove("hidden");

  let content = document.getElementById("app-content");

  if (app === "settings") {
    content.innerHTML = "<h2>Settings</h2><p>Wi-Fi, Bluetooth, Display</p>";
  }

  if (app === "notes") {
    content.innerHTML = "<h2>Notes</h2><textarea style='width:100%; height:300px;'></textarea>";
  }

  if (app === "camera") {
    content.innerHTML = "<h2>Camera</h2><p>Camera simulator loading...</p>";
  }
}

function closeApp() {
  document.getElementById("app-window").classList.add("hidden");
}
