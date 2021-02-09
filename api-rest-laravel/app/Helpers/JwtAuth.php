<?php

namespace App\Helpers;

use Firebase\JWT\JWT;
use Illuminate\Support\Facades\DB;
use App\User;

class JwtAuth {

    public $key;

    public function __construct() {
        $this->key = 'Esto_es_una_clave-super-Secreta-0987654321';
    }

    public function singup($email, $password, $gettoken = null) {
        
        //Buscar si existe el usuario con las credenciales 
        $user = User::where([
                    'email' => $email,
                    'password' => $password
                ])->first();
        //Comprobar si son correctos(objeto)
        $singup = false;
        if (is_object($user)) {
            $singup = true;
        }
        //Generar el token con los datos
        if ($singup) {
            $token = array(
                'sub' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'surname' => $user->surname,
                'description' => $user->description,
                'image' => $user->image,
                'iat' => time(),
                'exp' => time() + (7 * 24 * 60 * 60),
                
            );
            $jwt = JWT::encode($token, $this->key, 'HS256');
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
            //devolver los datos decodificados o el token en funcion a un parametro
            if (is_null($gettoken)) {
                $data = $jwt;
            } else {
                $data = $decoded;
            }
        } else {
            $data = array(
                'status' => 'error',
                'message' => 'Login Incorrecto'
            );
        }

        return $data;
    }

    public function checktoken($jwt, $getidentity = false) {
        $auth = false;
        try {
            $jwt = str_replace('"', '', $jwt);
            $decoded = JWT::decode($jwt, $this->key, ['HS256']);
        } catch (\UnexpectedValueException $e) {
            $auth = false;
        } catch (\DomainException $e) {
            $auth = false;
        }
        if (!empty($decoded) && is_object($decoded) && isset($decoded->sub)) {
            $auth = true;
        } else {
            $auth = false;
        }

        if ($getidentity) {
            return $decoded;
        }
        return $auth;
    }

}
