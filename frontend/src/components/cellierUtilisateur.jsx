import { useEffect, useState } from "react";
import api from "../api/axios";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";


export default function AfficheCellier() {

    const [celliers, setCelliers] = useState([]);
    const [cellierOuvertId, setCellierOuvertId] = useState(null);

    useEffect(() => {
        api.get("/celliers")
            .then(res => {
                setCelliers(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("Erreur lors de la récupération des celliers :", err);
                setCelliers([]);
            });
    }, []);

    const gestionSupprimer = async (cellierId, produitId, quantiteActuelle) => {

        const nouvelleQuantite = quantiteActuelle - 1;

        try {
            await api.put(
                `/celliers/${cellierId}/produits/${produitId}`,
                { quantite: nouvelleQuantite }
            );

            setCelliers(prev =>
                prev.map(cellier => {
                    if (cellier.id !== cellierId) return cellier;
                    return {
                        ...cellier,
                        produits: cellier.produits
                        .map(p => {
                            if (p.id !== produitId) return p;
                            return { ...p, pivot: { ...p.pivot, quantite: nouvelleQuantite } };
                        })
                        .filter(p => p.pivot.quantite > 0),
                    };
                })
            );

            alert("Vin supprimé!");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de la mise à jour du vin !");
        }
    };

    return (
      <div className="flex justify-center p-4">
          <div className="w-full lg:w-1/2">
          <h1 className="text-2xl font-bold mt-8 mb-8">Mes Celliers 🍇</h1>

            {Array.isArray(celliers) && celliers.length > 0 ? (
              <ul className="space-y-4">
                {celliers.map(cellier => (
                  <li key={cellier.id}>
                    <button
                      onClick={() =>
                        setCellierOuvertId(
                          cellierOuvertId === cellier.id ? null : cellier.id
                        )
                      }
                      className="w-full text-left p-3 bouton-vin-rosee flex justify-between rounded-lg hover-text-white cursor-pointer"
                    >
                      <span>{cellier.nom}</span>
                      <span>{cellierOuvertId === cellier.id ? "-" : "+"}</span>
                    </button>                  

                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        cellierOuvertId === cellier.id
                          ? "max-h-96 opacity-100 mt-2"
                          : "max-h-0 opacity-0 mt-0"
                      }`}
                    >
                      {Array.isArray(cellier.produits) &&
                      cellier.produits.length > 0 ? (
                        <ul className="list-[circle] p-5 pr-5 space-y-1">
                          {cellier.produits.map(p => (
                            <li
                              className="flex justify-between items-center gap-5"
                              key={p.id}
                            >
                              <span>
                                {p.name} - <strong>Quantité : {p.pivot.quantite}</strong>
                              </span>

                              <IoClose
                                className="w-6 h-6 text-[#96384F] cursor-pointer"
                                onClick={() =>
                                  gestionSupprimer(cellier.id, p.id, p.pivot.quantite)
                                }
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-2 text-gray-500">
                          Aucun produit dans ce cellier.
                        </p>
                      )}
                    </div>

                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun cellier trouvé.</p>
            )}
            <hr className="border border-[1px] border-dotted bouton-vin-rosee mt-10" />
            <div>
            <h1 className="text-2xl font-bold mt-8 mb-8">Nouveau cellier 🍇</h1>
            <Link
                to="/cellier/creer"
                className="mt-20 px-6 py-4 bg-[var(--couleur-text)] bg-hover-[var(--couleur-accent)] text-white text-center rounded-lg"
            >
            Ajouter un cellier
            </Link>
        </div>

          </div>
          
      </div>
    );
}