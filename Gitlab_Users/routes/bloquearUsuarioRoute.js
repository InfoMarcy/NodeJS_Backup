const express = require("express");
const router = express.Router();

const config = require("config");
const pathUrl = config.get("pathUrl");
const hostUrl = config.get("hostUrl");

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("obtenerGitUser");
const validarJson = require("../middleware/validarJson");
const oauth2ValidarToken = require('../middleware/oauth2ValidarToken');
const cifradojson = require('../encriptado/cifradoJson');
const cyberArk = require('../middleware/cyberArk');

// Get an item By ID from the database
router.post("/", oauth2ValidarToken, cyberArk, async (req, res) => { 
  
 logger.info("Entro a Bloquear Usuario res.locals.GitToken => ", res.locals.GitToken);
  
        var obtenerUsuarioGit = {
          host: hostUrl,
          port: 443,
          path: pathUrl + "?username=" + res.locals.numEmpleado,
          method: config.get('CyberArkMethod'),
          headers: {
            "Private-Token": res.locals.GitToken
          },
           rejectUnauthorized: false
        };

        validarJson.getJson(obtenerUsuarioGit, function(err, result) {


          if (err) {
            logger.info(
              {
                cgSalida: "CI-120",
                descSalida: "Incidencia al conectarse con el servidor validarJson.getJson(obtenerUsuarioGit 35",
                error: err
      
              }
            );

            logger.info("result => ", result);

            return res.status(500).send(cifradojson.Encrypt_File({
              codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
              detalles: {
                cgSalida: "CI-120",
                descSalida: "Incidencia al conectarse con el servidor"
              }
            }));
          }

          if (result != null && result.message == "401 Unauthorized") {
            //logs
            logger.info({
              cgSalida: "CI-115",
              descSalida:
                "No estas autorizado para consumir este recurso => 401 Unauthorized GIT"  + result
            });

            return res.status(401).send(cifradojson.Encrypt_File({
              codigo: "401.BancaDigital-Usuarios-Gitlab.CI-115",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#401.BancaDigital-Usuarios-Gitlab.CI-115",
              detalles: {
                cgSalida: "CI-115",
                descSalida: "No estas autorizado para consumir este recurso"
              }
            }));
          } else if (
            result != null &&
            result.message == "403 Forbidden  - Your account has been blocked."
          ) {
            //logs
            logger.info({
              cgSalida: "CI-116",
              descSalida:
                "No estas autorizado para consumir este recurso 403 Forbidden  - Your account has been blocked." + result
            });

            return res.status(403).send(cifradojson.Encrypt_File({
              codigo: "403.BancaDigital-Usuarios-Gitlab.CI-116",
              mensaje: "Error al realizar la operación",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#403.BancaDigital-Usuarios-Gitlab.CI-116",
              detalles: {
                cgSalida: "CI-116",
                descSalida: "No estas autorizado para consumir este recurso"
              }
            }));
          } else if (validarJson.isEmptyObject(result)) {
            //logs
            logger.info({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema result empty 108"
            });

            return res.status(404).send(cifradojson.Encrypt_File({
              codigo: "404.BancaDigital-Usuarios-Gitlab.CI-103",
              mensaje: "No se encontraron coincidencias",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#404.BancaDigital-Usuarios-Gitlab.CI-103",
              detalles: {
                cgSalida: "CI-103",
                descSalida: "No existe información"
              }
            }));
          } else if (result[0].state === "blocked") {
            //logs
            logger.info({
              cgSalida: "CI-102",
              descSalida: "El usuario ya se encontraba dado de baja",
              folio: validarJson.generarFolio(req.connection.remoteAddress)
            });

            return res.status(202).send(cifradojson.Encrypt_File({
              codigo: "0",
              mensaje: "Operación Exitosa",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#0.BancaDigital-Usuarios-Gitlab.CI-102",
              detalles: {
                cgSalida: "CI-102",
                descSalida: "El usuario ya se encontraba dado de baja"
              }
            }));
          } else if (result[0].id !== null) {


            
            var bloquearUsuario = {
              host: hostUrl,
              port: 443,
              path: pathUrl + "/" + result[0].id + "/block",
              method: config.get('WSMethod'),
              headers: {
                "Private-Token": res.locals.GitToken
              },
              rejectUnauthorized: false
            };

            validarJson.getJson(bloquearUsuario, function(err, blockUser) {


              if (err) {
                //logs
                logger.info(
                  {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor",
                    error: err
                  }
                  
                );

                return res.status(500).send(cifradojson.Encrypt_File({
                  codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
                  mensaje: "Error al realizar la operación",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
                  detalles: {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor"
                  }
                }));
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

                return res.status(200).send(cifradojson.Encrypt_File({
                  codigo: "0",
                  mensaje: "Operación Exitosa",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#0.BancaDigital-Usuarios-Gitlab.CI-101",
                  detalles: {
                    cgSalida: "CI-101",
                    descSalida: "Baja aplicada exitosamente"
                  }
                }));
              } else if (!blockUser) {
                //logs
                logger.info({
                  cgSalida: "CI-120",
                  descSalida: "Incidencia al realizar la operacion",
                  error: blockUser
                });

                return res.status(500).send(cifradojson.Encrypt_File({
                  codigo: "500.BancaDigital-Usuarios-Gitlab.CI-120",
                  mensaje: "Error al realizar la operación",
                  folio: validarJson.generarFolio(req.connection.remoteAddress),
                  info:
                    "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Usuarios-Gitlab.CI-120",
                  detalles: {
                    cgSalida: "CI-120",
                    descSalida: "Incidencia al conectarse con el servidor"
                  }
                }));
              }
            });
          } else if (result[0].id === null) {
            //logs
            logger.info({
              cgSalida: "CI-103",
              descSalida: "No existe usuario en el sistema"
            });

            return res.status(404).send(cifradojson.Encrypt_File({
              codigo: "404.BancaDigital-Usuarios-Gitlab.CI-103",
              mensaje: "No se encontraron coincidencias",
              folio: validarJson.generarFolio(req.connection.remoteAddress),
              info:
                "https://baz-developer.bancoazteca.com.mx/errors#404.BancaDigital-Usuarios-Gitlab.CI-103",
              detalles: {
                cgSalida: "CI-103",
                descSalida: "No existe información"
              }
            }));
          }
        });
});



module.exports = router;
