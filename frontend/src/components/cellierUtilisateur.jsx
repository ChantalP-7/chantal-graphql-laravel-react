import { useEffect, useState } from "react";
import api from "../api/axios";
import GetUsager from "../components/GetUsager";
import FicheProduitCellier from "./FicheProduitCellier";
import ModalConfirmation from "./ModalConfirmation";
import ModalViderCellier from "./ModalViderCellier";
import ModalSupprimerCellier from "./ModalSupprimerCellier";
import ModalSupprimerPale from "./ModalSupprimerPale";

// Importation d'icônes
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { GiBarrel } from "react-icons/gi";
import { GrEdit } from "react-icons/gr";
import { MdOutlineDeleteForever } from "react-icons/md";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { MdOutlineSaveAlt } from "react-icons/md";
import { IoIosUndo } from "react-icons/io";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";

const produitsParPageCellier = 5;

// Fonction principale d'affichage du cellier qui comportent plusieurs autre fonctions pour la gestion du cellier
const AfficheCellier = () => {
    const [celliers, setCelliers] = useState([]);
    const [cellierOuvertId, setCellierOuvertId] = useState(null);    
    const [selection, setSelection] = useState({ cellier: null, produit: null });
    const [pagination, setPagination] = useState({});
    const [afficherFormAjoutCellier, setAfficherFormAjoutCellier] = useState(false);
    const [nomCellier, setNomCellier] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalSupprimerVisiblePale, setModalSupprimerVisiblePale] = useState(false);
    const [modalSupprimerViderVisible, setModalSupprimerViderVisible] = useState(false);    
    const [cellierSelectionneSupId, setCellierSelectionneSupId] = useState(null);
    const [cellierEnEditionId, setCellierEnEditionId] = useState(null);
    const [ancienNomCellier, setAncienNomCellier] = useState("");
    const [nouveauNomCellier, setNouveauNomCellier] = useState("");
    const [cellierCibleId, setCellierCibleId] = useState(null);

    const cellierSelectionneSup = celliers.find(
        (c) => c.id === cellierSelectionneSupId
    );

    const user = GetUsager();

    // Pagination des produits par cellier
    const getProduitsCellier = (produits, cellierId) => {
        const page = pagination[cellierId] || 0;
        const start = page * produitsParPageCellier;
        const end = start + produitsParPageCellier;
        return produits.slice(start, end);
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

    const annulerModificationNomCellier = () => {
        setNouveauNomCellier(ancienNomCellier);
        setCellierEnEditionId(null);
    };

    // Modifier le nom du cellier sélectionné 
    const modifierNomCellier = async (cellier) => {
        if (!nouveauNomCellier.trim()) {
        afficherModalConfirmation("Le nom du cellier est requis.");
        return;
        }

        try {
        await api.put(`/celliers/${cellier.id}`, {
            nom: nouveauNomCellier,
        });

        setCelliers((prev) =>
            prev.map((c) =>
            c.id === cellier.id ? { ...c, nom: nouveauNomCellier } : c
            )
        );

        setCellierEnEditionId(null);
        setNouveauNomCellier("");        
        setAncienNomCellier(cellier.nom);
        
        } catch (err) {
        console.error(err);
        afficherModalConfirmation("Erreur lors de la modification du nom.");
        }
    };

    // Boire une bouteille
    const boireBouteille = async (quantiteABoire) => {
        const { cellier, produit} = selection;
        if (!cellier || !produit) return;
        const nouvelleQuantite = produit.pivot.quantite - quantiteABoire;
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

        setSelection((prev) => {
            if (!prev.produit) return prev;
            return {
                ...prev,
                produit: {
                    ...prev.produit,
                    pivot: {
                        ...prev.produit.pivot,
                        quantite: nouvelleQuantite
                    }
                }
            };
        });

        if (nouvelleQuantite === 0) setSelection({ cellier: null, produit: null });
        afficherModalConfirmation(`Il reste ${nouvelleQuantite} bouteilles de ce vin. Bonne dégustation !`);
        } catch (err) {
        console.error(err);
        afficherModalConfirmation("Erreur lors du retrait de la bouteille pour dégustation!");
        }
        
    };

    // Supprimer un cellier vide 
    const supprimerCellier = async () => {
            try {            

            await api.delete(`/celliers/${cellierSelectionneSupId}`);             
            
            setModalSupprimerVisiblePale(false);  
            
            setCelliers((prev) =>
                prev.filter((c) => c.id !== cellierSelectionneSupId)
            );         
            } catch (err) {
            console.error(err);
            afficherModalConfirmation("Erreur lors de la suppression du cellier.");
        }
    }

    // Déplacer les bouteilles d'un cellier dans un autre cellier 
    const deplacerBouteilles = async (cellierSourceId, cellierCibleId) => {
        try {
        const cellierSource = celliers.find(c => c.id === cellierSourceId);
        const cellierCible = celliers.find(c => c.id === cellierCibleId);

        if (!cellierSource || !cellierCible) return;

        for (const produit of cellierSource.produits) {
            const quantite = produit.pivot.quantite;
            if (quantite <= 0) continue;

            // Vérifier si le produit existe déjà dans le cellier cible
            const produitExistant = cellierCible.produits.find(p => p.id === produit.id);

            if (produitExistant) {
            // Additionner les quantités
            await api.put(
                `/celliers/${cellierCibleId}/produits/${produit.id}`,
                { quantite: produitExistant.pivot.quantite + quantite }
            );
            } else {
            // Ajouter le produit au cellier cible
            await api.put(
                `/celliers/${cellierCibleId}/produits/${produit.id}`,
                { quantite }
            );
            }

            // Retirer du cellier source
            await api.put(
            `/celliers/${cellierSourceId}/produits/${produit.id}`,
            { quantite: 0 }
            );
        }

        // Mise à jour locale du state
        setCelliers(prev =>
            prev.map(c => {
                if (c.id === cellierCibleId) {
                    let updatedProduits = [...c.produits];
                    cellierSource.produits.forEach(sourceProduit => {

                        const index = updatedProduits.findIndex(p => p.id === sourceProduit.id);  
                        if (index !== -1) {
                            // produit existe → on additionne
                            updatedProduits[index] = {
                                ...updatedProduits[index],
                                pivot: {
                                ...updatedProduits[index].pivot,
                                quantite:
                                    updatedProduits[index].pivot.quantite +
                                    sourceProduit.pivot.quantite
                                }
                            };
                        } else {
                        // nouveau produit
                        updatedProduits.push({ ...sourceProduit });
                        }
                });

                return {
                    ...c,
                    produits: updatedProduits
                };
                }

                if (c.id === cellierSourceId) {
                return {
                    ...c,
                    produits: [] // tableau vide
                };
                }

                return c;
            })
        );

        afficherModalConfirmation("Bouteilles déplacées avec succès !");
        setModalSupprimerViderVisible(false);
        setCellierSelectionneSupId(null);
        setCellierCibleId(null);
        } catch (err) {
        console.error(err);
        afficherModalConfirmation("Erreur lors du déplacement des bouteilles.");
        }
    };    

    // Modale confirmation    

    const afficherModalConfirmation = (message) => {
        setModalMessage(message);
        setModalVisible(true);
        setTimeout(() => setModalVisible(false), 2000);
    };

    // Modale déplacer les bouteilles dans un autre cellier

    const ouvrirModalDeplacement = (cellierId) => {
        setCellierSelectionneSupId(cellierId);
        setModalSupprimerViderVisible(true);
    };
    // Modale supprimer un cellier

    const ouvrirModalSuppression = (cellierId) => {
        setCellierSelectionneSupId(cellierId);
        setModalSupprimerVisiblePale(true);
    };

    const cellierOuvert = celliers.find(c => c.id === cellierOuvertId);

    const produitsFiltres = cellierOuvert?.produits?.filter(
        (p) => p.pivot?.quantite > 0
    ) || [];

    const produits = produitsFiltres || [];
    const pageCourante = pagination[cellierOuvert?.id] || 0;
    const totalPages = Math.ceil(produits.length / produitsParPageCellier);
    

    return (
		<div className="flex justify-center px-3 py-4">
			<div className="w-full lg:w-4/5">
			{/* Header */}
			<h1 className="text-3xl mt-8 mb-8 text-center">
				{user ? `Rebonjour ${user.name} !` : ""}
			</h1>
			<h2 className="text-2xl mt-8 mb-8 text-center flex gap-2 items-center">
				Mes Celliers <GiBarrel />
			</h2>

		{/* Grille des celliers */}
		{celliers.length > 0 ? (
			<div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-3 mb-4">
			{celliers.map((cellierOuvert) => {            
				const nbBouteilles =
				cellierOuvert.produits?.reduce(
				(total, p) => total + (p.pivot?.quantite || 0),
				0
				) || 0;

				const nbVins =
				cellierOuvert.produits?.filter(
				(p) => (p.pivot?.quantite || 0) > 0
				).length || 0;

			return (
				<button
				key={cellierOuvert.id}
				onClick={() =>
					setCellierOuvertId(
					cellierOuvertId === cellierOuvert.id ? null : cellierOuvert.id
					)
				}
				className="w-full flex justify-between items-center gap-2 text-start p-3 border-1 shadow-md bg-white hover:bg-emerald-200  border-emerald-500 rounded-lg cursor-pointer"
				>
					<div className="flex flex-col items-start text-gray-900">
						<span className="font-semibold">
						{cellierOuvert.nom}
						</span>

						<span className="text-sm text-emerald-700">
						{nbBouteilles === 0
							? "Cellier vide"
							: `${nbBouteilles} bouteilles • ${nbVins} vins`}
						</span>
					</div>
                     <span>{cellierOuvertId !== cellierOuvert.id && (
                            <FaChevronDown className="text-emerald-800" />
                        )}</span>
				</button>
			);
			})}
			</div>
			) : (
			<div className="flex flex-col items-center gap-2 mb-5">
				<p className="points">
					{/* Animations 3 points pour le chargement des celliers */}	                
					<span></span><span></span><span></span>                    
				</p>
				<p className="text-[var(--couleur-accent)] text-2xl">Chargement des celliers ...</p>
			</div>
      	)
	  }

      {/* Contenu du cellier ouvert */}
      {cellierOuvert && (
		<div className="w-full bg-gray-200 rounded-lg p-4 shadow-md transition-all duration-500 mt-20">
			{/* Modifier le nom du cellier */}
            <div className="flex justify-between">
                <div className="flex flex-col md:justify-between gap-4 md:flex-row p-3 items-center mb-4"> 
                    <div className="flex justify-start flex-col gap-3 p-3 mb-4">
                    {cellierEnEditionId === cellierOuvert.id ? (
                        <>
                        <input
                            type="text"
                            value={nouveauNomCellier}
                            onChange={(e) => setNouveauNomCellier(e.target.value)}
                            className="px-2 py-1 rounded w-full bg-white"
                        />

                        <div className="flex gap-3">
                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                annulerModificationNomCellier();
                            }}
                            className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-800 text-white rounded-lg hover:bg-green-600 cursor-pointer "
                            >
                            <IoIosUndo /> Annuler
                            </button>

                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                modifierNomCellier(cellierOuvert);
                            }}
                            className="flex items-center gap-2 mt-2 px-3 py-1 bg-cyan-800 text-white rounded-lg hover:bg-white hover:text-cyan-800 cursor-pointer"
                            >
                            <MdOutlineSaveAlt className="text-2xl" /> Enregistrer
                            </button>
                        </div>
                        </>
                    ) : (
                        <>
                        <span className="font-bold">{cellierOuvert.nom}</span>

                        <button
                            onClick={(e) => {
                            e.stopPropagation();
                            setCellierEnEditionId(cellierOuvert.id);
                            setNouveauNomCellier(cellierOuvert.nom);
                            }}
                            className="flex items-center gap-2 mt-2 px-3 py-1 bg-cyan-800 text-white rounded-lg hover:bg-white hover:text-cyan-800 cursor-pointer"
                        >
                            <GrEdit /> Modifier le nom
                        </button>
                        </>
                    )}
                    
                </div>                
                            
            </div>
            <div className="flex justify-end mb-2">
                <button className={`"w-full p-3 flex justify-between items-center gap-2 text-emerald-800 font-bold rounded-lg cursor-pointer `} onClick={() => setCellierOuvertId(null)}>
                        <FaChevronUp className="text-emerald-800" />Fermer 
                </button>
            </div>          
          </div>

          {/* Produits filtrés */}
          {produitsFiltres.length > 0 ? (
            <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
              {getProduitsCellier(produitsFiltres, cellierOuvert.id).map(
                (p) => (
                  <div
                    key={`${cellierOuvert.id}-${p.id}`}
                    className="flex flex-col items-left p-3 rounded-md shadow-lg bg-white cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      setSelection({ cellier: cellierOuvert, produit: p })
                    }
                  >
                    <img
                      src={
                        p.image ||
                        "https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png"
                      }
                      alt={p.name || "Nom du vin non disponible"}
                      className="w-full aspect-square rounded-md object-contain"
                    />
                    <p>{p.name}</p>
                    <p className="text-sm font-bold">
                      Quantité : {p.pivot.quantite}
                    </p>
                  </div>
                ) 
              )
              
              }
            </div>
           {/* Section gestion cellier : déplacer les bouteilles */}
                  <div className="flex flex-col items-center md:justify-between gap-4 md:flex-row  mt-4 mb-4 p-2 ">
                      <button
                      className="flex items-center gap-2 px-3 py-1 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 hover-text-black cursor-pointer"
                      onClick={() => ouvrirModalDeplacement(cellierOuvert.id)}
                      >
                      <MdOutlineDriveFileMove className="text-2xl"/> Déplacer bouteilles
                      </button>                                                            
                  </div>

                  
            {/* Section gestion cellier : pagination */}              
                {totalPages > 1 && (
                    
                    <div className="flex justify-between p-3 mt-2 mb-4">
                    {/* Bouton Précédant */}
                    <button
                        className="flex items-center gap-2 px-2 py-1 bg-white cursor-pointer disabled:cursor-default rounded disabled:opacity-80 disabled:text-gray-800 shadow-lg"
                        disabled={pageCourante === 0}
                            onClick={() =>
                            setPagination((prev) => ({
                                ...prev,
                                [cellierOuvert.id]: pageCourante - 1,
                            }))
                            }
                    >
                      <MdNavigateBefore /> Précédent
                  </button>
                  {/* Div Pages cliquables */}
                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                            <button
                            key={page}
                            onClick={() =>
                                setPagination((prev) => ({
                                ...prev,
                                [cellierOuvert.id]: page,
                                }))
                            }
                            className={`px-3 py-1 rounded shadow ${
                                page === pageCourante
                                ? "bg-cyan-800 text-white"
                                : "bg-white hover:bg-gray-200"
                            }`}
                            >
                            {page + 1}
                            </button>
                        ))}
                    </div>
                    {/* Bouton Suivant */}
                    <button
                        className="flex items-center gap-2 px-2 py-1 bg-white rounded cursor-pointer disabled:cursor-default disabled:opacity-80 disabled:text-gray-800 shadow-lg"
                        disabled={pageCourante >= totalPages - 1}
                        onClick={() =>
                        setPagination((prev) => ({
                            ...prev,
                            [cellierOuvert.id]: pageCourante + 1,
                        }))
                        }
                    >
                        Suivant <MdNavigateNext />
                    </button>
                    
                    </div>
                
                )}
                </>
            ) : (
                <>
                <p className="p-4 text-gray-800">Aucune bouteille pour l'instant ...</p> 
                {/* Section gestion cellier : supprimer le cellier vide */}
                <div className="flex justify-between items-center mt-4 p-2">
                    <button
                    className="flex items-center gap-2 px-3 py-1 bg-[var(--couleur-text)] text-white bg-cyan-800 text-white rounded-lg hover:bg-white  hover:text-cyan-800 cursor-pointer"
                    onClick={() => ouvrirModalSuppression(cellierOuvert.id)}
                    >
                    <MdOutlineDeleteForever className="text-2xl" /> Supprimer cellier
                    </button>
                
                </div>
            </>    
            
          ) 
          
          }
          
                                  
        </div>
        
      ) }
      

      {/* Section gestion cellier : Ajouter un cellier */}
      <div className="relative w-full sm:w-auto mb-6">
        <button
          className="w-full block inline-block text-lg bg-transparent border-[2.5px] border-emerald-700 mt-20 text-black font-bold text-lg px-6 py-3 border-solid hover:bg-emerald-600 hover:border-transparent hover:text-white rounded-lg cursor-pointer"
          onClick={() => setAfficherFormAjoutCellier((prev) => !prev)}
        >
          {afficherFormAjoutCellier ? "Fermer" : "Ajouter un cellier"}
        </button>

        {afficherFormAjoutCellier && (
          <form
            className="w-full flex flex-col space-y-4 rounded-lg mt-3"
            onSubmit={gererAjoutCellier}
          >
            <input
              type="text"
              value={nomCellier}
              onChange={(e) => setNomCellier(e.target.value)}
              placeholder="Ex. : Cellier du sous-sol"
              className="px-2 py-1 bg-white text-xl text-gray-800 rounded w-full outline-none border-none focus:ring-0"
            />
            <input
              type="submit"
              value="Sauvegarder"
              className="bg-emerald-700 text-xl text-white px-6 py-3 rounded-lg border-[2px] border-solid cursor-pointer"
            />
          </form>
        )}
      </div>
      {/* Fin Section gestion cellier*/ }

      {/* Fiche produit mobile */}
      <FicheProduitCellier
        produit={selection.produit}
        nbBouteilles={selection.produit?.pivot?.quantite}
        onFerme={() => setSelection({ cellier: null, produit: null })}
        onBoit={boireBouteille}
      />

      {/* Modales */}
      <ModalConfirmation
        visible={modalVisible}
        message={modalMessage}
        onFermer={() => setModalVisible(false)}
      />
      <ModalSupprimerPale
        visible={modalSupprimerVisiblePale}
        onAnnule={() => setModalSupprimerVisiblePale(false)}
        onSupprime={supprimerCellier}
      />
      <ModalSupprimerCellier
        visible={modalVisible}
        message={modalMessage}
        onAnnule={() => setModalSupprimerViderVisible(false)}
      />
      <ModalViderCellier
        visible={modalSupprimerViderVisible}
        cellierId={cellierSelectionneSupId}
        celliers={celliers}
        cellierCibleId={cellierCibleId}
        setCellierCibleId={setCellierCibleId}
        deplacerBouteilles={deplacerBouteilles}
        onFermer={() => {
          setModalSupprimerViderVisible(false);
          setCellierSelectionneSupId(null);
          setCellierCibleId(null);
        }}
      />
    </div>
  </div>
);
}
export default AfficheCellier;
