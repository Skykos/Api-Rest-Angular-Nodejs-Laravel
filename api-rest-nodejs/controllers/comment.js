'use strict'
var topic = require('../models/topic');
var validator = require('validator');

var controller = {
    add: function(req, res){

        //recoger la id del topic de la url
         var topicid = req.params.topicId;
        //find por id del topic
        topic.findById(topicid).exec((err,topic) =>{

            if(err){
                return res.status(500).send({
                    message: ' Error al encontrar el tema ',
                    status: 'error'
                });
            }
            if(!topic){
                return res.status(404).send({
                    message: 'No existe el tema 7',
                    status: 'error'
                });
            }

            // comprobar objeto usuario y validar datos
             if(req.body.content){
                try{
                var validate_content = !validator.isEmpty(req.body.content);   
                console.log(validate_content);
                } catch(err){
                    return res.status(200).send({
                        message: 'No has comentado nada'
                    });   
                }

                if(validate_content){

                    var comment = {
                        user: req.user.sub,
                        content: req.body.content 
                    }
                    // en la propiedad comment del objeto resultante haer un push
                    topic.comment.push(comment);
                   
                    //Guardar el topic completo
                    topic.save((err,topic) =>{
                        if(err){
                            return res.status(404).send({
                                message: 'Error al guardar el comentario',
                                status: 'error'
                            });
                        }else{
                            
                            //devolver respuesta
                            return res.status(200).send({
                                message: 'Se Ha comentado',
                                status: 'success',
                                topic
                            });
                        }
                    });
                   
                }else{
                    return res.status(400).send({
                        message: 'contenido de validacion erroneo',
                        status: 'error'
                    });
                }
             }else{
                return res.status(200).send({
                    message: 'Comentario sin contenido',
                    status: 'error'
                });  
             }
           
        });
        
    },

    update: function(req, res){

        //Conseguir el id del comentario pur url
        var commentID = req.params.commentId;

        // Recoger datos que llegan por body y validar
        var params = req.body;

        try{
            var validate_content = !validator.isEmpty(params.content);   
            console.log(validate_content);
        }catch(err){
                return res.status(200).send({
                    message: 'No has comentado nada'
                });   
        }

        if(validate_content){
            // Hacer find and update de un subdocumento de un comentario
            topic.findOneAndUpdate(
                {"comment._id": commentID},
                { 
                    "$set": {
                        "comment.$.content": params.content
                    }
                    },
                    {new:true},
                    (err,topicUpdated) => {
                        if (err){
                            return res.status(500).send({
                                message: 'Error interno al actualizar el contenido',
                                status: 'error'
                            });
                        }

                        if(!topicUpdated){
                            return res.status(404).send({
                                message: 'Error el actualizar el comentario',
                                status: 'error'
                            });
                        }
                    // devolver datos
                    return res.status(200).send({
                        message: ' Todo fine',
                        status: 'success',
                        topicUpdated
                    });
                }); 
        }
    },

    delete: function(req, res){
        // Sacar el id del topic y del comentario a borrar por url
        var topicId = req.params.topicId;
        var commentId = req.params.commentId;
        // buscar el topic
        topic.findById(topicId, (err,topic) => {
            if (err){
                return res.status(500).send({
                    message: 'Error al buscar el tema',
                    status: 'error'
                });
            }

            if(!topic){
                return res.status(404).send({
                    message: 'No existe el tema',
                    status: 'error'
                });
            }
            // seleccionar el subdocumento
            var comment = topic.comment.id(commentId);
            // borrar el comentario 
            if(comment) {
                comment.remove();
                // guardar el topic
                topic.save((err) => {
                    if (err){
                        return res.status(500).send({
                            message: 'Error al guardar  el commentario updated',
                            status: 'error'
                        });
                    }
                    // devolver resultado
                    return res.status(200).send({
                        message: ' Todo fine al Borrar el comentario',
                        status: 'success',
                        topic
                    });
                });    
            }else{
                return res.status(404).send({
                    message: 'No se encontro commentario a borrar',
                    status: 'error'
                });
            }
            
        });
        
    },

};

module.exports = controller;