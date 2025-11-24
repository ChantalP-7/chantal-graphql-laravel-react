<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Produit;

class ProduitController extends Controller
{
  
        /**
         * @param
         * Fonction qui affiche toutes les bouteilles du catalogue, si la bouteille a une couleur, on l'affiche. On ajoute une pagination de 12 bouteilles par page, on peut avancer, reculer, aller à la fin ou au début de la pagination.
         */

        public function index(Request $request) {
        $couleur = $request->get('couleur');

        $query = Produit::query();

        if ($couleur) {
            $query->where('couleur', 'like', "%{$couleur}%");
        }

        try {

        $vins = $query->paginate(12); // Laravel pagination

        // Retour JSON pour React
        return response()->json([
            'data' => $vins->items(), // produits actuels
            'current_page' => $vins->currentPage(),
            'last_page' => $vins->lastPage(),
            'per_page' => $vins->perPage(),
            'total' => $vins->total(),
        ]);
        } catch (\Exception $erreur) {
            return response()->json(['erreur' => $erreur->getMessage()], 500);
        }
    }

    
    /**
     * @param
     * Fonction qui affiche les détails d'une bouteille par son id
     */
    public function show($id)
    {
        $produit = Produit::find($id);
        if (!$produit) {
            return response()->json(['error' => 'Produit non trouvé'], 404);
        }
        return response()->json($produit);
    }

    
    /**
     * @param
     * @return array string. la liste des couleurs disponibles pour le filtre
     */
    public function getCouleurs()
    {
        try {
            // On prend toutes les couleurs distinctes depuis la table produits
            $couleurs = Produit::select('couleur')
                ->distinct()
                ->pluck('couleur');

            return response()->json($couleurs);
        } catch (\Exception $erreur) {
            return response()->json(['erreur' => $erreur->getMessage()], 500);
        }
    }

        /**
     * @param string, la couleur que l'on veut afficher
     * @return array d'object, de tout les vins qui seront affichés
     */
    public function getProduitsParCouleur($couleur)
    {
        try {
            $produits = Produit::where('couleur', $couleur)->get();
            return response()->json($produits);
        } catch (\Exception $erreur) {
            return response()->json(['erreur' => $erreur->getMessage()], 500);
        }
    }

}