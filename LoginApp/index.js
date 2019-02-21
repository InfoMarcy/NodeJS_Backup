// load the express framework module
const express = require("express");
const app = express(); // call the express function which return an object
const config = require('config');
const https = require('https');
const fs = require('fs');

require("./controller/logsController")();
require("./controller/appController")(app);

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("index");

const getRuta = require('./middleware/getRuta');

// Environment variable
const port = 3080; //listen on a given port

// const options = {
//   key: fs.readFileSync(getRuta.getRuta('ssl', '10.51.58.238.key')),
//   cert: fs.readFileSync(getRuta.getRuta('ssl', '10.51.58.238.crt'))
// };

// const server =  https.createServer(options, app).listen(port, () =>
// logger.info(`La applicacion ${config.get('name')} esta corriendo en el puerto: ${port} y en el ambiente de: ${app.get('env')}.`)
// );

const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;
