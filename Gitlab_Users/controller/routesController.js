
const express = require("express");
const cors = require("cors");
//middleware for working with errore
const error = require("../middleware/error");

const bloquearUsuarioGit = require("../routes/bloquearUsuarioRoute"); // block usuario
// const oAuth2Route = require('../routes/oauth2Route');
const monitoreo = require('../routes/monitoreo');
//Logs
const log4js = require("log4js");
const logger = log4js.getLogger();
const config = require('config');
// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");
const compression = require('compression');
const bodyParser = require('body-parser');

module.exports = function(app) {
  app.use(express.json()); // enable json req.body
  app.use(helmet());
  app.use(compression());
  app.use(bodyParser.text());
 
  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST"
    );
    // Request headers you wish to allow
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);
    // Pass to next layer of middleware
    next();
  });

  app.use(cors());
  app.options("*", cors());

  app.use("/banca_digital/gitlab/v1/bloquear/usuario", bloquearUsuarioGit);
  
  
  app.use(
    "/banca_digital/gitlab/v1/monitoreo",
    monitoreo
  );


  app.get('/', (req, res) => {
    res.send('Bienvenidos al Web Service Baja Usuarios Git')
  });

 
  app.use(
    log4js.connectLogger(logger, {
      level: log4js.levels.INFO,
      format: ":method :url"
    })
  );
 
  // to handle the errors
  app.use(error);

    // Not founds routes
    app.use(function(req, res, next){
      res.status(404);
      // respond with json
      if (req.accepts('json')) {
        res.send({  Mensaje : "La pagina que esta solicitando no ha sido encontrada" });
        return;
      };
    });


};
