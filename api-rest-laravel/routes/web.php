<?php


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//cargando clases
use App\Http\Middleware\ApiAuthMiddleware;

Route::get('/', function () {
    return view('welcome');
    
});

#Rutas de prueba
//Route::get('/testorm', 'PruebasController@TestOrm');
//Route::get('/Ucontroller', 'UserController@pruebas');
//Route::get('/Ccontroller', 'CategoryController@pruebas');
//Route::get('/Pcontroller', 'PostController@Pruebas');

#Rutas Reales

Route::Post('/api/register', 'UserController@register');
Route::post('/api/login', 'UserController@login');
Route::put('/api/user/update', 'UserController@update');
Route::post('/api/user/upload','UserController@upload')->middleware(ApiAuthMiddleware::class);
Route::get('/api/user/avatar/{filename}', 'UserController@getimage');
Route::get('/api/user/detail/{id}','UserController@detail');

//Rutas del controlador de categorias

Route::resource('/api/category','CategoryController');
// Rutas del controlador de entradas
Route::resource('/api/post','PostController');
Route::post('/api/post/upload','PostController@upload');
Route::get('api/post/Image/{filename}','PostController@getImage');
Route::get('api/post/category/{id}','PostController@getPostsByCategory');
Route::get('api/post/user/{id}','PostController@getPostsByUser');
