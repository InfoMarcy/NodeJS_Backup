const express = require("express");
const router = express.Router();
const validarJson = require("../middleware/validarJson");
const dateFormat = require("dateformat");
const now = new Date();

const config = require("config");
const pathUrl = config.get("pathUrl");
const hostUrl = config.get("hostUrl");
const userMonitoreo = config.get("UserMonitoreoID");

const log4js = require("log4js");
const logger = log4js.getLogger("monitoreoRouter");
const cyberArk = require('../middleware/cyberArk');
// Get an item By ID from the database
router.get("/", cyberArk, (req, res) => {

  logger.info("La llamada proviene de la Ip => ", {
    ip: req.connection.remoteAddress
  });
  logger.info(
    "La llamada fue realizada en la fecha=> ",
    dateFormat(now, "yyyy-mm-dd HH:MM:ss")
  );
  logger.info("Entro a Monitoreo de Usuario Router");

  try {
    // obtiene el usuario desde gitlab
    var bloquearUsuario = {
      host: hostUrl,
      port: 443,
      path: pathUrl + "/" + userMonitoreo + "/block",
      method: config.get('WSMethod'),
      headers: {
        "Private-Token": res.locals.GitToken
      },
      rejectUnauthorized: false
    };

    logger.info("bloquearUsuario => ", bloquearUsuario);

    validarJson.getJson(bloquearUsuario, function(err, blockUser) {
      if (err) {
        //logs
        logger.info({
          cgSalida: "CI-120",
          descSalida: "Incidencia al conectarse con el servidor (46)",
          error: err
        });

        res.status(500).send({
          codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
          mensaje: "Error al realizar la operación",
          folio: validarJson.generarFolio(req.connection.remoteAddress),
          info:
            "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
          detalles: {
            cgSalida: "CI-120",
            descSalida:
              "Incidencia al conectarse con el servidor de Gitlab O Usuario no existente en Gitlab"
          }
        });

      }

      logger.info("blockUser => ", blockUser);


      if(blockUser != null & blockUser.message == '404 User Not Found'){


       return res.status(404).send({
          codigo: "404.BancaDigital-Usuarios-Gitlab.CI-120",
          mensaje: "Recurso no encontrado en Gitlab",
          folio: validarJson.generarFolio(req.connection.remoteAddress)
        });

      }

      if (blockUser) {
        logger.info({
          cgSalida: "CI-101",
          descSalida: "Baja aplicada exitosamente"
        });

        logger.info("blockUser => ", blockUser);
        // unblock User
        var desbloquearUsuario = {
          host: hostUrl,
          port: 443,
          path: pathUrl + "/" + userMonitoreo + "/" + "unblock",
          method: config.get('WSMethod'),
          headers: {
            "Private-Token": res.locals.GitToken,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          rejectUnauthorized: false
        };

        validarJson.getJson(desbloquearUsuario, function(err, desbloquear) {
          if (err) {
            //Logs
            logger.info({
              cgSalida: "CI-120",
              descSalida: "Incidencia al conectarse con el servidor (139)",
              error: err
            });
          } // end if err

          logger.info("desbloquear => ", desbloquear);

          if (desbloquear) {
            logger.info({
              cgSalida: "CI-102",
              descSalida: "Usuario Desbloqueado exitosamente"
            });

            res
              .status(200)
              .send({ mensaje: "Operacion realizada exitosamente." });
          }
        });
      } // if block User
      else if (!blockUser) {
        // unblock User
        var desbloquearUsuario = {
          host: hostUrl,
          port: 443,
          path: pathUrl + "/" + userMonitoreo + "/" + "unblock",
          method: config.get('WSMethod'),
          headers: {
            "Private-Token": res.locals.GitToken,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          rejectUnauthorized: false
        };

        validarJson.getJson(desbloquearUsuario, function(err, desbloquear) {
          if (err) {
            //Logs
            logger.info({
              cgSalida: "CI-120",
              descSalida: "Incidencia al conectarse con el servidor (139)",
              error: err
            });
          } // end if err

          logger.info("desbloquear => ", desbloquear);

          if (desbloquear) {
            res
              .status(200)
              .send({ mensaje: "Operacion realizada exitosamente." });
          }
        });
      }
    });
  } catch (ex) {
    logger.info("catch ex monitoreo => ", ex);

    res.status(500).send({
      codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
      mensaje: "Error al realizar la operación",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
      detalles: {
        cgSalida: "CI-120",
        descSalida:
          "Incidencia al conectarse con el servidor de Gitlab O Usuario no existente en Gitlab"
      }
    });
  }
});

module.exports = router;
