<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Produit;
use Illuminate\Support\Facades\Log;

class ScraperController extends Controller
{
    protected $endpoint;
    protected $headers;

    public function __construct()
    {
        $this->endpoint = config('services.saq.graphql_url');
        $this->headers = [
            'x-api-key' => config('services.saq.api_key'),
            'Magento-Environment-Id' => config('services.saq.env_id'),
            'magento-store-code' => config('services.saq.store_code'),
            'magento-store-view-code' => config('services.saq.store_view'),
            'magento-website-code' => config('services.saq.website_code'),
            'Content-Type' => 'application/json',
            'User-Agent' => 'Laravel-Scraper/1.0',
        ];
    }

    public function scrapePage($taillePage = 12, $pageCourante = 1)
    {
        $query = <<<'GRAPHQL'
query ($pageSize: Int, $currentPage: Int) {
  products(
    search: "",
    filter: {
      couleur: { neq: "" }
    }
    pageSize: $pageSize,
    currentPage: $currentPage
  ) {
    total_count
    items {
      sku
      name
      image { url }
      small_image { url }
      thumbnail { url }
      price_range {
        minimum_price {
          final_price { value }
        }
      }
      custom_attributes {
        code
        value
      }
    }
  }
}
GRAPHQL;

        $response = Http::withHeaders($this->headers)
            ->post($this->endpoint, [
                'query' => $query,
                "variables" => [
                    "pageSize" => $taillePage,
                    "currentPage" => $pageCourante
                ]
            ]);

        return $response->json();
    }



    // GraphQL query
    public function productSearchQuery()
    {
        return <<<'GRAPHQL'
query productSearch($phrase: String!, $pageSize: Int, $currentPage: Int, $filter: [SearchClauseInput!]) {
    productSearch(phrase: $phrase, page_size: $pageSize, current_page: $currentPage, filter: $filter) {
        total_count
        items {
            product {
                sku
                name
                image { url }
                small_image { url }
                thumbnail { url }
                price_range {
                    minimum_price {
                        final_price { value currency }
                    }
                }
                custom_attributes {
                    code
                    value
                }
            }
            productView {
                attributes {
                    name
                    value
                    label
                }
            }
        }
    }
}
GRAPHQL;
    }

    // Scraper d'une page
    public function extrairePage(int $taillePage, int $pageCourante, int $facetId)
    {
        $variables = [
            'phrase' => '',
            'pageSize' => $taillePage,
            'currentPage' => $pageCourante,
            'filters' => [
            "product_filter" => ["eq" => $facetId],  // Vin / Champagne / Mousseux
            "visibility" => ["in" => ["2", "4"]]    ]
        ];

        $attempts = 0;
        do {
            $attempts++;
            $response = Http::withHeaders($this->headers)
                ->timeout(20)
                ->withOptions(['verify' => false])
                ->post($this->endpoint, [
                    'query' => $this->productSearchQuery(),
                    'variables' => $variables
                ]);

            if ($response->status() == 429) {
                $wait = $response->header('Retry-After', 2);
                Log::info("Throttling détecté, attente de {$wait}s");
                sleep(max(1, (int)$wait));
            } else {
                break;
            }
        } while ($attempts < 5);

        if (!$response->successful()) {
            Log::error('Erreur API GraphQL', ['status' => $response->status(), 'body' => $response->body()]);
            return ['items' => [], 'total_count' => 0];
        }

        return $response->json('data.productSearch', ['items' => [], 'total_count' => 0]);
    }

    // Scraper complet vins, champagnes et mousseux
    public function scrapeAll()
    {
        $taillePage = 1000; // max SAQ
        $categories = [
            'produits/vin%',
            'produits/champagne%',
            'produits/mousseux%'
        ];

        foreach ($categories as $cat) {
            $page = 1;
            do {
                $filtres = [
                    ['attribute' => 'categoryPath', 'like' => $cat],
                    ['attribute' => 'availability_front', 'in' => ['En ligne', 'En succursale']],
                    ['attribute' => 'visibility', 'in' => ['Catalog', 'Catalog, Search']]
                ];

                $res = $this->extrairePage($taillePage, $page, $filtres);
                $items = $res['items'] ?? [];
                $total = $res['total_count'] ?? 0;

                foreach ($items as $item) {
                    $produit = $item['product'] ?? null;
                    if (!$produit) continue;

                    $image = $produit['image']['url'] ?? $produit['small_image']['url'] ?? $produit['thumbnail']['url'] ?? null;
                    $price = $produit['price_range']['minimum_price']['final_price']['value'] ?? null;

                    // Fusion custom_attributes + productView.attributes
                    $attr1 = collect($produit['custom_attributes'] ?? [])->pluck('value', 'code');
                    $attr2 = collect($item['productView']['attributes'] ?? [])->pluck('value', 'name');
                    $allAttr = $attr1->merge($attr2);

                    Produit::updateOrCreate(
                        ['sku' => $produit['sku']],
                        [
                            'name' => $produit['name'],
                            'image' => $image,
                            'price' => $price,
                            'pays_origine' => $allAttr['pays_origine'] ?? null,
                            'couleur' => $allAttr['couleur'] ?? null,
                            'identite_produit' => $allAttr['identite_produit'] ?? null,
                            'millesime_produit' => $allAttr['millesime_produit'] ?? null,
                            'category' => $cat
                        ]
                    );
                }
                Log::info("Page {$page} terminée pour la catégorie {$cat}, produits récupérés : " . count($items));
                $page++;
            } while (count($items) === $taillePage);
        }
        return response()->json(['message' => 'Scraping complet terminé']);
    }
}
