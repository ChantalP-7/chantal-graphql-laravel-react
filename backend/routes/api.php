<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CellierController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ListeAchatController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/



// Routes des usagers
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy']);
});
Route::post('/inscription', [UserController::class, 'store']);

// Routes d'authentification
Route::post('/connexion', [AuthController::class, 'store']);
Route::middleware('auth:sanctum')->post('/deconnexion', [AuthController::class, 'destroy']);

// Routes des celliers
Route::middleware('auth:sanctum')->group(function () {
    // Routes des produits (vins)
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/produits/{id}', [ProduitController::class, 'show']);
    Route::put('/produit/{id}/deplacer', [ProduitController::class, 'deplacer']);

    // Routes des filtres
    Route::get('/identite_produit', [ProduitController::class, 'getCouleurs']);
    Route::get('/pays_origine', [ProduitController::class, 'getPays']);

    // Routes pour les celliers
    Route::get('/celliers', [CellierController::class, 'index']);
    Route::get('/celliers/{id}', [CellierController::class, 'afficherProduit']);
    Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
    Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'modifierQuantite']);
    Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);
    Route::post('/celliers', [CellierController::class, 'creerCellier']);
    Route::put('/celliers/{id}', [CellierController::class, 'modifieNomCellier']);
    Route::delete('/celliers/{cellierId}', [CellierController::class, 'supprimerCellier']);


    // Routes pour la liste d'achat
    Route::get('/liste-achats', [ListeAchatController::class, 'index']);
    Route::post('/liste-achats/{produit}', [ListeAchatController::class, 'store']);
    Route::put('/liste-achats/{id}', [ListeAchatController::class, 'update']);
    Route::delete('/liste-achats/{id}', [ListeAchatController::class, 'destroy']);
});

// Routes des filtres
Route::get('/identite_produit', [ProduitController::class, 'getCouleurs']);
Route::get('/pays_origine', [ProduitController::class, 'getPays']);

// Routes  mot de passe oublié
Route::post('/mdp-oublie', [UserController::class, 'email']);
Route::post('/mdp-reinitialise', [UserController::class, 'resetUpdate']);

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

Route::get('/test', function () {
    return response()->json(['message' => 'Backend fonctionne !']);
});
