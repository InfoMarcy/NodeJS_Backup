
const express = require("express");
const cors = require("cors");
//middleware for working with errore
const error = require("../middleware/error");

const cifradoRoute = require("../routes/cifradoRoute");
const log4js = require("log4js");
const logger = log4js.getLogger();
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

  app.use("/", cifradoRoute);
  
  app.use(
    log4js.connectLogger(logger, {
      level: log4js.levels.INFO,
      format: ":method :url"
    })
  );
 
  // to handle the errors
  app.use(error);


};
