'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = "Clave-Secreta_para-Generar_el-token-9999";

exports.authenticated = function(req,res,next){
    // cOMPROBAR SI LLEGA AUTORIZACION
    if(!req.headers.authorization){
        return res.status(403).send({
            message: "NO se encontro la cabecera de autenticacion"
        });
    }
    //Limpiar el token y limpiar comillas
    var token = req.headers.authorization.replace(/['"]+/g,'');

    
    try{
        //decodificar el token
        var payload = jwt.decode(token,secret);
        //comprobar la expiracion del token
        if(payload.exp <= moment().unix()){
            return res.status(404).send({
                message: "El token ha expirado"
            });
        }
    }catch(ex){
        return res.status(404).send({
            message: "El token no es valido"
        });
    }
    
    //adjuntar usuario identificado
    req.user = payload;
    
    //pasar a la accion
    
    console.log("Estas pasando por el middleware");
    
    
    next();
}