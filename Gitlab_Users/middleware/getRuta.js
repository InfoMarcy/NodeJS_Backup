const path = require("path");

module.exports = {
  // metodo para obtener las rutas de los archivos
  getRuta: function(carpeta, ruta) {
    const p = path.join(
      path.dirname(process.mainModule.filename),
      carpeta,
      ruta
    );
    return p;
  }
};


