const Joi = require("joi");

module.exports = {

  validateIp: function(req) {
      const schema = {
        ip: Joi.string()
          .min(7)
          .max(45)
          .required()
      };
      return Joi.validate(req, schema);
  },

  validateCredencials: function (cred) {
      const schema = {
        username: Joi.string().min(3).required(),
        password: Joi.string().min(9).required()
      };
      return Joi.validate(cred, schema);
  },

    //valida la contraseña contra el hash
    validatePassword: function(pass1, pass2) {
      if (pass1.toString().trim() === pass2.toString().trim()) {
  
        pass1 = "";
        pass1 = "";
        return true;
      } else {
        pass1 = "";
        pass1 = "";
        return false;
      }
    },
    

  validateUserPassNoIguales: function(user, pass) {
    if (user.toString().trim() === pass.toString().trim()) {
      return true;
    } else {
      return false;
    }
  },

  getQueryStringValue: function(url, key){
    return decodeURIComponent(url.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  },

  validarURL: function (url) {
    var pattern = new RegExp("^(https?://)?(([\\w!~*'().&=+$%-]+: )?[\\w!~*'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([\\w!~*'()-]+\\.)*([\\w^-][\\w-]{0,61})?[\\w]\\.[a-z]{2,6})(:[0-9]{1,4})?((/*)|(/+[\\w!~*'().;?:@&=+$,%#-]+)+/*)$");
        if (!pattern.test(url)) {
          console.log("Invalid URL => ", url);
          return false;
        } else {
          return true;
        }
  },

};