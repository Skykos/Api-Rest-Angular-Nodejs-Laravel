<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller {

    Public Function pruebas(Request $request) {
        Return "Retorno de pruebas de USER-Controller";
    }

    public function register(Request $request) {


//Recoger los datos del usuario por post
        $json = $request->input('json', null);
        $params = json_decode($json); //Objeto
        $params_array = json_decode($json, true); //Array
        if (!empty($params_array) && !empty($params)) {
            $params_array = array_map('trim', $params_array);
//var_dump($params_array);
//die();
//Validar datos 

            $validate = \Validator::make($params_array, [
                        'name' => 'required|alpha',
                        'surname' => 'required|alpha',
                        'email' => 'required|email|unique:users', //Verifica si el usuario ya esta registrado con el correo (unique:users)
                        'password' => 'required'
            ]);

            if ($validate->fails()) {
                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'El usuario no se ha creado',
                    'errors' => $validate->errors()
                );
            } else {
                //Usuario creado correctamente
                //Cifrado de contraseña 
                $pwd = hash('sha256', $params->password);
                //
                //creacion de usuario
                $user = new User();
                $user->name = $params->name;
                $user->surname = $params_array['surname'];
                $user->role = 'ROLE_USER';
                $user->email = $params_array['email'];
                $user->password = $pwd;

                //Guardar el Usuario
                $user->save();
                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario se ha creado correctamente',
                    'user' => $user,
                );
            }
        } else {
            $data = array(
                'status' => 'success',
                'code' => 400,
                'message' => 'Los datos no corresponden ;posiblemente mal formados o nulos',
            );
        }



//Crerar el usuario

        return response()->json($data);
    }

    public function login(Request $request) {

        $JwtAuth = new \JwtAuth();

        //recibir datos por post
        $json = $request->input('json', null);
        $params = json_decode($json); //Objeto
        $params_array = json_decode($json, true); //Array
        //Validar datos
        $validate = \Validator::make($params_array, [
                    'email' => 'required|email', //Verifica si el usuario ya esta registrado con el correo (unique:users)
                    'password' => 'required'
        ]);

        if ($validate->fails()) {
            $singup = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'El usuario no se a podido logear',
                'errors' => $validate->errors()
            );
        } else {
            //Cifrar password
            $pwd = hash('sha256', $params_array['password']);

            //devolver tokens o datos
            $singup = $JwtAuth->singup($params->email, $pwd);

            if (!empty($params->gettoken)) {
                $singup = $JwtAuth->singup($params->email, $pwd, true);
            }
        }
        return response()->json($singup, 200);
    }

    public function update(REQUEST $request) {

        //comprobar si el usuario esta identificado
        $token = $request->header('Authorization');
        $JwtAuth = new \JwtAuth();
        $checktoken = $JwtAuth->checktoken($token);
        //recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);

        if ($checktoken && !empty($params_array)) {
            //actualizar el usuario
            //Sacar usuario identificado
            $user = $JwtAuth->checktoken($token, true);
            //validar los datos
            $validate = \Validator::make($params_array, [
                        'name' => 'required|alpha',
                        'surname' => 'required|alpha',
                        'email' => 'required|email|unique:users' . $user->sub
            ]);
            //quitar los campos que no se actualizan 
            unset($params_array['id']);
            unset($params_array['role']);
            unset($params_array['password']);
            unset($params_array['created_at']);
            unset($params_array['remember_token']);
            //actualizar el usuario en la DB
            $user_update = User::where('id', $user->sub)->update($params_array);
            //devolver un array con el resultado
            $data = array(
                'code' => '200',
                'status' => 'success',
                'user' => $user,
                'changes' => $params_array
            );
        } else {
            $data = array(
                'code' => '400',
                'status' => ' error',
                'massage' => 'El usuario no esta identificado correctamente'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function upload(Request $request) {

        //recoger   Datos de la peticion
        $image = $request->file('file0');
        //validacion de imagen
        $validate = \Validator::make($request->all(), [
                    'file0' => 'required|image|mimes:jpg,jpeg,png,gif',
        ]);
        //Guardar la  imagen
        if (!$image || $validate->fails()) {

            $data = array(
                'code' => '400',
                'status' => 'Error',
                'message' => 'Error al subir la imagen'
            );
        } else {
            $image_name = time() . $image->getClientOriginalName();
            \Storage::disk('users')->put($image_name, \File::get($image));

            $data = array(
                'code' => '200',
                'image' => $image_name,
                'status' => 'success'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function getimage($filename) {

        $isset = \Storage::disk('users')->exists($filename);

        if ($isset) {
            $file = \Storage::disk('users')->get($filename);
            return new Response($file, 200);
        } else {
            $data = array(
                'code' => '404',
                'status' => 'error',
                'message' => 'La imagen no existe'
            );
        }
        return response()->json($data, $data['code']);
    }

    public function detail($id) {
        $user = User::find($id);
        
        if (is_object($user)) {
            
            $data = array(
                'code' => 200,
                'status' => 'success',
                'user' => $user
            );
        } else {
            $data = array(
                'code' => 404,
                'status' => 'error',
                'message' => 'el usuario no existe'
            );
            
        }
        return response()->json($data, $data['code']);
    }
    

}
