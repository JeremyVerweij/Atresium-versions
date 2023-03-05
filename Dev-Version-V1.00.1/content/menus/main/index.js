const { ipcRenderer } = require('electron')

const singlePlayer = document.getElementById("singlePlayer");
const multiPlayer = document.getElementById("multiPlayer");
const settings = document.getElementById("settings");
const lang = document.getElementById("lang");
const mods = document.getElementById("mods");
const quit = document.getElementById("quit");

singlePlayer.addEventListener("click", () => window.location = "../loadWorld/index.html")
multiPlayer.addEventListener("click", () => window.location = "../multiPlayer/index.html")
settings.addEventListener("click", () => window.location = "../settings/index.html")
lang.addEventListener("click", () => window.location = "../lang/index.html")
mods.addEventListener("click", () => window.location = "../mods/index.html")
quit.addEventListener("click", () => ipcRenderer.send('quit'))