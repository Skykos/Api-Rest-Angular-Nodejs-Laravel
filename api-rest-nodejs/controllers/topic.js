'use strict'

var Topic = require('../models/topic');
var validator = require('validator');
const { findById } = require('../models/topic');
const topic = require('../models/topic');

var controller = {

    test: function(req,res){

        return res.status(200).send({
            message: 'esto es desde el nuevo tin'
        });
    },

    save: function(req,res){

        //recoger parametros por post
        var params = req.body;
        
        //validar los datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
            
        } catch(err){
            return res.status(200).send({
                message: 'faltan datos por enviar '
            });   
        }
        if(validate_content && validate_title && validate_lang){
            //crear objeto a guardar
            var topic = new Topic();
            //asignarle valores
            topic.title = params.title;
            topic.content = params.content;
            topic.code = params.code;
            topic.lang = params.lang;
            topic.user = req.user.sub;
            //guardar el topic y devover respuesta
            topic.save((err, topicStored) =>{
                if(err || !topicStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error al guardar El topic'
                    });
                }else{
                    return res.status(200).send({
                        message: 'Topic guardado correctamente',
                        status: 'success',
                        topic: topicStored
                    });
                }
            });
        }else{
            return res.status(404).send({
                message: 'error en las validaciones '
            });
        }
        
    },

    getTopics : function(req, res ){

        //Cargar la libreria de paginacion (En el MODELO TOPIC)
        //recoger la pagina actual
        var page = parseInt( req.params.page);
        if(!page){
            page = 1;
        } 
        //Indicar las opciones de paginacion
        var options = {
            sort: {date : -1},
            populate: 'user',
            limit: 5,
            page: page
            
        };
        //hacer el find paginado
        Topic.paginate({}, options, (err,result) => {
            if (err){
                return res.status(500).send({
                    message: 'error de paginacion ',
                    status: 'error',
                    error: err
                });
            }
            if (!result){
                return res.status(400).send({
                    message: 'error de paginacion2 sin temas',
                    status: 'error',
                    
                    });
            }else{
                //devolver resultado(topcis, total de documentos, total de paginacion)
                return res.status(200).send({
                    message: 'Paginacion con exito ',
                    status: 'success',
                    Topics: result.docs,
                    totalDocs: result.totalDocs,
                    totalPages: result.totalPages
                    
                });
            }
        });
    },
    getTopicsByUser: function(req, res){
        //Conseguir el id del usuario
        var userId = req.params.user;


        //Hacer un find con la condiciion de usuario
        Topic.find({user:userId}).sort([['date','descending']]).exec((err, topics) => {
            if(err){
                return res.status(500).send({
                    mesagge: 'error en la peticion',
                    status : 'error'
                    
                });
            }

            if(!topics){
                return res.status(404).send({
                    mesagge: 'No hay temas para mostrar',
                    status : 'error'
                });
            }
        
            //devolver un resultado
            return res.status(200).send({
                status: 'success',
                mesagge: 'Peticion satisfactoria',
                topics
            });
        });
    },

    getTopic: function(req,res){
        // Sacar el id del topic de a url
        var TopicId = req.params.id;
        //hacer un fine por id del topic
        Topic.findById(TopicId).populate('user').populate('comment.user').exec((err,topic) => {
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message:' error en traer el post'
                });
            }
            if(!topic){
                return res.status(404).send({
                    status: 'error',
                    message:' error en estructura del topic'
                });
            }
             //devolver el resultado

             return res.status(200).send({
                status: 'success',
                messagge: 'Todo fine',
                topic: topic
            });

        });
        
    },

    update: function(req, res){
        // Recoger el id del topic de la url
        var topicId = req.params.id;
        // recoger los datos que llegan desde post
        var params = req.body;
        // validar la indormacion
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            var validate_lang = !validator.isEmpty(params.lang);
            
        } catch(err){
            return res.status(200).send({
                message: 'faltan datos por enviar '
            });   
        }
        if(validate_content && validate_title && validate_lang){
            // montar un json con los datos a modificar
            var update = {
                title: params.title,
                content: params.content,
                code: params.code,
                lang: params.lang
            }
            // hacer un find nad update del topic del id y validar que somos dueños del post
            Topic.findOneAndUpdate({_id: topicId, user: req.user.sub}, update, {new: true}, (err, topicUpdated)=>{
                if(err){
                    return res.status(400).send({
                        message: 'Error en actualizar el docuemento',
                        status: 'error'
                    });
                }
                if(!topicUpdated){
                    return res.status(500).send({
                        message: 'Error en los datos al treaerlos',
                        status: 'error'

                    })
                }
                // devolver respuesta
                return res.status(200).send({
                message: 'fine desde el update',
                status: 'success',
                topic : topicUpdated

            });
            });
            
        }else{
            return res.status(500).send({
                message: 'La validacion no es correcta',
                status: 'error'
            });
        }      
    },

    delete: function(req, res){
        //Sacar el id del topic de la url
        var topicId = req.params.id;
        //hacer un findd and delete por topic id y user id
        Topic.findOneAndDelete({_id: topicId, user: req.user.sub}, (err, topicRemoved) => {
            if(err){
                return res.status(400).send({
                    message: ' error al borrar el tema',
                    status: 'error',    
                });
            }
            if(!topicRemoved){
                return res.status(500).send({
                    message: 'Error en el remover el topic',
                    status: 'error',
                    topicRemoved
                });
            }
             // devolver respuesta
            return res.status(200).send({
            message: 'Tema eliminado satisfactoriamente',
            status: 'success',
            topicRemoved
        });
        });
       
    },

    search: function(req, res){
        // Sacar string a buscar de la url
        var searchString = req.params.search;
        // hacer un find con un operador or 
        topic.find({ "$or": [
            {"title": {"$regex": searchString, "$options": "i"}},
            {"content": {"$regex": searchString, "$options": "i"}},
            {"code": {"$regex": searchString, "$options": "i"}},
            {"lang": {"$regex": searchString, "$options": "i"}},
        ]}).sort([['date','descending']]).populate('user')
        .exec((err,topics)=>{
            if(err){
                return res.status(500).send({
                    message: 'Error al consultar',
                    status: 'error'
                });
            }

            if(!topics){
                
                return res.status(404).send({
                    message: 'Error al obtener busqueda',
                    status: 'error'
                });
            }
            // devolver resultado
            return res.status(200).send({
            message: 'Todo fine desde el search',
            status: 'success',
            topics
        });
        });
        
    },
};

module.exports = controller;