const Joi = require("joi");
const dateFormat = require("dateformat");
const now = new Date();
//working with log files
const log4js = require("log4js");
const logger = log4js.getLogger("validaciones");
module.exports = {

  
  validateNumEmpleado: function(req) {
    const schema = {
      numEmpleado: Joi.number()
        .integer()
        .required()
    };

    return Joi.validate(req, schema);
  },

  validateIp: function(req) {
    const schema = {
      ip: Joi.string()
        .min(7)
        .max(45)
        .required()
    };

    return Joi.validate(req, schema);
  },

  validateDate: function(fecha) {
    // Convert both dates to milliseconds
    let one_day = 1000 * 60 * 60 * 24;
    // convert the date to be use to compare the days
    let usuarioPassDate = new Date(
      parseInt(dateFormat(fecha, "yyyy")),
      parseInt(dateFormat(fecha, "mm")) - 1,
      parseInt(dateFormat(fecha, "dd")) + 1,
      parseInt(dateFormat(fecha, "HH") - 5),
      parseInt(dateFormat(fecha, "MM")),
      parseInt(dateFormat(fecha, "ss"))
    );

    let difference_ms = now.getTime() - usuarioPassDate.getTime();

    if (Math.round(difference_ms / one_day) > 90) {
      logger.info(
        `La contraseña ha expirado, el numero máximo de días para cambiar la contraseña es 90 dias, este usuario tiene ${Math.round(
          difference_ms / one_day
        )} con esta contraseña, Gracias`
      );
      return true;
    } else {
      logger.info(
        `La contraseña esta activa, el numero máximo de días para cambiar la contraseña es 90 dias, este usuario tiene ${Math.round(
          difference_ms / one_day
        )} con esta contraseña, Gracias`
      );
      return false;
    }
  },

  validateFechaBloqueo: function(fecha) {

    logger.info("Fecha de Bloqueo => ", fecha);

    // Convert both dates to milliseconds
    let one_minute = 1000 * 60;
    // convert the date to be use to compare the days
    let usuarioPassDate = new Date(
      parseInt(dateFormat(fecha, "yyyy")),
      parseInt(dateFormat(fecha, "mm")) - 1,
      parseInt(dateFormat(fecha, "dd")),
      parseInt(dateFormat(fecha, "HH")),
      parseInt(dateFormat(fecha, "MM")),
      parseInt(dateFormat(fecha, "ss"))
    );
    let difference_ms = now.getTime() - usuarioPassDate.getTime();

    if (Math.round(difference_ms / one_minute) >= 10) {
      logger.info(
        `Usuario Desbloqueado ,  ${Math.round(
          difference_ms / one_minute
        )}...`
      );
      return true;
    } else {
      logger.info(
        `El Usuario se encuentra bloqueado ${Math.round(
          difference_ms / one_minute
        )}...`
      );
      return false;
    }
  }


};


// https://authns.desadsi.gs/nidp/oauth/nam/token?grant_type=password&client_id=780d3cde-a591-42fc-b225-212773a6956b&client_secret=1ymTZkQjBdx9K5lu6tavra_ilM0V4pc6TTiA3- LOy7wDIno5uG4nVaxgJcn46Fpl2UdloDWJippViN9lbgyqQw&username=41900&password=GrupoSalinas2019&acr=secure/name/password/uri