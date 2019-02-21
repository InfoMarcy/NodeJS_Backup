const config = require('config');
const log4js = require("log4js");
const logger = log4js.getLogger("cifradoJson");
const CryptoJS = require("crypto-js");

module.exports = {

  Encrypt_File: function(req) {
    logger.info("Encrypt_File  req => ", req);
     var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(req), config.get('ENCRIPT'));
     return ciphertext.toString();
   },

  //funcion para descifrar el archivo
  Decrypt_File: function(ciphertext) {
    logger.info("Decrypt_File  req => ", ciphertext);
    let bytes = CryptoJS.AES.decrypt(ciphertext.toString(), config.get('ENCRIPT'));
    return bytes.toString(CryptoJS.enc.Utf8);
  }


};
