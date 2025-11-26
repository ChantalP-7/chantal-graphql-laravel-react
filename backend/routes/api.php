<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\produitController;
use App\Http\Controllers\CellierController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


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



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Routes des usagers
Route::post('/inscription', [UserController::class, 'store']);

// Routes des produits (vins)

Route::get('/produits', [produitController::class, 'index']);
Route::get('/produits/{id}', [produitController::class, 'show']);

// Routes d'authentification
Route::post('/connexion', [AuthController::class, 'store']);
Route::middleware('auth:sanctum')->post('/deconnexion', [AuthController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/celliers', [CellierController::class, 'index']);
    Route::get('/celliers/{id}', [CellierController::class, 'afficherProduit']);
    Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
    Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'modifierQuantite']);
    Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);
    Route::post('/celliers', [CellierController::class, 'creerCellier']);
});

/* À Hannah */
Route::get('/identite_produit', [ProduitController::class, 'getCouleurs']);
Route::get('/produits/couleur/{identite_produit}', [ProduitController::class, 'getProduitsParCouleur']);
/* Plus à Hannah */

// routes/web.php, toujours mettre à la fin pour empêcher de rediriger vers React
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
