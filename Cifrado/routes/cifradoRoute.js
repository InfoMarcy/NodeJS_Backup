const express = require("express");
const router = express.Router();

//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("cifradoRoute");
const cifradojson = require('../encriptado/cifradoJson');
const validarJson = require('../middleware/validarJson');
const config = require('config');

// Get an item By ID from the database
router.post("/cifrar", async (req, res) => {
    let crifrado = cifradojson.Encrypt_File(req.body);
    res.status(200).send({ Cifrado : crifrado}); 
});


router.post("/descifrar", async (req, res) => {
    let wsDatos =  JSON.parse(cifradojson.Decrypt_File(req.body));
    res.status(200).send(wsDatos); 
});

router.post("/token", async (req, res) => {

    var validarToken = {
        hostname: config.get('OauthHostName'),
        port: config.get('OauthPORT'),
        path: config.get('OauthPATH'),
        method: config.get('OauthMethod'),
          rejectUnauthorized: false
      };



    validarJson.getJson(validarToken, function(err, result) {
         //log the results
         logger.info("validarToken error => ", err);
         logger.info("validarToken result => ", result);

          // result =>  { error: 'oauth authentication required' } #]
        if (err || result.error == "oauth authentication required") {
            logger.info({ Mensaje: "Incidencia al realizar la operación de validar token en servidor OAuth", Error: err});

        };
        res.status(200).send({ "access_token" : result.access_token});
  

    });


});

module.exports = router;
