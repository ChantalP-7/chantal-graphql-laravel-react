<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Cellier;

class CellierController extends Controller
{
    /*public function index($userId)
    {
        $celliers = Cellier::where('user_id', $userId)->get();
        return response()->json($celliers);
    }*/

    public function produits($cellierId)
    {
        $cellier = Cellier::with('produits')->findOrFail($cellierId);
        return response()->json($cellier->produits);
    }

    public function index(Request $request) {
        // Récupère l'utilisateur connecté via le token Bearer
        $user = $request->user();

        // Sécurité : si token invalide ou absent
        if (!$user) {
            return response()->json(['message' => 'Utilisateur non authentifié'], 401);
        }
        // Récupère tous les celliers avec les bouteilles
        $celliers = $user->celliers()->with('produits')->get();

        return response()->json($celliers);
    }

    public function creerCellier(Request $request)
    {
        // Valider les données envoyées par React
        $validated = $request->validate([
            'nom' => 'required|string|max:100',
        ]);

        // Créer le cellier pour l'utilisateur connecté via Sanctum token
        $cellier = $request->user()->celliers()->create([
            'nom' => $validated['nom'],
        ]);

        return response()->json([
            'message' => 'Cellier créé avec succès.',
            'cellier' => $cellier
        ], 201);
    }


    public function afficherProduit($cellierId)
    {
        $cellier = Cellier::with('produits')->findOrFail($cellierId);
        return response()->json($cellier);
    }


    public function ajouterProduit(Request $request, $cellierId)
    {
        $cellier = Cellier::findOrFail($cellierId);
        $produitId = $request->input('produit_id');
        $quantite = $request->input('quantite', 1);

        $item = $cellier->produits()->where('produit_id', $produitId)->first();

        if ($item) {
            $cellier->produits()->updateExistingPivot($produitId, [
                'quantite' => $item->pivot->quantite + $quantite
            ]);
        } else {
            $cellier->produits()->attach($produitId, ['quantite' => $quantite]);
        }

        return response()->json($cellier->produits()->where('produit_id', $produitId)->first());
    }


    public function modifieNomCellier(Request $request, $id) {
        $request->validate([
            'nom' => 'required|string|max:255'
        ]);

        $cellier = Cellier::findOrFail($id);
        $cellier->nom = $request->nom;
        $cellier->save();

        return response()->json([
            'message' => 'Nom du cellier modifié avec succès.',
            'cellier' => $cellier
        ]);
    }


    public function modifierQuantite(Request $request, $cellierId, $produitId)
    {
        $quantite = $request->input('quantite', 1);
        $cellier = Cellier::findOrFail($cellierId);

        $cellier->produits()->updateExistingPivot($produitId, ['quantite' => $quantite]);

        return response()->json(['message' => 'Quantité mise à jour']);
    }


    public function supprimerProduit($cellierId, $produitId)
    {
        $cellier = Cellier::findOrFail($cellierId);
        $item = $cellier->produits()->where('produit_id', $produitId)->first();

        if (!$item) return response()->json(null, 404);

        if ($item->pivot->quantite <= 1) {
            $cellier->produits()->detach($produitId);
            return response()->json(null);
        } else {
            $cellier->produits()->updateExistingPivot($produitId, [
                'quantite' => $item->pivot->quantite - 1
            ]);
            return response()->json($cellier->produits()->where('produit_id', $produitId)->first());
        }
    }

   
    public function supprimerCellier($cellierId) {

        $cellier = Cellier::with('produits')->find($cellierId);

        if (!$cellier) {
            return response()->json(['message' => 'Cellier introuvable'], 404);
        }

        // Vérifier s’il y a des bouteilles
        $nbBouteilles = $cellier->produits->sum(function ($produit) {
            return $produit->pivot->quantite ?? 0;
        });

        if ($nbBouteilles > 0) {
            return response()->json([
                'message' => 'Impossible de supprimer ce cellier : il contient encore des bouteilles.'
            ], 422);
        }
       
        $cellier->delete();

        return response()->json(['message' => 'Cellier supprimé avec succès'], 200);
    }

}
