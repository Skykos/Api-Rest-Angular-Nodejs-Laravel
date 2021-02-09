'use strict'

// requerimientos
var express = require('express');
var bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');


//ejecutar express
var app = express();

// cargar archivos de rutas
var user_routes = require('./routes/user');
var topic_router = require('./routes/topic');
var comment_router = require('./routes/comment');

//añadir middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//CORS
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//Reescribir rutas

app.use('/api', user_routes);
app.use('/api', topic_router);
app.use('/api', comment_router);


//exportar el modulo
module.exports = app;