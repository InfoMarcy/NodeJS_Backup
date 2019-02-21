const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const validaciones = require("../middleware/validaciones");
//Cifrado
const crypto = require("crypto-js");
const usuarioFakeService = require("../middleware/usuarioFakeService");

const config = require("config");
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("loginRoute");

const jwtPrivateKey = config.get("jwtPrivateKey");
const validarJson = require("../middleware/validarJson");

let usuario;
let redirectURl;

router.get("/token", auth, async (req, res) => {
  res.set("X-Frame-Options", "ALLOW-FROM http://10.51.58.240:4200/");
  let message = req.flash("error");

  // response to the front
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res
    .status(200)
    .render("token", {
      pageTitle: "Banca Digital Login App",
      errorMessage: message
    });
});

router.post("/token", auth, async (req, res) => {
  // validate the token
  logger.info("Token Insertado por el Usuario => ", req.body.token);
  if (!req.body.token) {
    req.flash("error", "Token Invalido");
    return res.redirect(
      "/banca_digital/v1/login/token?code=" + req.body.AuthorizationCode
    );
  }

  if (
    (usuario = !"") ||
    (redirectURl = !"" || usuario != "undefined" || redirectURl != "undefined")
  ) {
    // Send a response to the front { expiresIn: 300 } in senconds
    const token = jwt.sign(
      { _username: usuario, _ip: req.connection.remoteAddress },
      jwtPrivateKey,
      { expiresIn: 300 }
    );
    const targetUrl = redirectURl + "=" + token;

    logger.info("Entro al if  targetUrl => ", targetUrl);
    logger.info("Entro al if  usuario => ", usuario);

    // reset the variables
    usuario = "";
    redirectURl = "";
    return res.redirect(targetUrl);
  } else {
    res.status(500).send({
      codigo: "500.BancaDigital-Login-App",
      mensaje: "Error al realizar la operación",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#500.BancaDigital-Login-App"
    });
  }
});
// show loggin form
router.get("/", auth, (req, res) => {
  res.set("X-Frame-Options", "ALLOW-FROM http://10.51.58.240:4200/");
  let message = req.flash("error");

  const validatarRedirectURl = validaciones.getQueryStringValue(
    req.url,
    "redirectURl"
  );

  if (!validatarRedirectURl) {
    return res.status(400).send({
      codigo: "400.BancaDigital-Login-App",
      mensaje: "Los Datos de entrada no cumplen con el formato esperado",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#400.BancaDigital-Login-App"
    });
  }

  if (!validaciones.validarURL(validatarRedirectURl)) {
    return res.status(400).send({
      codigo: "400.BancaDigital-Login-App",
      mensaje: "Los Datos de entrada no cumplen con el formato esperado",
      folio: validarJson.generarFolio(req.connection.remoteAddress),
      info:
        "https://baz-developer.bancoazteca.com.mx/errors#400.BancaDigital-Login-App"
    });
  }

  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res
    .status(200)
    .render("login", {
      pageTitle: "Banca Digital Login App",
      errorMessage: message
    });
});
// Get an item By ID from the database
router.post("/", auth, async (req, res) => {
  logger.info("Llego al POST Banca Digital Login App");
  // connect to NAM to verify Usuario
  let cred = {
    username: req.body.username,
    password: req.body.password
  };
  // validate username and password
  const { error } = validaciones.validateCredencials(cred);
  if (error) {
    req.flash("error", "Usuario y/o contraseña incorrectas");
    return res.redirect(
      "/banca_digital/v1/login?code=" +
        req.body.AuthorizationCode +
        "&redirectURL=" +
        req.body.redirectURl
    );
  }

  //validate that the user and the password don´t have the same values
  const validateUserPassNotIguales = validaciones.validateUserPassNoIguales(
    cred.username,
    cred.password
  );
  if (validateUserPassNotIguales) {
    req.flash("error", "Usuario y/o contraseña incorrectas");
    return res.redirect(
      "/banca_digital/v1/login?code=" +
        req.body.AuthorizationCode +
        "&redirectURL=" +
        req.body.redirectURl
    );
  }

  logger.info(
    "Llego al POST Banca Digital Login App y paso las validaciones de Usuarios"
  );

  // ================================================================= Verificar el candado ====================================================//
  let usuarioFake = usuarioFakeService.getByusername(
    crypto.SHA256(config.get("USUARIO_FAKE")).toString()
  );

  logger.info(
    "Llego al POST Banca Digital Login App con Usuario fake => ",
    usuarioFake
  );

  if ((usuarioFake != 0) & usuarioFake.fakeUser) {
    // Bandera de fake user activada
    logger.info(
      "Llego al POST Banca Digital Login App con la bandera del Usuario Fake activada"
    );

    //=============================================== IDENTIFICAR USUARIO PARA HABILIATAR O DESAHABILITAR CANDADO ==========================================//
    let adminFake = usuarioFakeService.getByusername(
      crypto.SHA256(req.body.username).toString()
    );
    logger.info(
      "Llego al POST Banca Digital Login App con adminFake => ",
      adminFake
    );

    if (adminFake != 0 & adminFake.fakeUser) {
      // compare the passwords the password against the json file
      const validPassword = validaciones.validatePassword(
        adminFake.password,
        crypto.SHA256(req.body.password).toString()
      );

      logger.info(
        "Llego al POST Banca Digital y paso adminFake validatePassword",
        adminFake
      );
      // validate if the password exist
      if (!validPassword) {
        logger.info(
          "Llego al POST Banca Digital y entro a adminFake not valid password"
        );
        logger.info({
          cgSalida: "CI-104",
          descSalida:
            "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
        });

        req.flash("error", "No hemos podido autenticarte, por favor intentelo de nuevo más tarde.");
        return res.redirect(
          "/banca_digital/v1/login?code=" +
            req.body.AuthorizationCode +
            "&redirectURL=" +
            req.body.redirectURl
        );
      }

      //===================  Deshabilitar Usuario=================== //
      adminFake.fakeUser = false;

      if (usuarioFakeService.update(adminFake.username, adminFake)) {
        logger.info(
          "Llego al POST Banca Digital => El Usuario está deshabilitado", req.body
        );
        req.flash("error", " El Usuario está deshabilitado");
        return res.redirect(
          "/banca_digital/v1/login?code=" +
            req.body.AuthorizationCode +
            "&redirectURL=" +
            req.body.redirectURl
        );
      } else {
        logger.info(
          "Llego al POST Banca Digital => Incidencia al desahabilitar al Usuario fake", req.body
        );
        req.flash("error", "Incidencia al desahabilitar al Usuario fake");
        return res.redirect(
          "/banca_digital/v1/login?code=" +
            req.body.AuthorizationCode +
            "&redirectURL=" +
            req.body.redirectURl
        );
      }
    }
    //=============================================== END IDENTIFICAR USUARIO PARA HABILIATAR O DESAHABILITAR CANDADO ==========================================//
    //=============================================== Usuario Dummy ==========================================//
    // Usuario fake no esta correcto o no existe
    if (usuarioFake == 0) {
      logger.info("Llego al POST Banca Digital Login App con usuarioFake == 0");

      req.flash("error", "No hemos podido autenticarte, por favor intentelo de nuevo más tarde.");
      return res.redirect(
        "/banca_digital/v1/login?code=" +
          req.body.AuthorizationCode +
          "&redirectURL=" +
          req.body.redirectURl
      );
    } else {
      logger.info(
        "Llego al POST Banca Digital Login App con usuarioFake => ",
        usuarioFake.fakeUser
      );
      if (usuarioFake.fakeUser) {
        // usuario fake está habilitado
        logger.info(
          "Llego al POST Banca Digital Login App y paso el if usuarioFake.fakeUser => true", req.body
        );

        cred = {};
        logger.info("usaurio => ", usuario, "redirectURl =>", redirectURl);
        usuario = req.body.username;
        redirectURl = req.body.redirectURl;

        return res.redirect(
          "/banca_digital/v1/login/token?code=" + req.body.AuthorizationCode
        );



      } else {
        // usuario fake deshabilitado
        logger.info(
          "Llego al POST Banca Digital Login App y paso el if usuarioFake.fakeUser => false"
        );
        req.flash("error", "No hemos podido autenticarte, por favor intentelo de nuevo más tarde.");
        return res.redirect(
          "/banca_digital/v1/login?code=" +
            req.body.AuthorizationCode +
            "&redirectURL=" +
            req.body.redirectURl
        );
      }
    }

    // }
    //=============================================== END Usuario Dummy ==========================================//
  } else {
    logger.info(
      "Llego al POST Banca Digital Login App con la bandera del Usuario Fake desactivada"
    );
    // Bandera de fake user desactivada
    let IDMFallo = config.get('IDMFallo');

    //=============================================== Simulating IDM Failed ==========================================//
    if (!IDMFallo) {
      logger.info("Llego al POST Banca Digital Login App con IDM Funcionando");
      //=============================================== Consultar credenciales con IDM ==========================================//
      // reset the values for the credentials
      cred = {};
      logger.info("usaurio no => ", usuario, "redirectURl no =>", redirectURl);
      usuario = req.body.username;
      redirectURl = req.body.redirectURl;

      return res.redirect(
        "/banca_digital/v1/login/token?code=" + req.body.AuthorizationCode
      );
      //=============================================== Consultar credenciales con IDM ==========================================//
    }
    //=============================================== Error 500 time out del IMD ==========================================//
    else {
      logger.info("Llego al POST Banca Digital Login App con IDM error 500");

      //=============================================== IDENTIFICAR USUARIO PARA HABILIATAR O DESAHABILITAR CANDADO ==========================================//
      let adminFake = usuarioFakeService.getByusername(
        crypto.SHA256(req.body.username).toString()
      );
      logger.info(
        "Llego al POST Banca Digital Login App con adminFake => ",
        adminFake
      );

      if (adminFake == 0) {
        logger.info("Llego al POST Banca Digital Login App con adminFake => 0");
        req.flash("error", "No hemos podido autenticarte, por favor intentelo de nuevo más tarde.");
        return res.redirect(
          "/banca_digital/v1/login?code=" +
            req.body.AuthorizationCode +
            "&redirectURL=" +
            req.body.redirectURl
        );
      }

      // compare the passwords the password against the json file
      const validPassword = validaciones.validatePassword(
        adminFake.password,
        crypto.SHA256(req.body.password).toString()
      );

      logger.info(
        "Llego al POST Banca Digital y paso adminFake validatePassword",
        adminFake
      );
      // validate if the password exist
      if (!validPassword) {
        logger.info(
          "Llego al POST Banca Digital y entro a adminFake not valid password"
        );
        logger.info({
          cgSalida: "CI-104",
          descSalida:
            "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
        });

        req.flash("error", "No hemos podido autenticarte, por favor intentelo de nuevo más tarde.");
        return res.redirect(
          "/banca_digital/v1/login?code=" +
            req.body.AuthorizationCode +
            "&redirectURL=" +
            req.body.redirectURl
        );
      }

      logger.info(
        "Llego al POST Banca Digital y paso adminFake novalid password"
      );



      // habilitar usuario fake
      if (!adminFake.fakeUser) {
        logger.info(
          "Llego al POST Banca Digital y paso adminFake esta desactivado"
        );
        //===================  habilitar Usuario=================== //
        usuarioFake.fakeUser = true;

        if (usuarioFakeService.update(adminFake.username, adminFake)) {
          logger.info(
            "Llego al POST Banca Digital => El Usuario  está habilitado", adminFake
          );
          req.flash("error", "El Usuario está habilitado");
          return res.redirect(
            "/banca_digital/v1/login?code=" +
              req.body.AuthorizationCode +
              "&redirectURL=" +
              req.body.redirectURl
          );
        } else {
          logger.info(
            "Llego al POST Banca Digital => Incidencia al habilitar el Usuario fake"
          );
          req.flash("error", "Incidencia al habilitar el Usuario fake");
          return res.redirect(
            "/banca_digital/v1/login?code=" +
              req.body.AuthorizationCode +
              "&redirectURL=" +
              req.body.redirectURl
          );
        }
      }

      //=============================================== END IDENTIFICAR USUARIO PARA HABILIATAR O DESAHABILITAR CANDADO ==========================================//
    }
    //=============================================== END Error 500 time out del IMD ==========================================//
  }
});

module.exports = router;
