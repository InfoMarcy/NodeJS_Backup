//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("auth");
// usuario model
const Usuario = require("../models/usuario");
const validaciones = require("../middleware/validaciones");
const dateFormat = require("dateformat");
const now = new Date();
const validarJson = require("../middleware/validarJson");
//Cifrado
const crypto = require("crypto-js");
const ipService = require('../middleware/ipService');

module.exports = function(req, res, next) {

  logger.info("La llamada proviene de la Ip => ", { ip: req.connection.remoteAddress});

  logger.info("La llamada proviene de la Ip Encriptada => ", { ip_encriptada: crypto.SHA256(req.connection.remoteAddress).toString() });

  // logger.info("La llamada proviene de la passs Encriptada => ", { pass: crypto.SHA256(req.body.password).toString() });



  logger.info("La llamada fue realizada en la fecha=> ", dateFormat(now, "yyyy-mm-dd HH:MM:ss"));

  logger.info("La llamada fue realizada desde la URL => ", req.protocol + '://' + req.get('host') + req.originalUrl);

  // get the token from the header
  let authorizationCode = (req.get('Authorization-Code') ? req.get('Authorization-Code')  : req.body.AuthorizationCode) || req.query.code;


  logger.info("La llamada fue realizada con Authorization-Code => ", authorizationCode);


  if(!authorizationCode || authorizationCode != '~3$}W>qT8hX),2MV'){
    return res.status(403).send({
      codigo: "403.BancaDigital-Login-App",
      mensaje: "Error al realizar la operación (No Valid Token)",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#403.BancaDigital-Login-App"
    });
  };

  // const { ipError } = validaciones.validateIp(req.connection.remoteAddress);
  // if (ipError)
  //   return res.status(400).send({
  //     codigo: "400.BancaDigital-Login-App",
  //     mensaje: "Los Datos de entrada no cumplen con el formato esperado",
  //     folio: validarJson.generarFolio(req.connection.remoteAddress),
  //     info:
  //       "https://baz-developer.bancoazteca.com.mx/errors#400.BancaDigital-Login-App"
  //   });

  //   // Check if the ip is registered on the List
  // let ipWhiteList = ipService.getByIp(crypto.SHA256(req.connection.remoteAddress).toString());

  // logger.info("ipWhiteList => ", ipWhiteList);


  // if (ipWhiteList == 0 ) {

  //   return res.status(403).send({
  //     codigo: "403.BancaDigital-Login-App",
  //     mensaje: "Error al realizar la operación (No Valid IP)",
  //     folio: validarJson.generarFolio(req.connection.remoteAddress),
  //     info:
  //       "https://baz-developer.bancoazteca.com.mx/errors#403.BancaDigital-Login-App"
  //   });

  // }

 next();
}
