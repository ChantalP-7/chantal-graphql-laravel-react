<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
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
            // Traduction de l'anglais au français
        [
            'name' => 'nom',
            'email' => 'courriel',
            'password' => 'mot de passe'
        ]);

        // Création de l'usager
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        // Retourne un message de succès
        return response()->json([
            'message'=> 'Votre inscription a été créé avec succès! Veuillez vous connecter.!'
        ]);

    }


    /**
     * Update the specified resource in storage.
     * @param  \Illuminate\Http\Request  $request
     * Mettre à jour les infos de l'usager avec validation d'erreurs
     */
    public function update(Request $request)
    {
        $usager = $request->user();

        $request->validate([
            'name' => 'required|min:4|max:30',
            'current_password' => ['required_with:new_password', 'nullable', 'string'],
            'new_password' => [
                'nullable','string','confirmed', 'max:20',
                Password::min(6)->letters()->mixedCase()->numbers()->symbols()
            ]
        ],
[],
        // Traduction de l'anglais au français
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
            // Si pas le bon mot de passe actuel
            if(!Hash::check($request->current_password, $usager->password)) {
                return response()->json([
                    'message' => 'Mot de passe actuel incorrect'
                ], 422);
            }
            // Nouveau mot de passe encrypté
            $usager->password = hash::make($request->new_password);
        }
        // Enregistrer les changements
        $usager->save();

        // Retourne les infos de l'usager et message de succès
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
    /**
     * Summary of email
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * Fonction pour mot de passe oublié requiert le courriel
     */
    public function email(Request $request) {
        $request ->validate([
            'email' => 'required|email|exists:users,email'
        ],
[],
        [
           'email' => 'courriel' 
        ]);

        $usager = User::where('email', $request->email)->first();
        $mdpTemporaire = Str::random(45);// mot de passe temporaire

        // Stocker le mot de passe temporaire 
        $usager->temp_password = $mdpTemporaire;
        $usager->temp_password_created_at = now();
        $usager->save();

        // URL qui renvoie vers React
        $frontend = env('APP_URL');
        $tokenUrl = urlencode($mdpTemporaire);// Encoder le mot de passe temporaire
        $reinitialiserUrl = "$frontend/mdp-reinitialise?token=$tokenUrl&user=$usager->id";

        // Envoie de l'e-mail
        Mail::html("
            <p>Bonjour {$usager->name},</p>
            <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
            <p><a href='{$reinitialiserUrl}'>Réinitialiser mon mot de passe</a></p>
        ", function($message) use ($usager) {
            $message->to($usager->email)->subject('Réinitialisation du mot de passe');
        });

        // Retour avec message de succès
        return response()->json([
            'message' => 'Lien de réinitialisation envoyé! Veuillez vérifier votre courriel. ', 
        ]);
    }

    /**
     * Summary of resetUpdate
     * @param Request $request
     * Fonction de la mis à jour suite à la réinitilisation du mot de passe
     */
    public function resetUpdate( Request $request){
        $request->validate([
            'user' => 'required|integer',
            'token' => 'required',
            'password' => [
                'required','string', 'confirmed', 'max:20',
                Password::min(6)->letters()->mixedCase()->numbers()->symbols()
            ]
        ],
[],
        [
          'user'=> 'usager',
          'password' => 'mot de passe',  
        ]);
        // Trouver le id de l'usager correspondant
        $usager = User::find($request->user);

        // Vérifier le token si correspond au mot de passe temporaire
        if (!$usager || $request->token !== $usager->temp_password) {
            return response()->json(['erreur' => 'Token invalide'], 400);
        }
        // Lien expiré
        if ($usager->temp_password_created_at->diffInMinutes(now()) > 30) {
            return response()->json(['erreur' => 'Le lien a expiré'], 400);
        }

        // Mettre à jour le mot de passe
        $usager->password = Hash::make($request->password);
        $usager->temp_password = null;
        $usager->temp_password_created_at = null;
        $usager->save();

        // Retourne message de succès
        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès'
        ]);
    
    }
}
