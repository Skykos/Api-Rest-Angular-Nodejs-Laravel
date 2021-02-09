<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Post;
use App\Helpers\JwtAuth;

class PostController extends Controller {

    Public Function pruebas(Request $request) {
        Return "Retorno de pruebas de POST-Controller";
    }

    public function __construct() {
        $this->middleware('api.auth', ['except' => ['index', 'show', 'getImage','getPostsByCategory','getPostsByUser']]);
    }

    private function getIdentity($request) {
        $JwtAuth = New JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $JwtAuth->checktoken($token, true);
        return $user;
    }

    public function index() {
        $posts = Post::all()->load('category');
        return response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'Posts' => $posts
        ]);
    }

    public function show($id) {
        $post = Post::find($id)->load('category')
                                ->load('user');

        if (Is_object($post)) {
            $data = ([
                'code' => 200,
                'status' => 'success',
                'Post' => $post
            ]);
        } else {
            $data = ([
                'code' => 404,
                'status' => 'Error',
                'Post' => 'Post no encontrado'
            ]);
        }
        return response()->json($data, $data['code']);
    }

    public function store(REQUEST $request) {
        //recoger datos por post
        $json = $request->input('json', null);
        //$params = json_decode($json);
        $params_array = json_decode($json, true);
        //var_dump($params_array);die();
        if (!empty($params_array)) {

            //Conseguir el usuario Identificado
            $user = $this->getIdentity($request);
            //validar los datos 
            $validate = \Validator::make($params_array, [
                        'title' => 'required',
                        'content' => 'required',
                        'category_id' => 'required',
                        'image' => 'required'
            ]);

            if ($validate->fails()) {
                $data = ([
                    'code' => 400,
                    'status' => 'Error',
                    'Message' => 'Se encontraron errores de validacion',
                    'Message2' => $validate->errors()
                ]);
            } else {
                //guardar el post
                $post = new Post();
                $post->user_id = $user->sub;
                $post->category_id = $params_array['category_id'];
                $post->title = $params_array['title'];
                $post->content = $params_array['content'];
                $post->image = $params_array['image'];
                $post->save();
                $data = ([
                    'code' => 200,
                    'status' => 'success',
                    'Post' => $post
                ]);
            }
        } else {
            $data = ([
                'code' => 400,
                'status' => 'Error',
                'Message' => 'Envia los datos correctamente jk'
            ]);
        }
        return response()->json($data, $data['code']);
    }

    public function update($id, Request $request) {
        //recoger los datos por post
        $json = $request->input('json');
        $params_array = json_decode($json, true);
        //Datos para devolver
        $data = ([
                'code' => 400,
                'status' => 'error',
                'post' => 'datos enviados incorrectamente'
            ]);
        if(!empty($params_array)){
            //validar los datos 
            $validate = \Validator::make($params_array, [
                        'title' => 'required',
                        'content' => 'required',
                        'category_id' => 'required'
            ]);
            if($validate->fails()){
                $data['errors'] = $validate->errors();
                return response()->json($data,$data['code']);
            }
            //eliminar lo que no se quiere actualizar
            unset($params_array['user_id']);
            unset($params_array['id']);
            unset($params_array['created_at']);
            unset($params_array['user']);
            
            $user = $this->getIdentity($request);
            //Buscar el registro
            $post = Post::where('id', $id)
                ->where('user_id', $user->sub)
                ->first();
            
            if(!empty($post)&& is_object($post)){
                
                //Actualizar el registro en concreto
                $post->update($params_array);
                $data =  ([
                'code' => 200,
                'status' => 'success',
                'post' => $post,
                'changes' => $params_array
            ]);
            }
            
            /*
            $where = [
                'id' => $id,
                'user_id' => $user->sub
            ];
            $post = Post::updateOrCreate($where,$params_array); 
             * */
            
            //devolver algo
            
    }
            return response()->json($data, $data['code']);
    }

    public function destroy($id, Request $request) {
        //Conseguir usuario identificado
        $user = $this->getIdentity($request);
        //Conseguir el registro
        $post = Post::where('id', $id)
                ->where('user_id', $user->sub)
                ->first();
        if (is_object($post)) {

            //Borrarlo
            $post->delete();
            //dar mensaje
            $data = ([
                'code' => '200',
                'status' => 'Confirmated',
                'Message' => 'el Registro con el nombre de ' . $post->title . ' se ha borrado correctamente'
            ]);
        } else {
            $data = ([
                'code' => '400',
                'status' => 'error',
                'Message' => 'Post no encontrado'
            ]);
        }
        return response()->json($data, $data['code']);
    }
    
    public function upload (Request $request){
        
        //recoger la imagen de la peticion
        $image = $request->file('file0');
        //validar la imagen
        //
        $validate = \Validator::make($request->all(),[
            'file0' => 'required|image|mimes:png,jpg,jpeg'
        ]);
        //guardar la imagen en un disco
        if(!$image || $validate->fails()){
            $data = ([
                'code' => 400,
                'status' => 'error',
                'message' => 'Error al subir la imagen',
                'Errors' => $validate->errors()
                
            ]);
        }else{
            $image_name = time().$image->getClientOriginalName();
            
            \Storage::disk('images')->put($image_name, \File::get($image));
            $data = ([
                'code' => 200,
                'status' => 'success',
                'image' => $image_name,
                'message' => 'Se ha subido la imagen correctamente con nombre '
            ]);
        }
       return response()->json($data,$data['code']);
        
    }
    public function getImage($filename){
        
        //comprobar si existe 
        $isset = \Storage::disk('images')->exists($filename); 
        if($isset){
            //conseguir la imagen
            $file = \Storage::disk('images')->get($filename);
            //devolver la imagen
            return New response($file,200);
            $data = ([
               'code' => 200,
               'status' => 'success',
               'message' => 'Imagen Obtenida'
           ]); 
            
        }else{
           $data = ([
               'code' => '404',
               'status' => 'error',
               'message' => 'la imagen no existe'
           ]); 
        }
        //dar respuesta
        return response()->json($data,$data['code']);
        
    }
    public function getPostsByCategory($id){
        $posts = Post::where('category_id',$id)->get();
        return response()->json([
             'status' => 'success',
            'post' => $posts
            
        ],200);
    }
    public function getPostsByUser($id){
        $posts = Post::where('user_id',$id)->get();
        return response()->json([
             'status' => 'success',
            'post' => $posts
            
        ],200);
    }
    
}
