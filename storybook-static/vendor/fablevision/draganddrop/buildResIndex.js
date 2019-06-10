const fs = require('fs');

const args = process.argv.slice(2);
let basePath = (process.env.npm_package_config_basePath || "").trim();

for(let arg of args){
    let key = arg.split("=")[0];

    if(key.toLowerCase() === "-basepath"){
        basePath = arg.split("=")[1];
    }
}

var files = {
    audio: {
        music: [],
        sfx: []
    },
    images: [],
    models: []
};

var getFiles = function(path, files, filetypes){
    fs.readdirSync(path).forEach(function(file){
        var subpath = path + '/' + file;
        if(fs.lstatSync(subpath).isDirectory()){
            getFiles(subpath, files, filetypes);
        } else {
            var p = path.replace("app/", ""); // Removes the parent directory

            if(filetypes.indexOf(file.split('.').pop()) > -1){
                if(file.indexOf("@2x") < 0) // temp
                files.push(basePath + "" + p + '/' + file);
            }
        }
    });     
}

getFiles('app/res/audio/sfx', files.audio.sfx, ['mp3']);
getFiles('app/res/audio/music', files.audio.music, ['mp3']);
getFiles('app/res/img', files.images, ['png', 'jpg', 'gif', 'svg']);

// Write sprite file
fs.writeFileSync(`app/res/index.js`, "export default " + JSON.stringify(files));