// usuario model
const Usuario = require("../models/usuario");
const validarJson = require("../middleware/validarJson");
const writeDataToJsonFile = require("../middleware/writeDataToJsonFile");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("Bloqueo por IP Service");

// usuarios Object
let usuarios = [];


  Usuario.getUsuariosBloqueadosPorIp(obj => {
    if (!validarJson.isEmptyObject(obj)) {
      usuarios = obj;
    }
  });

module.exports = {
  // create a record
  create: function(obj) {
    usuarios.push(obj);

    if (usuarios.length != 0) {
      writeDataToJsonFile(usuarios , "bloqueoIp.json");
      logger.info("IP bloqueada exitosamente");
      //return obj;
      return;
    } else {
      logger.info("Error al bloquear la IP");
      return;
    }
  },

  getByIp: function(ip) {

    var filteredByIp = [];

    if (!validarJson.isEmptyObject(usuarios)) {
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].ip === ip) {
          filteredByIp.push(usuarios[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredByIp)) {
        if (filteredByIp.length != 0) {
          return filteredByIp[0];
        } else {
          logger.info("Incidencia al tratar de obtener el bloqueo por IP");
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  },


  // delete a record
  delete: function(ip) {
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].ip === ip) {
        usuarios.splice(i, 1);
      }
    }

    console.log("delete => ", usuarios);
    console.log("delete usuarios.length => ", usuarios.length);

    try{
      writeDataToJsonFile(usuarios, "bloqueoIp.json");
      return;
    }catch(err){
      console.log("Error => ", err);

    }

  },
};