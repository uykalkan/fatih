var jsonfile = require('jsonfile');

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


module.exports.writeFatih = writeFatih;
module.exports.readFatih = readFatih;
