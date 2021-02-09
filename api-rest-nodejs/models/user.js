'use strict'

var mongoose = require ('mongoose');
var Schema = mongoose.Schema

var UserSchema = Schema({
    id_:String,
    name: String,
    surname: String,
    email: String,
    password: String,
    image: String,
    role: String

});

// Metodo que elimina la variable password cuando popula o hace el enbebido de los datos de usuario( ejemplo paginacion)
UserSchema.methods.toJSON = function (){
    var obj = this.toObject();
    delete obj.password;

    return obj;
}

module.exports = mongoose.model('User',UserSchema);