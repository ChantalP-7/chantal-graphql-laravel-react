<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\produitController;
use App\Http\Controllers\CellierController;


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

Route::get('/produits', [produitController::class, 'index']);
Route::get('/produits/{id}', [produitController::class, 'show']);

/*Route::middleware('auth:sanctum')->group(function () {
    Route::get('/celliers', [CellierController::class, 'index']);
});*/

Route::get('/users/{userId}/celliers', [CellierController::class, 'index']);
Route::get('/celliers/{cellierId}/produits', [CellierController::class, 'afficherProduit']);
Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'modifierQuantite']);
Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);

Route::get('/celliers/{id}', [CellierController::class, 'afficherProduit']);
Route::get('/identite_produit', [ProduitController::class, 'getCouleurs']);
Route::get('/produits/couleur/{identite_produit}', [ProduitController::class, 'getProduitsParCouleur']);
