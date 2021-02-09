"use strict";

var validator = require("validator");
var bcrypt = require("bcrypt-node");
var User = require("../models/user");
var jwt = require("../services/jwt");
const user = require("../models/user");
var fs = require("fs");
var path = require("path");

var controller = {
    probando: function (req, res) {
        return res.status(200).send({
            message: "soy el metodo probando",
        });
    },
    testeando: function (req, res) {
        return res.status(200).send({
            message: "soy el metodo testeando",
        });
    },

    save: function (req, res) {
        //Recoger los parametros de la peticion

        var params = req.body;

        //Validar los datos
        try {
            var validate_name =
                !validator.isEmpty(params.name) && validator.isAlpha(params.name);
            var validate_surname =
                !validator.isEmpty(params.surname) && validator.isAlpha(params.surname);
            var validate_email =
                validator.isEmail(params.email) && !validator.isEmpty(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(404).send({
                mesagge: "Faltan datos por enviar",
            });
        }

        console.log(
            validate_name,
            validate_surname,
            validate_email,
            validate_password
        );
        if (
            validate_name &&
            validate_surname &&
            validate_password &&
            validate_email
        ) {
            //Crear objeto del usuario

            var user = new User();

            //Asignar valores del objeto

            user.name = params.name;
            user.surname = params.surname;
            user.email = params.email.toLowerCase();
            user.password = params.password;
            user.role = "ROLE_USER";
            user.image = null;

            //comprobar si el usuario existe
            User.findOne({ email: user.email }, (err, issetUser) => {
                if (err) {
                    return res.status(500).send({
                        message: "Error al comprobar duplicidad  del usuario ",
                    });
                }

                if (!issetUser) {
                    //Si no existe, cifrar la contraseña
                    bcrypt.hash(params.password, null, null, (err, hash) => {
                        user.password = hash;
                        //guardar
                        console.log(user);
                        user.save((err, UserStored) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).send({
                                    message: "Error al Guardar el usuario ",
                                });
                            } else {
                                if (!UserStored) {
                                    return res.status(500).send({
                                        message: "El usuario no se ha guardado ",
                                    });
                                }
                            }
                            //devolver respuesta

                            return res.status(200).send({
                                status: "success",
                                message: "Todo Fine desde la guardada del usuario",
                                user: UserStored,
                            }); //Close Save
                        }); // Close bcrypt
                    }); // Close Issetuser
                } else {
                    return res.status(200).send({
                        message: "El usuario ya existe con correo",
                        params: user.email,
                    });
                }
            });
        } else {
            return res.status(200).send({
                message: "Validacion de datos incorrecta. Intentalo de nuevo",
            });
        }
    },

    login: function (req, res) {
        // Recoger los parametros de la peticion

        var params = req.body;

        // validar los datos
        try {
            var validate_email =
                !validator.isEmpty(params.email) && validator.isEmail(params.email);
            var validate_password = !validator.isEmpty(params.password);
        } catch (err) {
            return res.status(404).send({
                mesagge: "Faltan datos por enviar",
            });
        }
        if (!validate_email || !validate_password) {
            return res.status(300).send({
                mesagge: "Datos incorrectos , Revisa los datos del formulario",
            });
        }

        // Buscar usuarios que coincidan con el email que llega
        User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
            if (err) {
                return res.status(500).send({
                    mesagge: "Se encontro un error el intentar identificarse",
                });
            }

            if (!user) {
                return res.status(404).send({
                    mesagge: "El usuario no exite ",
                });
            }

            // si lo encuentra, comprobar contraseña (coincidencia de email y password // usando bcrypt)

            bcrypt.compare(params.password, user.password, (err, check) => {
                // si las credenciales coinciden
                if (check) {
                    //limpiar el objeto
                    user.password = undefined;
                    //user._id = undefined;
                    //Generar token de jwt y
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user),
                        });
                    } else {
                        //Devolver datos
                        return res.status(200).send({
                            status: "success",
                            user,
                        });
                    }
                } else {
                    return res.status(404).send({
                        mesagge: "Las credenciales no son correctas",
                    });
                }
            });
        });
    },

    update: function (req, res) {
        //Aqui ya esta corriendo el middleware

        //Recoger los datos del usuario

        var params = req.body;
        //validar datos
        try {
            var validate_name =
                !validator.isEmpty(params.name) && validator.isAlpha(params.name);
            var validate_surname =
                !validator.isEmpty(params.surname) && validator.isAlpha(params.surname);
            var validate_email =
                validator.isEmail(params.email) && !validator.isEmpty(params.email);
        } catch (err) {
            return res.status(404).send({
                mesagge: "Faltan datos por enviar",
            });
        }

        //eliminar propiedades inecesarios
        delete params.password;
        //Cambiar por esta variable:  var userId = req.user.sub;
        var userId = req.user.sub;
        console.log(userId);
        //buscaar y actualizar documento

        //Comprobar si el email es unico
        console.log(req.user.email);
        console.log(params.email);
        if (req.user.email != params.email) {
            console.log('entro al if');
            User.findOne({ email: params.email.toLowerCase() }, (err, user) => {
                if (err) {
                    return res.status(500).send({
                        mesagge: "Se encontro un error el intentar identificarse",
                    });
                }

                if(!user){
                    return res.status(500).send({
                        mesagge: "Email no se encontro",
                        status: 'error',
                    });
                }

                if (user && user.email == params.email) {
                    return res.status(200).send({
                        mesagge: "El email no puede ser modificado",
                    });
                }
            });

        } else {
            var query = { _id: userId };
            //Cambiar query por este : _id:userId
            User.findOneAndUpdate(
                query,
                params,
                { new: true },
                (err, userUpdated) => {
                    //Devolver respuesta
                    if (err) {
                        return res.status(500).send({
                            status: "error",
                            mesagge: "error al actualizar usuario",
                        });
                    }
                    if (!userUpdated) {
                        return res.status(500).send({
                            status: "error",
                            mesagge: "No se ha actualizado el usuario",
                            user: userUpdated,
                        });
                    }
                    return res.status(200).send({
                        status: "success",
                        mesagge: "Datos Actualizados correctamente",
                        user: userUpdated,
                    });
                }
            );
        }
    },
    uploadAvatar: function (req, res) {
        //Configurar el modulo Multyparty (md) //its done! routes>/user.js

        //Recoger el fichero de la peticion
        var file_name = "Avatar no subido";
        console.log(req.files);
        if (!req.files) {
            return res.status(404).send({
                status: "error",
                mesagge: "NO se encontro el archivo a subir " + file_name + "",
            });
        }

        //conseguir el nombre y la extencion del archivo subido
        var file_path = req.files.file0.path;
        var file_split = file_path.split("\\");
        //Nombre del archivo
        var file_name = file_split[2];

        //Extencion del archivo
        var ext_split = file_name.split(".");
        var file_ext = ext_split[1];

        //Comprobar la extencion solo imagen (Si no es valido borrar la imagen )
        let ext_validas = ["jpg", "png", "jpeg", "gif"];
        console.log(ext_validas[2]);
        if (
            file_ext != ext_validas[0] &&
            file_ext != ext_validas[1] &&
            file_ext != ext_validas[2] &&
            file_ext != ext_validas[3]
        ) {
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: "error",
                    mesagge: "La extencion no es valida : " + file_ext + "",
                });
            });
        } else {
            //Sacar el id del usuario identificado
            var userId = req.user.sub;
            console.log(userId);

            //Buscar y actualizar documento
            User.findOneAndUpdate(
                { _id: userId },
                { image: file_name },
                { new: true },
                (err, userUpdated) => {
                    // Devolver una respuesta
                    if (err || !userUpdated) {
                        return res.status(500).send({
                            status: "error",
                            mesagge: "Error al guardar el usuario",
                        });
                    }
                    return res.status(200).send({
                        status: "success",
                        mesagge: "Bien",
                        user: userUpdated,
                    });
                }
            );
        }
    },

    avatar: function (req, res) {
        var fileName = req.params.fileName;
        var pathFile = "./uploads/users/" + fileName;

        fs.exists(pathFile, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    message: "La imagen no existe",
                });
            }
        });
    },

    getUsers: function (req, res) {
        User.find().exec((err, users) => {
            if (err || !users) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay usuarios que mostrar",
                });
            } else {
                return res.status(200).send({
                    status: "success",
                    Users: users,
                });
            }
        });
    },
    getUser: function (req, res) {
        var userId = req.params.userId;

        User.findById(userId).exec((err, user) => {
            if (err || !user) {
                return res.status(404).send({
                    status: "error",
                    message: "No se encontro usuario",
                });
            } else {
                return res.status(200).send({
                    starus: "success",
                    User: user,
                });
            }
        });
    },
};

module.exports = controller;
