// usuario model
const Usuario = require("../models/usuario");
const validarJson = require("./validarJson");

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("Usuario Fake Service");

const writeDataToJsonFile = require('./writeDataToJsonFile');

// usuarios Object
let usuarios = [];

Usuario.getUsuarioFake(obj => {
    if (!validarJson.isEmptyObject(obj)) {
      usuarios = obj;
    }
  });

module.exports = {
    // create a record
    create: function(obj) {
      usuarios.push(obj);
  
      if (usuarios.length != 0) {
        writeDataToJsonFile(usuarios, "usuarioFake.json");
        logger.info("Usuario actualizado Correctamente");
        return true;
      } else {
        logger.info("Incidencia al actualizar el usuario");
        return false;
      }
    },

    // update a record
  update: function(username, objToUpdate) {
    for (var i = 0; i < usuarios.length; i++) {
      if (usuarios[i].username === username) usuarios[i] = objToUpdate;
    }

    if (usuarios.length != 0) {
      writeDataToJsonFile(usuarios,  "usuarioFake.json");
      //return objToUpdate;
      logger.info("Actualizacion de usuario fake exitosa");
      return true;
    } else {
      logger.info("Incidencia al actualizar el usuario fake");
      return false;
    }
  },

    
  getByusername: function(username) {
    var filteredByUsername = [];

    if (!validarJson.isEmptyObject(usuarios)) {
      for (var i = 0; i < usuarios.length; i++) {
        if (usuarios[i].username === username) {
          filteredByUsername.push(usuarios[i]);
        }
      }

      if (!validarJson.isEmptyObject(filteredByUsername)) {
        if (filteredByUsername.length != 0) {
          return filteredByUsername[0];
        } else {
          logger.info("Error al tratar de obtener el username");
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