var jsonfile = require('jsonfile');
var os = require('os');

function writeFatih(data){
    return new Promise( (resolve, reject) => {
        jsonfile.writeFile(`${process.cwd()}/.fatih`, data, {spaces: 2}, function(err){
            if(err){
                reject(err);
            } else {
                resolve(true);
            }
        });
    }); 
}

function readFatih(data){
   
    try {
        return jsonfile.readFileSync(`${process.cwd()}/.fatih`);
    }catch(err){
        return null;
    }

}

function writeSettingsFatih(data){
    return new Promise( (resolve, reject) => {
        jsonfile.writeFile(`${os.homedir()}/.fatih.settings`, data, {spaces: 2}, function(err){
            if(err){
                reject(err);
            } else {
                resolve(true);
            }
        });
    }); 
}

function readSettingsFatih(data){
   
    try {
        return jsonfile.readFileSync(`${os.homedir()}/.fatih.settings`);
    }catch(err){
        return null;
    }

}

function clearIndex() {
    for (var key in fatih_settings.index) {
        var path = fatih_settings.index[key];
        if (!fs.existsSync(path+'/.fatih')) {
            console.log('naberrr');
            delete fatih_settings.index[key];
        }            
    }    

    util.writeSettingsFatih(fatih_settings).then(function(){
        
    });
}

module.exports.writeFatih = writeFatih;
module.exports.readFatih = readFatih;
module.exports.writeSettingsFatih = writeSettingsFatih;
module.exports.readSettingsFatih = readSettingsFatih;
module.exports.clearIndex = clearIndex;