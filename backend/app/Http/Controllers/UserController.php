<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
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
     * Validation du formulaire de création avant insertion de l'usager
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:4|max:30',
            'email' => 'required|email|unique:users',
            'password' => [
                'required','string','confirmed', 'max:20',
                Password::min(6)->letters()->mixedCase()->numbers()->symbols()
            ]
        ],
[],
        [
            'name' => 'nom',
            'email' => 'courriel',
            'password' => 'mot de passe'
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'message'=> 'Votre inscription a été créé avec succès! Veuillez vous connecter.!'
        ]);

    }


    /**
     * Update the specified resource in storage.
     * @param  \Illuminate\Http\Request  $request
     * Mettre à jour les infos de l'usager
     */
    public function update(Request $request)
    {
        $usager = $request->user();

        $request->validate([
            'name' => 'required|min:4|max:30',
            'current_password' => ['required_with:new_password', 'string'],
            'new_password' => [
                'nullable','string','confirmed', 'max:20',
                Password::min(6)->letters()->mixedCase()->numbers()->symbols()
            ]
           ],
[],
        [
            'name' => 'nom',
            'current_password' => 'mot de passe actuel',
            'new_password' => 'nouveau mot de passe',
        ]);

         // mis à jour du nom
        $usager->name = $request->name;

        // mis à jour le mot de passe si demandé
        if($request->filled('new_password')) {

            if (!$request->filled('current_password')) {
                return response()->json([
                    'message' => 'Mot de passe actuel requis.'
                ],422);
            }

            if(!Hash::check($request->current_password, $usager->password)) {
                return response()->json([
                    'message' => 'Mot de passe actuel incorrect'
                ], 422);
            }

            $usager->password = hash::make($request->new_password);
        }

        $usager->save();

        return response()->json([
            'message' => 'Profil mis à jour!',
            'user' => $usager
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Suppression du compte par l'usager
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        $user->tokens()->delete(); // supprimer les tokens 
        $user->delete();           // supprimer l'usager 
        
        return response()->json([
            'message' => 'Votre compte a été supprimé avec succès!'
        ]);
    }
}
