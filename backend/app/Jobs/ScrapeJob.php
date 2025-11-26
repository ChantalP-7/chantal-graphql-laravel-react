<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Produit;
use App\Http\Controllers\ScraperController;
use Illuminate\Support\Facades\Log;

class ScrapeJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 0; // pas de limite de temps

    public function handle()
    {
        ini_set('max_execution_time', 0);

        $scraper = new ScraperController();

        $categories = [
            10000 => "vin",
            13000 => "champagne",
            12000 => "mousseux",
        ];

        $taillePage = 100;

        foreach ($categories as $facetId => $label) {
            $page = 1;
            $items = [];

            do {
                $res = $scraper->extrairePage($taillePage, $page, $facetId);
                $items = $res['items'] ?? [];

                $batch = [];

                foreach ($items as $item) {
                    $produit = $item['product'] ?? null;
                    if (!$produit) continue;

                    $image = $produit['image']['url'] ?? $produit['small_image']['url'] ?? $produit['thumbnail']['url'] ?? null;
                    $price = $produit['price_range']['minimum_price']['final_price']['value'] ?? null;

                    $attr1 = collect($produit['custom_attributes'] ?? [])->pluck('value', 'code');
                    $attr2 = collect($item['productView']['attributes'] ?? [])
                        ->groupBy('name')
                        ->map(fn($group) => $group->pluck('value')->implode(' | '));
                    $allAttr = $attr1->merge($attr2);

                    $valeursAutorisees = ['vin','champagne','mousseux','vin dessert','vin de glace'];
                    $identite = strtolower($attr1['identite_produit'] ?? $attr2['identite_produit'] ?? '');
                    $autorise = false;
                    foreach ($valeursAutorisees as $v) {
                        if (str_contains($identite, strtolower($v))) {
                            $autorise = true;
                            break;
                        }
                    }
                    if (!$autorise) continue;

                    $batch[] = [
                        'sku' => $produit['sku'],
                        'name' => $produit['name'],
                        'image' => $image,
                        'price' => $price,
                        'pays_origine' => $allAttr['pays_origine'] ?? null,
                        'couleur' => $allAttr['couleur'] ?? null,
                        'millesime_produit' => $allAttr['millesime_produit'] ?? null,
                        'identite_produit' => $attr1['identite_produit'] ?? $attr2['identite_produit'] ?? null,
                        'categorie' => $label
                    ];
                }

                if (!empty($batch)) {
                    Produit::upsert(
                        $batch,
                        ['sku'],
                        ['name','image','price','pays_origine','couleur','millesime_produit','identite_produit','categorie']
                    );
                }

                unset($res, $batch);
                gc_collect_cycles();

                $page++;
                usleep(200000); // pause 0.2s

            } while (count($items) === $taillePage);
        }

        Log::info("Scraping terminé avec succès !");
    }
}