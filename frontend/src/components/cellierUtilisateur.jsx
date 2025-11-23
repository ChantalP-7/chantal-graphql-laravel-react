import { useEffect, useState } from "react";
import axios from "axios";
import { IoClose } from "react-icons/io5";


/**
 * Fonction qui affiche le cellier de l'utilisateur connecté
 * @param {*} userId 
 * @returns Retourne le cellier de l'utilisateur connecté
 */
export default function AfficheCellier({ userId }) {

    const [celliers, setCelliers] = useState([]);
    const [cellierOuvertId, setCellierOuvertId] = useState(null);

    useEffect(() => {
        axios
        .get(`http://127.0.0.1:8000/api/users/${userId}/celliers`)
        .then(res => setCelliers(Array.isArray(res.data) ? res.data : []))
        .catch(err => {
            console.error(err);
            setCelliers([]);
        });
    }, [userId]); 

    /**
     * Fonction qui supprime un ou plusieurs vins dans le cellier. À chaque suppression, la quantité dans la colonne "quantite" de la table pivot (produit_cellier) décrémente.Une alerte est déclenchée à chaque suppression.
     * @param {*} cellierId 
     * @param {*} produitId 
     * @param {*} quantiteActuelle 
    */
    const gestionSupprimer = async (cellierId, produitId, quantiteActuelle) => {

        const nouvelleQuantite = quantiteActuelle - 1;

        try {
        // Mise à jour côté serveur
        await axios.put(
            `http://127.0.0.1:8000/api/celliers/${cellierId}/produits/${produitId}`,
            { quantite: nouvelleQuantite }
        );

        // Mise à jour côté frontend
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
      <div className="block p-4">
        <h1 className="text-2xl font-bold mt-8 mb-8">Mes Celliers 🍇</h1>
      
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2">
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
                      className="w-full text-left p-3 bouton-rosee flex justify-between rounded-lg hover-text-white cursor-pointer"
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
                                onClick={() => gestionSupprimer(cellier.id, p.id, p.pivot.quantite)}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="p-2 text-gray-500">Aucun produit dans ce cellier.</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun cellier trouvé.</p>
            )}
          </div>

          {/* Colonne droite : autre contenu */}
          <div className="w-full lg:w-1/2 p-4 rounded bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Formulaires et autres...</h2>
            <p>À venir ...</p>
          </div>
        </div>
      </div>
  );
}