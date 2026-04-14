<?php

namespace App\Services;

use App\Models\Cellier;
use App\Models\Produit;

class DemoRulesService
{
    public static function canCreateCellier($user)
    {
        if (!$user->is_demo) return true;

        return Cellier::where('user_id', $user->id)->count() <= 10;
    }

    public static function canAddBouteille($cellier)
    {
        return Produit::where('cellier_id', $cellier->id)->count() <= 20;
    }

    public static function canAddQuantity($quantity, $user)
    {
        if (!$user->is_demo) return true;

        return $quantity <= 20;
    }
}