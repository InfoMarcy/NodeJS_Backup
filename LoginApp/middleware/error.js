//library for working with  logs
//working with log files
const log4js = require('log4js');
const logger = log4js.getLogger("error middleware");
const validarJson = require("../middleware/validarJson");
// error handler
module.exports = function(error, req, res, next){
    logger.info({ cgSalida: "CI-120", descSalida: "Incidencia al conectarse con el servidor", error:  error.message});


    //Log the exception
    res.status(500).send({
        "codigo": "500.BancaDigital-Login-App",
        "mensaje": "Error al realizar la operación",
        "folio": validarJson.generarFolio(req.connection.remoteAddress),
        "info": "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Login-App"
      });
};