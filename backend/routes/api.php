<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\produitController;
use App\Http\Controllers\CellierController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;


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
    Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
    Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'modifierQuantite']);
    Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);
});

//Route::get('/users/{userId}/celliers', [CellierController::class, 'index']);

//Route::middleware('auth:sanctum')->get('/celliers', [CellierController::class, 'index']);

//Route::get('/celliers/{cellierId}/produits', [CellierController::class, 'afficherProduit']);
//Route::post('/celliers/{cellierId}/produits', [CellierController::class, 'ajouterProduit']);
//Route::put('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'modifierQuantite']);
//Route::delete('/celliers/{cellierId}/produits/{produitId}', [CellierController::class, 'supprimerProduit']);

//Route::get('/celliers/{id}', [CellierController::class, 'afficherProduit']);
Route::get('/couleurs', [ProduitController::class, 'getCouleurs']);


// routes/web.php, toujours mettre à la fin pour empêcher de rediriger vers React
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
