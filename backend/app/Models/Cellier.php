<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cellier extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'nom', 'description'];

    // Relation avec l'utilisateur
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Relation avec les produits via la table pivot
    public function produits()
    {
        return $this->belongsToMany(
            Produit::class,       
            'cellier_produit',    
            'cellier_id',     
            'produit_id'
        )->withPivot('quantite')
         ->withTimestamps();
    }
}