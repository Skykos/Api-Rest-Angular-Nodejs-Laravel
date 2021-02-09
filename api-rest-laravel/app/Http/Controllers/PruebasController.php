<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Post;
use App\Category;


class PruebasController extends Controller
{
    
    Public function TestOrm(){
        $posts = Post::all();
        foreach ($posts as $post){
        echo "<h1>".$post->title."</h1>";
        echo $post->user->name;
        echo ' - ';
        echo $post->category->name;
        echo "<p>".$post->content."</p>";
        echo "<hr>";
        }
    }
}
