<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

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
            'email' => 'email',
            'password' => 'password'
        ]);

        $usager = User::where('email', $request->email)->first(); 
         if(!$usager || !Hash::check($request->password, $usager->password)){
            return response()->json(['message' => 'Identifiants invalides'], 404);
        }
        // Création du token Sanctum pour connecter avec React
        $token = $usager->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'message' => 'Vous êtes maintenant connecté!',
            'user' => [
                'id' => $usager->id,
                'name' => $usager->name,
                'email' => $usager->email,
            ],
            'token' => $token
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Fonction pour se déconnecté
     */
    public function destroy( Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Vous êtes déconnecté!'
        ]);
    }
}
