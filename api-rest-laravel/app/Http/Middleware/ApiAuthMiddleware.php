<?php

namespace App\Http\Middleware;

use Closure;

class ApiAuthMiddleware {

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next) {
        $token = $request->header('Authorization');
        $JwtAuth = new \JwtAuth();
        $checktoken = $JwtAuth->checktoken($token);

        if ($checktoken) {
            return $next($request);
        } else {
            $data = array(
                'code' => '400',
                'stadus' => ' error',
                'massage' => 'El usuario no esta identificado correctamente'
            );
            return response()->json($data, $data['code']);
        }
    }

}
