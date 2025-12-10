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
        $identite = $request->get('identite');
        $pays = $request->get('pays');
        $ordre = $request->get('ordre');
        $limit = $request->get('limit', 12);
        $recherche = $request->get('q'); 

        $query = Produit::query();

        if ($recherche) {
            $query->where(function ($q) use ($recherche) {
                $q->where('name', 'like', "%{$recherche}%");
            });
        }

        if ($identite) {
            $query->where('identite_produit', $identite);
        }
        if ($pays) {
            $query->where('pays_origine', $pays); 
        }

        $query = $this->ordonnerCatalogue($query, $ordre);

        try {
            $vins = $query->paginate($limit); // Pagination laravel

            // Retour JSON pour React
            return response()->json([
                'data' => $vins->items(), 
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


    public function deplacer(Request $request, $id) {
        $request->validate([
            'nouveau_cellier_id' => 'required|exists:celliers,id',
        ]);

        $produit = Produit::findOrFail($id);

        // Mise à jour du cellier
        $produit->cellier_id = $request->nouveau_cellier_id;
        $produit->save();

        return response()->json([
            'message' => 'Bouteille déplacée avec succès.',
            'produit' => $produit
        ]);
    }

    
    /**
     * @param
     * @return array string. la liste des couleurs disponibles pour le filtre
     */
    public function getCouleurs()
    {
        try {
            // On prend toutes les couleurs distinctes depuis la table produits
            $couleurs = Produit::select('identite_produit')
                ->distinct()
                ->pluck('identite_produit');
                return response()->json($couleurs);
        } catch (\Exception $erreur) {
            return response()->json(['erreur' => $erreur->getMessage()], 500);
        }
    }

    /**
     * @param string, la couleur que lon veut afficher
     * @return array d'object, les vins paginés qui seront affichés
     */
    public function getProduitsParCouleur(Request $request, $identite_produit)
    {
        try {
            $limit = $request->get('limit', 12);
            $ordre = $request->get('ordre'); 
            
            $query = Produit::where('identite_produit', $identite_produit);
            
            $query = $this->ordonnerCatalogue($query, $ordre);
            
            $produits = $query->paginate($limit); 

            // Return
            return response()->json([
                'data' => $produits->items(), 
                'current_page' => $produits->currentPage(),
                'last_page' => $produits->lastPage(),
                'per_page' => $produits->perPage(),
                'total' => $produits->total(),
            ]);
        } catch (\Exception $erreur) {
            return response()->json(['erreur' => $erreur->getMessage()], 500);
        }
    }

    public function getPays()
    {
        try {
            $pays = Produit::select('pays_origine')
                ->distinct()
                ->pluck('pays_origine');

            return response()->json($pays);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function getProduitsParPays(Request $request, $pays)
    {
        try {
            $limit = $request->get('limit', 12);
            $ordre = $request->get('ordre'); 
            
            $query = Produit::where('pays_origine', $pays);
            
            $query = $this->ordonnerCatalogue($query, $ordre);
            
            $produits = $query->paginate($limit);

            return response()->json([
                'data' => $produits->items(), 
                'current_page' => $produits->currentPage(),
                'last_page' => $produits->lastPage(),
                'per_page' => $produits->perPage(),
                'total' => $produits->total(),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Cette fonction ordonne le catalogue filtré. Cela devait être server-side
     */
    private function ordonnerCatalogue($query, $ordre)
    {
        switch ($ordre) {
            case 'Millésime (Croissant)':
                $query->orderBy('millesime_produit', 'asc');
                break;
            case 'Millésime (Décroissant)':
                $query->orderBy('millesime_produit', 'desc');
                break;
            case 'Prix (Croissant)':
                $query->orderBy('price', 'asc');
                break;
            case 'Prix (Décroissant)':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->orderBy('id', 'desc'); 
                break;
        }
        return $query;
    }

}