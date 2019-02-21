// usuario model
const Usuario = require("../models/usuario");
const validarJson = require("./validarJson");

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("Ip Service");

// usuarios Object
let usuarios = [];

Usuario.getAllIps(obj => {
    if (!validarJson.isEmptyObject(obj)) {
      usuarios = obj;
    }
  });

module.exports = {
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
          logger.info("Error al tratar de obtener el numero de intento por IP");
          return 0;
        }
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  }
};