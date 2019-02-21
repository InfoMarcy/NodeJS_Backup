// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const jwt = require('jsonwebtoken');
// const validaciones  = require('../middleware/validaciones');

// const config = require("config");
// //working with log files
// const log4js = require("log4js");
// const logger = log4js.getLogger("adminRoute");
// //Cifrado
// const crypto = require("crypto-js");
// const usuarioFakeService = require('../middleware/usuarioFakeService');

// // show loggin form
// // router.get("/", auth, (req, res) => {
// //     res.set('X-Frame-Options', 'ALLOW-FROM http://10.51.58.240:4200/');
// //     let message = req.flash('error');

// //     if(message.length > 0){
// //         message = message[0];
// //       } else {
// //         message = null;
// //       };
// //       res.status(200).render("admin", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });
  
// // });


// // Get an item By ID from the database
// router.post("/",auth, async (req, res) => { 

//     // let cred = {
//     //   username: req.body.username,
//     //   password: req.body.password
//     // };
  
//     // logger.info('Fake User => ', req.body.fakeUser);

//     // validate username and password
//     // const { error } = validaciones.validateCredencials(cred);
//     // if (error) {
//     //   req.flash('error', 'Usuario y/o contraseña incorrectas');
//     //   return res.redirect('/bazdigital/v1/admin/habilitar/fake/user?code=' + req.body.AuthorizationCode);
//     //   }
  
//     //   validate that the user and the password don´t have the same values
//     //   const validateUserPassNotIguales = validaciones.validateUserPassNoIguales(cred.username, cred.password);
//     //   if (validateUserPassNotIguales) {
//     //     req.flash('error', 'Usuario y/o contraseña incorrectas');
//     //     return res.redirect('/bazdigital/v1/admin/habilitar/fake/user?code=' + req.body.AuthorizationCode);
//     //     };
//                 // Check if the ip is registered on the List
//             //   let usuarioFake = usuarioFakeService.getByusername(crypto.SHA256(req.body.username).toString());

//               logger.info("usuarioFake => ", usuarioFake);

//             if (usuarioFake == 0) {
//                 req.flash('error', 'Usuario y/o contraseña incorrectas');

//                 let message = req.flash('error');
//                 if (message.length > 0) {
//                     message = message[0];
//                 } else {
//                     message = null;
//                 };

//                 return res.status(200).render("adminResponse", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });
//             } 

//            // compare the passwords the password against the json file
//            const validPassword = validaciones.validatePassword(
//             usuarioFake.password,
//             crypto.SHA256(req.body.password).toString()
//           );
//                 // validate if the password exist
//                 if (!validPassword) {

//                     logger.info({
//                         cgSalida: "CI-104",
//                         descSalida:
//                           "Error de autenticación, (El usuario y/o contraseña son incorrectos)"
//                       });

//                     req.flash('error', 'Usuario y/o contraseña incorrectas');
//                     let message = req.flash('error');
//                     if (message.length > 0) {
//                         message = message[0];
//                     } else {
//                         message = null;
//                     };
//                     return res.status(200).render("adminResponse", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });

//                 };

//                     // reset the values for the credentials
//                    cred = {};


//      // habilitar o desabilitar usuario fake
//      if(req.body.fakeUser == '1'){

//                 //===================  user is correct ===================
//                 usuarioFake.fakeUser = true;

//                if(usuarioFakeService.update(usuarioFake.username, usuarioFake)){
//                 req.flash('error', 'El usuario fake ha sido habilitado');

//                 let message = req.flash('error');
//                 if (message.length > 0) {
//                     message = message[0];
//                 } else {
//                     message = null;
//                 };

//                 return res.status(200).render("adminResponse", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });
//                 } else {
//                     req.flash('error', 'Incidencia al habilitar el usuario fake');

//                     let message = req.flash('error');
//                     if (message.length > 0) {
//                         message = message[0];
//                     } else {
//                         message = null;
//                     };


//                    return res.status(200).render("adminResponse", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });
//                 };
  
//         }else {
//                             //===================  user is correct ===================
//                             usuarioFake.fakeUser = false;

//                             if(usuarioFakeService.update(usuarioFake.username, usuarioFake)){
//                              req.flash('error', 'El Usuario fake ha sido deshabilitado');

//                              let message = req.flash('error');
//                              if (message.length > 0) {
//                                  message = message[0];
//                              } else {
//                                  message = null;
//                              };


//                              return res.status(200).render("adminResponse", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });
//                              } else {
//                                  req.flash('error', 'Incidencia al desahabilitar al Usuario fake');

//                                  let message = req.flash('error');
//                                  if (message.length > 0) {
//                                      message = message[0];
//                                  } else {
//                                      message = null;
//                                  };

//                                 return res.status(200).render("adminResponse", { pageTitle: "Banca Digital Login App Admin", errorMessage: message });
//                              };

//         }

//   });

// module.exports = router;
