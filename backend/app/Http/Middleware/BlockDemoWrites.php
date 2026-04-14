<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class BlockDemoWrites
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        if (auth()->check() && auth()->user()->is_demo) {

            if (in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE'])) {
                return response()->json([
                    'message' => 'Mode démo - action non autorisée'
                ], 403);
            }
        }
        return $next($request);
    }
}
