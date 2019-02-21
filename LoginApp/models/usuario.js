const obtenerDatosFromFile = require("../middleware/obtenerDatosFromFile");

module.exports = class Usuario {


  static getAllIps(cb) {
    obtenerDatosFromFile(cb, "ips.json");
  }

  static getUsuarioFake(cb) {
    obtenerDatosFromFile(cb, "usuarioFake.json");
  }
};
