import { useEffect, useState } from "react";
import api from "../api/axios";

const ListeAchats = () => {
    const [items, setItems] = useState([]);
    const [chargement, setChargement] = useState(true);
    const [erreur, setErreur] = useState("");

  const chargerListe = async () => {
    try {
        const res = await api.get("/liste-achats");
        setItems(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
        console.error(error);
        setErreur("Impossible de charger votre liste d’achat.");
        } finally {
        setChargement(false);
        }
    };

    useEffect(() => {
        chargerListe();
    }, []);

  const changerQuantite = async (itemId, nouvelleQuantite) => {
    if (nouvelleQuantite < 1) return;

    try {
        const res = await api.put(`/liste-achats/${itemId}`, {
            quantite: nouvelleQuantite,
        });

        setItems((prev) =>
            prev.map((it) =>
            it.id === itemId ? { ...it, quantite: res.data.item.quantite } : it
            )
        );
        } catch (error) {
        console.error(error);
        alert("Erreur lors de la mise à jour de la quantité.");
    }
  };

  const supprimerItem = async (itemId) => {
        if (!window.confirm("Retirer ce produit de la liste ?")) return;

        try {
        await api.delete(`/liste-achats/${itemId}`);
        setItems((prev) => prev.filter((it) => it.id !== itemId));
        } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression.");
        }
  };

  if (chargement)
    return (
        <div className="points">
            <span></span><span></span><span></span>
        </div>
    );

  return (
    <section className="mt-20 px-4">
        <h1 className="text-3xl font-bold mb-6">Ma liste d’achat</h1>

        {erreur && <p className="text-red-600 mb-4">{erreur}</p>}

        {items.length === 0 ? (
            <p>Votre liste d’achat est vide.</p>
        ) : (
            <div className="space-y-4">
            {items.map((item) => (
                <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-white shadow-sm"
                >
                {/* IMAGE MINI BOUTEILLE */}
                <img
                    src={
                    item.produit?.image ||
                    "https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png"
                    }
                    alt={item.produit?.name || "Bouteille de vin"}
                    className="w-14 h-24 object-contain mr-4"
                />

                {/* INFOS PRODUIT */}
                <div className="flex-1">
                    <p className="font-semibold">
                    {item.produit?.name} {item.produit?.millesime_produit}
                    </p>
                    <p className="text-sm text-gray-600">
                    {item.produit?.identite_produit} - {item.produit?.pays_origine}
                    </p>
                    <p className="font-bold">
                    {item.produit?.price
                        ? Number(item.produit.price).toFixed(2) + " $"
                        : ""}
                    </p>
                </div>

                {/* CONTROLES QUANTITÉ + SUPPRESSION */}
                <div className="flex items-center gap-3">
                    <button
                    className="px-2 py-1 rounded bg-gray-200"
                    onClick={() => changerQuantite(item.id, item.quantite - 1)}
                    >
                    -
                    </button>
                    <span className="w-8 text-center">{item.quantite}</span>
                    <button
                    className="px-2 py-1 rounded bg-gray-200"
                    onClick={() => changerQuantite(item.id, item.quantite + 1)}
                    >
                    +
                    </button>

                    <button
                    className="ml-4 px-3 py-1 text-sm rounded bg-red-950 text-white hover:bg-pink-800 transition"
                    onClick={() => supprimerItem(item.id)}
                    >
                    Supprimer
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
    </section>
  );
};

export default ListeAchats;
