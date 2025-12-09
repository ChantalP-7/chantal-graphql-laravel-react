<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;
    protected $fillable = ['sku', 'name', 'description', 'categorie', 'price', 'image', 'millesime_produit', 'pays_origine', 'couleur', 'identite_produit'];

    public function celliers()
    {
        return $this->belongsToMany(
            Cellier::class,
            'cellier_produit',
            'cellier_id',
            'produit_id'
        )
            ->withPivot('quantite')
            ->withTimestamps();
    }

    public function listeAchats()
    {
        return $this->belongsToMany(
            ListeAchat::class,
            'liste_achats',
            'produit_id',
            'user_id'
        )
            ->withPivot('quantite')
            ->withTimestamps();
    }
}
