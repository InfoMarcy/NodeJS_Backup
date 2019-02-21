// usuario model
const Usuario = require("../models/usuario");
const validarJson = require("../middleware/validarJson");
const writeDataToJsonFile = require("../middleware/writeDataToJsonFile");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("Número Intentos por IP");

// numIntentosIP Object
let numIntentosIP = [];

Usuario.getNumIntentosPorIp(obj => {
  if (!validarJson.isEmptyObject(obj)) {
    numIntentosIP = obj;
  }
});

module.exports = {

  // create a record
  create: function(obj) {
    numIntentosIP.push(obj);

    if (numIntentosIP.length != 0) {
      writeDataToJsonFile(numIntentosIP, "numIntentosIP.json");
      logger.info("Numero de intento por ip creado exitosamente");
      return;
    } else {
      logger.info("Error al tratar de guardar el numero de intento por IP");
      return;
    }
  },

  getByIp: function(ip) {
    var filteredNumIntentos = [];

    if (!validarJson.isEmptyObject(numIntentosIP)) {
      for (var i = 0; i < numIntentosIP.length; i++) {
        if (numIntentosIP[i].ip === ip) {
          filteredNumIntentos.push(numIntentosIP[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredNumIntentos)) {
        if (filteredNumIntentos.length != 0) {
          return filteredNumIntentos[0].numIntentos;
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
  },

  // delete a record
  delete: function(ip) {
    for (var i = 0; i < numIntentosIP.length; i++) {
      if (numIntentosIP[i].ip === ip) {
        numIntentosIP.splice(i, 1);
      }
    }

    if (numIntentosIP.length != 0) {
      writeDataToJsonFile(numIntentosIP, "numIntentosIP.json");
      return numIntentosIP;
    } else return new Error("Incidencia al eliminar el número de Intentos");
  },

  // update a record
  update: function(ip, objToUpdate) {
    for (var i = 0; i < numIntentosIP.length; i++) {
      if (numIntentosIP[i].ip === ip) numIntentosIP[i] = objToUpdate;
    }

    if (numIntentosIP.length != 0) {
      writeDataToJsonFile(numIntentosIP,  "numIntentosIP.json");
      //return objToUpdate;
      logger.info("Actualizacion de numero de intento exitosa");
      return;
    } else {
      logger.info("Incidencia al actualizar el numero de intentos");
      return;
    }
  }
};