//library for working with  logs
//working with log files
const log4js = require('log4js');
const logger = log4js.getLogger("error");
const validarJson = require("../middleware/validarJson");
// error handler
module.exports = function(error, req, res, next){
  
    logger.info({ cgSalida: "CI-120", descSalida: "Incidencia al conectarse con el servidor (error middleware)", error:  error});

    //Log the exception
    res.status(500).send({
        "codigo": "500.BancaDigital-Usuarios-Gitlab.CI-120",
        "mensaje": "Error al realizar la operación",
        "folio": validarJson.generarFolio(req.connection.remoteAddress),
        "info": "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
        "detalles":{
          "cgSalida": "CI-120",
          "descSalida": "Incidencia al conectarse con el servidor"
        }
      });
};