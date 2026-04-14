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


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// CSRF Sanctum (SPA)
Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['message' => 'CSRF token reçu']);
});

// Inscription
Route::post('/inscription', [UserController::class, 'store']);

// Connexion
Route::post('/connexion', [AuthController::class, 'store']);

//deconnection
Route::middleware('auth:sanctum')->post('/deconnexion', [AuthController::class, 'destroy']);


// Mot de passe oublié
Route::post('/mdp-oublie', [UserController::class, 'email']);
Route::post('/mdp-reinitialise', [UserController::class, 'resetUpdate']);

// Test backend
Route::get('/test', function () {
    return response()->json(['message' => 'Backend fonctionne !']);
});


/*
|--------------------------------------------------------------------------
| ROUTES AUTHENTIFIÉES (USER NORMAL + DÉMO LECTURE)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Routes pour les users
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy']);


    // Route pour les produits
    Route::get('/produits', [ProduitController::class, 'index']);
    Route::get('/produits/{id}', [ProduitController::class, 'show']);
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::put('/produits/{id}', [ProduitController::class, 'update']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);

    Route::put('/produit/{id}/deplacer', [ProduitController::class, 'deplacer']);


    // Routes pour les celliers
    Route::get('/celliers', [CellierController::class, 'index']);
    Route::get('/celliers/{id}', [CellierController::class, 'afficherProduit']);

    Route::post('/celliers', [CellierController::class, 'creerCellier']);
    Route::put('/celliers/{id}', [CellierController::class, 'modifieNomCellier']);
    Route::delete('/celliers/{id}', [CellierController::class, 'supprimerCellier']);

    Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
    Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'miseAJourProduit']);
    Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);


    // Routes la liste d'achats
    Route::get('/liste-achats', [ListeAchatController::class, 'index']);
    Route::post('/liste-achats/{produit}', [ListeAchatController::class, 'store']);
    Route::put('/liste-achats/{id}', [ListeAchatController::class, 'update']);
    Route::delete('/liste-achats/{id}', [ListeAchatController::class, 'destroy']);


    // Filtres
    Route::get('/identite_produit', [ProduitController::class, 'getCouleurs']);
    Route::get('/pays_origine', [ProduitController::class, 'getPays']);
});

/* 
| ---------------------------------------------------------------------------------------
| MODE DÉMO (WRITE BLOQUÉ UNIQUEMENT)
| ---------------------------------------------------------------------------------------
*/ 
Route::middleware(['auth:sanctum', 'demo.block'])->group(function () {

    // USER
    Route::put('/user', [UserController::class, 'update']);
    Route::delete('/user', [UserController::class, 'destroy']);

    // PRODUITS
    Route::post('/produits', [ProduitController::class, 'store']);
    Route::put('/produits/{id}', [ProduitController::class, 'update']);
    Route::delete('/produits/{id}', [ProduitController::class, 'destroy']);

    // CELLIERS
    Route::post('/celliers', [CellierController::class, 'creerCellier']);
    Route::put('/celliers/{id}', [CellierController::class, 'modifieNomCellier']);
    Route::delete('/celliers/{id}', [CellierController::class, 'supprimerCellier']);

    Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
    Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'miseAJourProduit']);
    Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);

    // LISTE ACHATS
    Route::post('/liste-achats/{produit}', [ListeAchatController::class, 'store']);
    Route::put('/liste-achats/{id}', [ListeAchatController::class, 'update']);
    Route::delete('/liste-achats/{id}', [ListeAchatController::class, 'destroy']);
});

/*
| ---------------------------------------------
| FRONTEND SPA (React)
| ---------------------------------------------
*/
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
