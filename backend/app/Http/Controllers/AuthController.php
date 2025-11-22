<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     * Validation du formulaire et vérification des identifiants
     * @param  \Illuminate\Http\Request  $request
     */
    public function store(Request $request)
    {
        $request->validate([
           'email' => 'required|email|exists:users,email',
           'password' => 'required|string'
        ],
[],
        [
            'email' => 'courriel',
            'password' => 'mot de passe'
        ]);

        $usager = User::where('email', $request->email)->first(); 
         if(!$usager || !Hash::check($request->password, $usager->password)){
            return response()->json(['message' => 'Identifiants invalides'], 404);
        }
        // Création du token Sanctum pour connecter avec React
        $token = $usager->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'message' => 'Vous êtes maintenant connecté!',
            'user'=> $usager,
            'token' => $token
        ]);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
