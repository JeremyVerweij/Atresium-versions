const fs = require("fs");
const { ipcRenderer } = require("electron");

var __src, __userData, __versionDir, waitUntilAllModloadersAreLoaded = 0, vanillaLoaded = false;

ipcRenderer.send("path-get");
ipcRenderer.on("path-send", (_, path) => {
    path = JSON.parse(path);
    __src = path.__src;
    __userData = path.__userData;

    var tmp = JSON.parse(fs.readFileSync(`${__userData}/.Atresium/temp/paths.json`));
    __versionDir = tmp.__selectedAppUrl;

    load_content_into_temp();
})

function mod_loader_completed(f){
    if(!f)waitUntilAllModloadersAreLoaded -= 1;
    if(waitUntilAllModloadersAreLoaded===0){
        var a = ()=>{
            if(vanillaLoaded){
                console.log("everything is set up corectly now continue to startscreen");
                window.location = "./menus/main/index.html";
            }else setTimeout(a, 100);
        }
        a();
    }
}

function load_content_into_temp() {
    fs.rmSync(`${__userData}/.Atresium/temp/content`, { recursive: true, force: true });
    fs.mkdirSync(`${__userData}/.Atresium/temp/content`);
    fs.mkdirSync(`${__userData}/.Atresium/temp/content/resources`);
    fs.mkdirSync(`${__userData}/.Atresium/temp/content/img`);
    fs.mkdirSync(`${__userData}/.Atresium/temp/content/lang`);
    fs.mkdirSync(`${__userData}/.Atresium/temp/content/scripts`);
    var loaders = [];
    var MODLOADERS = fs.readdirSync(`${__versionDir}/modloaders`);
    try{
        for (let i = 0; i < MODLOADERS.length; i++) {
            const element = `${__versionDir}/modloaders/` + MODLOADERS[i];
            if(fs.lstatSync(element).isDirectory()){
                loaders.push(element);
                waitUntilAllModloadersAreLoaded += 1;
                try{
                    var tmp = require(element + "/load.js");
                    tmp();
                }catch {console.error(`There was an error trying to load file:${element}/load.js`);};
            }
        }
    }catch{console.error("There was an error trying to load the mod loaders");};

    var AtresiumLoadableContent = fs.readdirSync(`${__versionDir}/content/content/scripts`);
    for (let i = 0; i < AtresiumLoadableContent.length; i++) {
        const element = `${__versionDir}/content/content/scripts/` + AtresiumLoadableContent[i];
        fs.copyFileSync(element, `${__userData}/.Atresium/temp/content/scripts/${AtresiumLoadableContent[i]}`);
    }

    var AtresiumLoadableContent = fs.readdirSync(`${__versionDir}/content/content/lang`);
        for (let i = 0; i < AtresiumLoadableContent.length; i++) {
        const element = `${__versionDir}/content/content/lang/` + AtresiumLoadableContent[i];
        fs.copyFileSync(element, `${__userData}/.Atresium/temp/content/lang/${AtresiumLoadableContent[i]}`);
    }

    var AtresiumLoadableContent = fs.readdirSync(`${__versionDir}/content/content/resources`);
        for (let i = 0; i < AtresiumLoadableContent.length; i++) {
        const element = `${__versionDir}/content/content/resources/` + AtresiumLoadableContent[i];
        fs.copyFileSync(element, `${__userData}/.Atresium/temp/content/resources/${AtresiumLoadableContent[i]}`);
    }

    var AtresiumLoadableContent = fs.readdirSync(`${__versionDir}/content/content/img`);
        for (let i = 0; i < AtresiumLoadableContent.length; i++) {
        const element = `${__versionDir}/content/content/img/` + AtresiumLoadableContent[i];
        fs.copyFileSync(element, `${__userData}/.Atresium/temp/content/img/${AtresiumLoadableContent[i]}`);
    }

    for (let i = 0; i < loaders.length; i++) {
        const element = loaders[i];
        try{
            var tmp = require(element + "/content-loader.js");
            tmp();
        }catch {console.error(`There was an error trying to load file:${element}/content-loader.js`);};
    }
    setTimeout(()=>vanillaLoaded = true, 2000)
    mod_loader_completed(true);
}