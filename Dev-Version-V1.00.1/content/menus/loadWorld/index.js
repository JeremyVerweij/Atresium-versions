const fs = require("fs");
const { ipcRenderer } = require("electron");

var __src, __userData, __versionDir, selectedWorld;

const main = document.getElementsByTagName("main")[0];

function loadWorldsAndDisplayInDOM() {
    var worlds = fs.readdirSync(`${__versionDir}/worlds`);

    worlds.sort((a,b)=> {return (fs.statSync(`${__versionDir}/worlds/${b}`).mtimeMs-fs.statSync(`${__versionDir}/worlds/${a}`).mtimeMs);});
    
    if(fs.existsSync(`${__versionDir}/icon.png`)) var styleTmp = `background-image: url(${__versionDir}/icon.png);`;
    else var styleTmp = `background-image: url(./icon.png);`;

    for (let i = 0; i < worlds.length; i++) {
        const element = worlds[i];
        const url = `${__versionDir}/worlds/${element}`;

        const tmp = document.createElement('div');
        tmp.classList.add("listItem");
        tmp.innerHTML = `<div class="name">${element.split(".")[0]}</div>`;
        tmp.style = styleTmp;

        tmp.addEventListener("click", () => {
            if(selectedWorld)selectedWorld.html.classList.remove("selected");

            selectedWorld = {
                element: element,
                url: url,
                html: tmp
            };

            selectedWorld.html.classList.add("selected");
        })

        main.appendChild(tmp);
    }
}

ipcRenderer.send("path-get");
ipcRenderer.on("path-send", (_, path) => {
    path = JSON.parse(path);
    __src = path.__src;
    __userData = path.__userData;

    var tmp = JSON.parse(fs.readFileSync(`${__userData}/.Atresium/temp/paths.json`));
    __versionDir = tmp.__selectedAppUrl;
    __src = tmp.__src;
    __userData = tmp.__userData;

    loadWorldsAndDisplayInDOM();
})

