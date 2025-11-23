<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;
    protected $fillable = ['sku','name', 'price', 'image', 'millesime_produit', 'pays_origine', 'couleur', 'identite_produit'];

    public function celliers() {
        return $this->belongsToMany(Cellier::class, 'cellier_produit', 'cellier_id',
        'produit_id')
                    ->withPivot('quantite')
                    ->withTimestamps();
    }
}
