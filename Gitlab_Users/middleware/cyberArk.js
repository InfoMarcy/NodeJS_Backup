const config = require("config");
const querystring = require("querystring");
const util = require("util");
const validarJson = require("../middleware/validarJson");
// Remove call back and return a promise using util promisify
validarJson.getJson = util.promisify(validarJson.getJson);
const cifradojson = require("../encriptado/cifradoJson");
const log4js = require("log4js");
const logger = log4js.getLogger("CyberArk");
module.exports = async function(req, res, next) {
  var cyberArkQuery = querystring.stringify({
    AppID: config.get("CyberArkAppID"),
    Safe: config.get("CyberArkSafe"),
    Folder: config.get("CyberArkFolder"),
    Object: config.get("CyberArkObject")
  });

  var cyberArk = {
    hostname: config.get("CyberArkHostUrl"),
    port: config.get("CyberArkPort"),
    path: config.get("CyberArkPath") + "?" + cyberArkQuery,
    method: config.get("CyberArkMethod"),
    rejectUnauthorized: false
  };

  const cyberArkResponse = await validarJson.getJson(cyberArk);

  if (
    (cyberArkResponse != null) &
    (cyberArkResponse.Token != null || cyberArkResponse.Token != "undefined")
  ) {
    res.locals.GitToken = cyberArkResponse.Token;
    logger.info("CyberArk git token true");
    next();
  } else {
    logger.info("CyberArk Response  false => ", cyberArkResponse);
    //Log the exception
    res.status(500).send(
      cifradojson.Encrypt_File({
        codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
        mensaje: "Error al realizar la operación",
        folio: validarJson.generarFolio(req.connection.remoteAddress),
        info:
          "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
        detalles: {
          cgSalida: "CI-120",
          descSalida: "Incidencia al conectarse con el servidor de CyberArk"
        }
      })
    );
  }
};
