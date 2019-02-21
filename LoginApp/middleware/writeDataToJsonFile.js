const fs = require('fs');
const path = require('path');
//working with log files
const log4js = require('log4js');
const logger = log4js.getLogger("writeDataToJsonFile");
// write the data to a json file
module.exports =  function(guardarIntentosToFile, ruta){

    // get the path of the json file that we are going to user
    const p = path.join(
      path.dirname(process.mainModule.filename),
      "db",
      ruta
    );

  fs.writeFile(p, JSON.stringify(guardarIntentosToFile), (err) => {
      if(err){
        console.log(err);
        logger.info(`Incidencia al guardar en ${ruta} => `, err , {"guardarIntentosToFile => ": guardarIntentosToFile } );
      } else {
        logger.info('Guardado correctamente => ', guardarIntentosToFile );
      }
    });
};