const axios = require("axios");
var querystring = require('querystring');
var https = require("https");

module.exports = {
    logUser: async function (req) {
        //variable to hold the values return
        let respuesta = new Object();
        // options for the request
        var opciones = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        };
        // body to send the request
        var body = querystring.stringify({
            username: req.username,
            password: req.password
        });
        // call to the service
        await axios.post("https://10.63.32.44:8446/auth/v4/oauth/token", body, opciones).then(resp => {
            respuesta = resp.data;
        }).catch(err => {
            throw new Error("Ocurrio un error con el consumo del servicio de 360", err);
        });
        return respuesta;
    }


};