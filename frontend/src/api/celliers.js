// api/cellier
import api from "./axios";

export function getCelliers() {
  return api.get("/celliers");
}

export function ajouteAuCellier(produitId) {
  return api.post(`/celliers/${produitId}`);
}

export function supprimeDuCellier(produitId) {
  return api.delete(`/celliers/${produitId}`);
}