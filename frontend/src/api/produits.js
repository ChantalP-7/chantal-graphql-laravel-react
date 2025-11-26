import api from "./axios";

export function getproduits(page, limit, filtre) {
  if (filtre) {
    // produits/couleur/{identite_produit}
    return api.get(`/produits/couleur/${filtre}`);
  } else {
    return api.get("/produits", {
      params: {
        page,
        limit,
      },
    });
  }
}

export function getproduit(id) {
  return api.get(`/produits/${id}`);
}
