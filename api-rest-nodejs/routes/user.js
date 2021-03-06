'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');

var md_upload = multipart({uploadDir: './uploads/users'});

var router = express.Router();


//rutas de pruebas
router.get('/probando',UserController.probando);
router.post('/testeando', UserController.testeando);
//rutas del sistema

//Rutas de usuarios
router.post('/register',UserController.save);
router.post('/login', UserController.login);
router.put('/update_user',md_auth.authenticated,UserController.update);
router.post('/upload-avatar',[md_auth.authenticated ,md_upload], UserController.uploadAvatar);
router.get('/avatar/:fileName',UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:userId', UserController.getUser);

module.exports = router;