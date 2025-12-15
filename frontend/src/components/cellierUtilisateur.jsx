import { useEffect, useState } from "react";
import api from "../api/axios";
import FicheProduitCellier from "./FicheProduitCellier";
import ModalConfirmation from "./ModalConfirmation";
import ModalViderCellier from "./ModalViderCellier";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { GiBarrel } from "react-icons/gi";

const produitsParPageCellier = 6;

const AfficheCellier = () => {
  const [celliers, setCelliers] = useState([]);
  const [cellierOuvertId, setCellierOuvertId] = useState(null);
  const [selection, setSelection] = useState({ cellier: null, produit: null });
  const [pagination, setPagination] = useState({});
  const [afficherFormAjoutCellier, setAfficherFormAjoutCellier] = useState(false);
  const [nomCellier, setNomCellier] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSupprimerViderVisible, setModalSupprimerViderVisible] = useState(false);
  const [cellierSelectionneSupId, setCellierSelectionneSupId] = useState(null);

  const cellierSelectionneSup = celliers.find(
    (c) => c.id === cellierSelectionneSupId
  );

  // Pagination des produits
  const getProduitsPage = (cellier) => {
    const page = pagination[cellier.id] || 0;
    const start = page * produitsParPageCellier;
    const end = start + produitsParPageCellier;
    return cellier.produits.slice(start, end);
  };

  // Fetch celliers
  useEffect(() => {
    api
      .get("/celliers")
      .then((res) => setCelliers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        console.error("Erreur récupération celliers :", err);
        setCelliers([]);
      });
  }, []);

  // Ajouter un cellier
  const gererAjoutCellier = async (e) => {
    e.preventDefault();
    if (!nomCellier.trim()) {
      afficherModalConfirmation("Le nom du cellier est requis.");
      return;
    }
    try {
      const res = await api.post("/celliers", { nom: nomCellier });
      setCelliers((prev) => [...prev, res.data.cellier]);
      setNomCellier("");
      afficherModalConfirmation("Cellier créé avec succès !");
    } catch (err) {
      console.error(err);
      afficherModalConfirmation("Erreur lors de la création du cellier.");
    }
  };

  // Boire une bouteille
  const boireBouteille = async () => {
    const { cellier, produit } = selection;
    if (!cellier || !produit) return;
    const nouvelleQuantite = produit.pivot.quantite - 1;
    if (nouvelleQuantite < 0) return;

    try {
      await api.put(`/celliers/${cellier.id}/produits/${produit.id}`, { quantite: nouvelleQuantite });

      setCelliers((prev) =>
        prev.map((c) => {
          if (c.id !== cellier.id) return c;
          if (nouvelleQuantite === 0)
            return { ...c, produits: c.produits.filter((p) => p.id !== produit.id) };
          return {
            ...c,
            produits: c.produits.map((p) =>
              p.id === produit.id ? { ...p, pivot: { ...p.pivot, quantite: nouvelleQuantite } } : p
            ),
          };
        })
      );

      if (nouvelleQuantite === 0) setSelection({ cellier: null, produit: null });
      afficherModalConfirmation("Bonne dégustation !");
    } catch (err) {
      console.error(err);
      afficherModalConfirmation("Erreur lors du retrait de la bouteille");
    }
  };

  // Supprimer ou vider un cellier
  const viderCellier = async (cellierId) => {
    try {
      const cellier = celliers.find((c) => c.id === cellierId);

      // Calcul de la quantité totale
      const nbBouteilles =
        cellier?.produits?.reduce((total, p) => total + (p.pivot?.quantite || 0), 0) ?? 0;

      // Si le cellier contient des bouteilles, on les supprime
      if (nbBouteilles > 0) {
        await Promise.all(
          cellier.produits.map((p) =>
            api.put(`/celliers/${cellierId}/produits/${p.id}`, { quantite: 0 })
          )
        );
      }

      // Supprimer le cellier
      await api.delete(`/celliers/${cellierId}`);

      // Mettre à jour l'état
      setCelliers((prev) => prev.filter((c) => c.id !== cellierId));
      setCellierOuvertId(null);
      setModalSupprimerViderVisible(false);
      setCellierSelectionneSupId(null);

      afficherModalConfirmation("Cellier supprimé avec succès !");
    } catch (err) {
      console.error(err);
      afficherModalConfirmation("Erreur lors de la suppression du cellier");
    }
  };

  const afficherModalConfirmation = (message) => {
    setModalMessage(message);
    setModalVisible(true);
    setTimeout(() => setModalVisible(false), 2000);
  };

  const gererSupprimerCellier = (cellier) => {
    setCellierSelectionneSupId(cellier.id);
    setModalSupprimerViderVisible(true);
  };

  return (
    <div className="flex justify-center px-3 py-4">
      <div className="w-full lg:w-4/5">
        <h1 className="text-3xl mt-8 mb-8 text-center">Gestion des celliers</h1>
        <h2 className="text-2xl mt-8 mb-8 text-center flex gap-2 items-center">
          Mes Celliers <GiBarrel />
        </h2>

        {celliers.length > 0 ? (
          <ul className="space-y-4 mb-20">
            {celliers.map((cellier) => (
              <li key={cellier.id} className="rounded-lg shadow-sm overflow-hidden">
                <button
                  onClick={() =>
                    setCellierOuvertId(cellierOuvertId === cellier.id ? null : cellier.id)
                  }
                  className="w-full text-left p-3 flex justify-between items-center bg-[var(--couleur-form)] hover:bg-[#e5e5e5] rounded-lg cursor-pointer"
                >
                  <span className="font-semibold">{cellier.nom}</span>
                  <span>{cellierOuvertId === cellier.id ? <FaChevronUp /> : <FaChevronDown />}</span>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    cellierOuvertId === cellier.id ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                  }`}
                >
                  {cellier.produits && cellier.produits.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 bg-[var(--couleur-form)]">
                        {getProduitsPage(cellier)
                          .filter((p) => p.pivot.quantite > 0)
                          .map((p) => (
                            <div
                              key={p.id}
                              className="flex flex-col items-left p-2 bg-white rounded-md shadow cursor-pointer hover:bg-gray-50"
                              onClick={() => setSelection({ cellier, produit: p })}
                            >
                              <img
                                src={p.image || "https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png"}
                                alt={p.name || "Nom du vin non disponible"}
                                className="w-full aspect-square rounded-md object-contain"
                              />
                              <p>{p.name}</p>
                              <p>Quantité : {p.pivot.quantite}</p>
                            </div>
                          ))}
                      </div>

                      {cellier.produits.length > produitsParPageCellier && (
                        <div className="flex justify-between mt-2">
                          <button
                            className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                            disabled={(pagination[cellier.id] || 0) === 0}
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                [cellier.id]: (prev[cellier.id] || 0) - 1,
                              }))
                            }
                          >
                            Précédent
                          </button>
                          <button
                            className="px-2 py-1 bg-gray-300 rounded disabled:opacity-50"
                            disabled={
                              (pagination[cellier.id] || 0) >=
                              Math.floor((cellier.produits.length - 1) / produitsParPageCellier)
                            }
                            onClick={() =>
                              setPagination((prev) => ({
                                ...prev,
                                [cellier.id]: (prev[cellier.id] || 0) + 1,
                              }))
                            }
                          >
                            Suivant
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="p-4 text-gray-500">Aucun produit dans ce cellier.</p>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      className="mt-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => gererSupprimerCellier(cellier)}
                    >
                      Supprimer le cellier
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun cellier.</p>
        )}

        {/* Formulaire ajout cellier */}
        <div className="relative w-full sm:w-auto mb-10">
          <p className="text-2xl mb-4 flex gap-2 items-center">Nouveau cellier</p>
          <button
            className="sm:w-full sm:block inline-block text-lg px-6 py-3 border-[2px] border-solid border-[var(--couleur-accent)] text-[var(--couleur-accent)] hover:bg-[var(--couleur-accent)] hover:text-white rounded-lg cursor-pointer mb-4"
            onClick={() => setAfficherFormAjoutCellier((prev) => !prev)}
          >
            {afficherFormAjoutCellier ? "Fermer" : "Ajouter un cellier"}
          </button>

          {afficherFormAjoutCellier && (
            <form className="w-full flex flex-col bg-form space-y-4 p-4 rounded-lg" onSubmit={gererAjoutCellier}>
              <input
                type="text"
                value={nomCellier}
                onChange={(e) => setNomCellier(e.target.value)}
                placeholder="Ex. : Cellier du sous-sol"
                className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300"
              />
              <input type="submit" value="Créer le cellier" className="bouton-accent" />
            </form>
          )}
        </div>

        {/* Fiche bouteille mobile */}
        <FicheProduitCellier
          produit={selection.produit}
          onFerme={() => setSelection({ cellier: null, produit: null })}
          onBoit={boireBouteille}
        />

        {/* Modale confirmation simple */}
        <ModalConfirmation
          visible={modalVisible}
          message={modalMessage}
          onFermer={() => setModalVisible(false)}
        />

        {/* Modale Supprimer / Vider */}
        <ModalViderCellier
          visible={modalSupprimerViderVisible}
          cellier={cellierSelectionneSup}
          onFermer={() => {
            setModalSupprimerViderVisible(false);
            setCellierSelectionneSupId(null);
          }}
          onVider={viderCellier}
        />
      </div>
    </div>
  );
};

export default AfficheCellier;
