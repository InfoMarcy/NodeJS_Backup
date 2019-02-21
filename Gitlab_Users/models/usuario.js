const obtenerDatosFromFile = require("../middleware/obtenerDatosFromFile");

module.exports = class Usuario {
  static getAllIps(cb) {
    obtenerDatosFromFile(cb, "ips.json");
  };


  static getNumIntentosPorIp(cb) {
    obtenerDatosFromFile(cb, "numIntentosIP.json");
  };


  static getUsuariosBloqueadosPorIp(cb) {
    obtenerDatosFromFile(cb, "bloqueoIp.json");
  };
  

};
