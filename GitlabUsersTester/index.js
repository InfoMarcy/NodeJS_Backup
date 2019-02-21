// load the express framework module
const express = require("express");
const app = express(); // call the express function which return an object
const config = require('config');
const https = require('https');
const fs = require('fs');

require("./controller/logsController")();
require("./controller/routesController")(app);

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("index");

const getRuta = require('./middleware/getRuta');

// Environment variable
const port = 5000; //listen on a given port

const options = {
  key: fs.readFileSync(getRuta.getRuta('ssl', '10.242.8.11.key')),
  cert: fs.readFileSync(getRuta.getRuta('ssl', '10.242.8.11.crt'))
};

const server =  https.createServer(options, app).listen(port, () =>
logger.info(`La applicacion ${config.get('name')} esta corriendo en el puerto: ${port} y en el ambiente de: ${app.get('env')}.`)
);

module.exports = server;

// Run an app Permanently using 
// 1. export NODE_ENV=production or export NODE_ENV=development
// 2. npm start &