const express = require("express");
const router = express.Router();

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("desbloquearUsuarioRoute");

const config = require("config");
const pathUrl = config.get("pathUrl");
const hostUrl = config.get("hostUrl");
const GitToken = config.get("GitToken");

const validarJson = require("../middleware/validarJson");
const dateFormat = require("dateformat");
const now = new Date();

// Get an item By ID from the database
router.get("/",  async (req, res) => {

  logger.info("La llamada proviene de la Ip => ", { ip: req.connection.remoteAddress});
  logger.info("La llamada fue realizada en la fecha=> ", dateFormat(now, "yyyy-mm-dd HH:MM:ss"));
  logger.info("Entro a Desbloquear Usuario");

        var obtenerUsuarioGit = {
          host: hostUrl,
          port: 443,
          path: pathUrl + "?username=134233",
          method: "GET",
          headers: {
            "Private-Token": GitToken
          },
          rejectUnauthorized: false
        };

        validarJson.getJson(obtenerUsuarioGit, function(err, result) {
          if (err) {
            //Logs
            logger.info(
              {
                cgSalida: "CI-120",
                descSalida: "Incidencia al conectarse con el servidor (42)",
                error: err
              }
            );

            return res.status(500).send({
              codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
              detalles: {
                cgSalida: "CI-120",
                descSalida: "Incidencia al conectarse con el servidor"
              }
            });
          }
          if (result != null && result.message == "401 Unauthorized") {
            //logs
            logger.info({
              cgSalida: "CI-115",
              descSalida:
                "No estas autorizado para consumir este recurso (64) " + result
            });

            return res.status(401).send({
              codigo: "401.BancaDigital-Usuarios-Gitlab.CI-115",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#401.BancaDigital-Usuarios-Gitlab.CI-115",
              detalles: {
                cgSalida: "CI-115",
                descSalida: "No estas autorizado para consumir este recurso (75)"
              }
            });
          } else if (
            result != null &&
            result.message == "403 Forbidden  - Your account has been blocked."
          ) {
            //logs
            logger.info({
              cgSalida: "CI-116",
              descSalida:
                "No estas autorizado para consumir este recurso (86) => " + result
            });

            return res.status(403).send({
              codigo: "403.BancaDigital-Usuarios-Gitlab.CI-116",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#403.BancaDigital-Usuarios-Gitlab.CI-116",
              detalles: {
                cgSalida: "CI-116",
                descSalida: "No estas autorizado para consumir este recurso"
              }
            });
          } else if (validarJson.isEmptyObject(result)) {
            //logs
            logger.info({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema (104)" 
            });

            return res.status(404).send({
              codigo: "404.BancaDigital-Usuarios-Gitlab.CI-103",
              mensaje: "No se encontraron coincidencias",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#404.BancaDigital-Usuarios-Gitlab.CI-103",
              detalles: {
                cgSalida: "CI-103",
                descSalida: "No existe información"
              }
            });
          } else if (result[0].state === "blocked") {
            logger.info("Got a block User");

            var desbloquearUsuario = {
              host: hostUrl,
              port: 443,
              path: pathUrl + "/" + result[0].id + "/" + "unblock",
              method: "POST",
              headers: {
                "Private-Token": GitToken,
                "Content-Type": "application/x-www-form-urlencoded"
              },
              rejectUnauthorized: false
            };

            validarJson.getJson(desbloquearUsuario, function(err, desbloquear) {
              if (err) {
                //Logs
                logger.info(
                  {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor (139)",
                    error: err
                  }
                );

                return res.status(500).send({
                  codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
                  mensaje: "Error al realizar la operación",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
                  detalles: {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor"
                  }
                });
              }

              logger.info("El usuario ha sido desbloqueado: ", desbloquear);

              if (desbloquear) {
                logger.info({
                  cgSalida: "CI-121",
                  descSalida: "El Usuario ha sido desbloqueado (162)"
                });

                return res.status(200).send({
                  codigo: "0",
                  mensaje: "Operación Exitosa",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#0.BancaDigital-Usuarios-Gitlab.CI-121",
                  detalles: {
                    cgSalida: "CI-121",
                    descSalida: "El Usuario ha sido desbloqueado"
                  }
                });
              } else if (!desbloquear) {
                //logs
                logger.info({
                  cgSalida: "CI-122",
                  descSalida: "Incidencia al desbloquear el Usuario (180)" 
                });

                return res.status(500).send({
                  codigo: "500.BancaDigital-Usuarios-Gitlab.CI-122",
                  mensaje: "Error al realizar la operación",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-122",
                  detalles: {
                    cgSalida: "CI-122",
                    descSalida: "Incidencia al desbloquear el Usuario"
                  }
                });
              }
            });
          } else if (result[0].state === "active") {
            //Logs
            logger.info({
              cgSalida: "CI-123",
              descSalida: `El Usuario esta activo`
            });

            return res.status(202).send({
              codigo: "0",
              mensaje: "Operación Exitosa",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#0.BancaDigital-Usuarios-Gitlab.CI-123",
              detalles: {
                cgSalida: "CI-123",
                descSalida: "El Usuario esta activo`"
              }
            });
          }
        });
});

module.exports = router;
