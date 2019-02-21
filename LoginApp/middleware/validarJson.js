const https = require("https");
const dateFormat = require("dateformat");
const now = new Date();
module.exports = {
  getJson: function(options, cb) {
    https
      .request(options, function(res) {
        var body = "";

        res.on("data", function(getData) {
          body += getData;
        });

        res.on("end", function() {
          let usuario = JSON.parse(body);
          cb(null, usuario);
        });
        res.on("error", cb);
      })
      .on("error", cb)
      .end();
  },

  // Verify that the return json is not empty
  isEmptyObject: function(obj) {
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return false;
      }
    }
    return true;
  },

  generarFolio: function(ip) {
    try {
      let time_milisec = new Date(
        parseInt(dateFormat(now, "yyyyMMddHHmmssS"))
      ).getTime();
      let octeto = ip.split(".")[3];
      return octeto + time_milisec;
    } catch (err) {
      return "";
    }
  }
};
