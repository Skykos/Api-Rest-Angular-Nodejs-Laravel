'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3999;

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api_rest_nodejs',{useNewUrlParser:true})
                .then(()=>{
                    console.log('La conexión se ha realizado correctamente');

                    //crear el servidor
                    app.listen(port, ()=>{
                        console.log('>El servidor Http://localhost:'+port+' esta funcionado ');
                    });
                }).catch(error=> console.log(error));
