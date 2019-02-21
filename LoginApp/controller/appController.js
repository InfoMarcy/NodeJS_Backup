const express = require("express");
//middleware for working with errore
const error = require("../middleware/error");
const loginRoute = require("../routes/loginRoute"); // login
const bodyParser = require("body-parser");
//Logs/banca_digital/v1/login
const log4js = require("log4js");
const logger = log4js.getLogger();
const xFrameOptions = require('x-frame-options')
// Helmet helps you secure your Express apps by setting various HTTP headers
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session');
const config = require('config');


module.exports = function(app) {
  app.locals.pretty = true;
  app.use(express.json()); // enable json req.body
  app.use(helmet());
  app.use(compression());
  app.use(xFrameOptions());

 
    app.use(cookieParser());
      // Use express session support since OAuth2orize requires it
    app.use(session({
      secret: config.get('cookieKey'),
      saveUninitialized: true,
      resave: true
    }));
    // app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(flash());


  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
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

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use("/banca_digital/v1/login", loginRoute);

  // set views on node js
  app.set("view engine", "ejs");

  app.use(
    log4js.connectLogger(logger, {
      level: log4js.levels.INFO,
      format: ":method :url"
    })
  );

  // to handle the errors
  app.use(error);
};
