<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Category;

class CategoryController extends Controller {

    public function __construct() {
        $this->middleware('api.auth', ['except' => ['index', 'show']]);
    }

    Public function index() {
        $categories = Category::all();
        Return Response()->json([
                    'code' => 200,
                    'status' => 'success',
                    'categories' => $categories
        ]);
    }

    public function show($id) {
        $category = Category::find($id);
        if (is_object($category)) {
            $data = ([
                'code' => 200,
                'status' => 'success',
                'category' => $category
            ]);
        } else {
            $data = ([
                'code' => 404,
                'status' => 'error',
                'Message' => 'LA categoria no existe'
            ]);
        }
        return response()->json($data, $data['code']);
    }

    public function store(REQUEST $request) {
        //recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        if (!empty($params_array)) {
            $params_array = array_map('trim', $params_array);
            //validar los datos 
            $validate = \Validator::make($params_array, [
                        'name' => 'required|unique:categories'
            ]);
            //guardar la categoria
            if ($validate->fails()) {
                $data = ([
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'No se ha guardado la categoria'
                ]);
            } else {

                $category = new Category();
                $category->name = $params_array['name'];
                $category->save();
                $data = ([
                    'code' => 200,
                    'status' => 'Success',
                    'message' => 'Se ha guardado la categoria correctamente',
                    'data' => $category
                ]);
            }
        } else {
            $data = ([
                'code' => 400,
                'status' => 'error',
                'message' => 'NO se recibio ningun parametro'
            ]);
        }
        //devolcer resultado
        return response()->json($data, $data['code']);
    }

    public function update($id, REQUEST $request) {
        //recoger los aprametros por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        

        if (!empty($params_array)) {
            //validar los datos

            $validator = \Validator::make($params_array, [
                        'name' => 'required'
            ]);
            //Quitar lo que no quiero actualizar
            unset($params_array['id']);
            unset($params_array['created_at']);
            //actualizar registro
            $category = Category::where('id', $id)->update($params_array);
            //devolver los datos 
            $data = [
                'code' => 200,
                'status' => 'success',
                'Message' => 'LA categoria se ha modificado correctamente',
                'data' => $params_array
            ];
        } else {
            $data = ([
                'code' => 400,
                'status' => 'Error',
                'Message' => 'No se recibieron parametros'
            ]);
        }


        return response()->json($data, $data['code']);
    }

}
