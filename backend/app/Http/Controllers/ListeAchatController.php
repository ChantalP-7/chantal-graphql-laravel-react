<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ListeAchat;

class ListeAchatController extends Controller
{
    // Afficher la liste d'achat de l'usager
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'Non authentifié'], 401);
        }

        $items = ListeAchat::where('user_id', $user->id)
            ->with('produit')
            ->get();

        return response()->json($items);
    }

    // Ajouter un produit à la liste d'achat

    public function store(Request $request, $produitId)
    {
        $user = $request->user();

        // Vérifier si l’entrée existe déjà
        $item = ListeAchat::where('user_id', $user->id)
            ->where('produit_id', $produitId)
            ->first();

        if ($item) {
            // si déjà dans la liste → on augmente la quantité
            $item->quantite += 1;
            $item->save();
        } else {
            // sinon on crée une nouvelle ligne
            $item = ListeAchat::create([
                'user_id' => $user->id,
                'produit_id' => $produitId,
                'quantite' => 1,
            ]);
        }

        return response()->json([
            'message' => 'Produit ajouté à la liste d\'achats',
            'item' => $item
        ]);
    }

    // Modifier quantité
    public function update(Request $request, $id)
    {
        $request->validate(['quantite' => 'required|integer|min:1']);

        $user = $request->user();

        $item = ListeAchat::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $item->update([
            'quantite' => $request->quantite,
        ]);

        return response()->json([
            'message' => 'Quantité mise à jour.',
            'item'    => $item->load('produit'),
        ]);
    }

    // Retirer un item
    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $item = ListeAchat::where('user_id', $user->id)
            ->where('id', $id)
            ->firstOrFail();

        $item->delete();

        return response()->json([
            'message' => 'Produit retiré de votre liste d’achat.',
        ]);
    }
}
