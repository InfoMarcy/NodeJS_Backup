const express = require("express");
const router = express.Router();

const config = require("config");
const pathUrl = config.get("pathUrl");
const hostUrl = config.get("hostUrl");
const GitToken = config.get("GitToken");

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("bloquearUsuarioRoute");
const validarJson = require("../middleware/validarJson");
const dateFormat = require("dateformat");
const now = new Date();

// Get an item By ID from the database
router.get("/", async (req, res) => {

  logger.info("La llamada proviene de la Ip => ", { ip: req.connection.remoteAddress});
  logger.info("La llamada fue realizada en la fecha=> ", dateFormat(now, "yyyy-mm-dd HH:MM:ss"));
  logger.info("Entro a Bloquear Usuario => ");
  
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


        logger.info("obtenerUsuarioGit => ", obtenerUsuarioGit);


        validarJson.getJson(obtenerUsuarioGit, function(err, result) {


          if (err) {
            logger.info(
              {
                cgSalida: "CI-120",
                descSalida: "Incidencia al conectarse con el servidor (42)",
                error: err
      
              }
            );

            logger.info("result 48 => ", result);

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
                "No estas autorizado para consumir este recurso => 401 Unauthorized GIT"  + result
            });

            return res.status(401).send({
              codigo: "401.BancaDigital-Usuarios-Gitlab.CI-115",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#401.BancaDigital-Usuarios-Gitlab.CI-115",
              detalles: {
                cgSalida: "CI-115",
                descSalida: "No estas autorizado para consumir este recurso"
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
                "No estas autorizado para consumir este recurso 403 Forbidden  - Your account has been blocked. (94)" + result
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
              descSalida: "No existe usuario en el sistema (108)"
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
            //logs
            logger.info({
              cgSalida: "CI-102",
              descSalida: "El usuario ya se encontraba dado de baja (130)",
              folio: validarJson.generarFolio(req.connection.remoteAddress)
            });

            return res.status(202).send({
              codigo: "0",
              mensaje: "Operación Exitosa",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#0.BancaDigital-Usuarios-Gitlab.CI-102",
              detalles: {
                cgSalida: "CI-102",
                descSalida: "El usuario ya se encontraba dado de baja"
              }
            });
          } else if (result[0].id !== null) {


            
            var bloquearUsuario = {
              host: hostUrl,
              port: 443,
              path: pathUrl + "/" + result[0].id + "/block",
              method: "POST",
              headers: {
                "Private-Token": GitToken
              },
              rejectUnauthorized: false
            };

            validarJson.getJson(bloquearUsuario, function(err, blockUser) {


              if (err) {
                //logs
                logger.info(
                  {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor (168)",
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

              logger.info("El usuario ha sido bloqueado: ", blockUser, {
                cgSalida: "CI-101",
                descSalida: "Baja aplicada exitosamente"
              });

              if (blockUser) {
                logger.info({
                  cgSalida: "CI-101",
                  descSalida: "Baja aplicada exitosamente"
                });

                return res.status(200).send({
                  codigo: "0",
                  mensaje: "Operación Exitosa",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#0.BancaDigital-Usuarios-Gitlab.CI-101",
                  detalles: {
                    cgSalida: "CI-101",
                    descSalida: "Baja aplicada exitosamente"
                  }
                });
              } else if (!blockUser) {
                //logs
                logger.info({
                  cgSalida: "CI-120",
                  descSalida: "Incidencia al realizar la operacion (213)",
                  error: blockUser
                });

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
            });
          } else if (result[0].id === null) {
            //logs
            logger.info({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema (234)"
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
          }
        });
});
module.exports = router;
