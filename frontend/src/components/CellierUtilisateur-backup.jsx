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
        if (!Array.isArray(produits)) return [];
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

    return (
        <div className="flex justify-center px-3 py-4">
        <div className="w-full lg:w-4/5">
            <h1 className="text-3xl mt-8 mb-8 text-center">{user ? `Rebonjour ${user.name} !` : ""}</h1>
            <h2 className="text-2xl mt-8 mb-8 text-center flex gap-2 items-center">
            Mes Celliers <GiBarrel />
            </h2>

            {celliers.length > 0 ? (
                
            <ul className="space-y-4 mb-20">
                {celliers.map((cellier) => {
                    const produitsFiltres = cellier.produits?.filter(
                    (p) => p.pivot?.quantite > 0
                    ) || [];

                const nbBouteilles = cellier.produits?.reduce(
                    (total, p) => total + (p.pivot?.quantite || 0),
                    0
                ) || 0;

                const nbVins = cellier.produits?.filter(
                    (p) => (p.pivot?.quantite || 0) > 0
                ).length || 0;

                return (
                    
                <li key={cellier.id} className="rounded-lg shadow-sm overflow-hidden">
                    <div>
                    
                        <button
                        onClick={() =>
                            setCellierOuvertId(cellierOuvertId === cellier.id ? null : cellier.id)
                        }                        
                        className={`"w-full text-left p-3 flex justify-between items-center rounded-lg cursor-pointer ${
                  cellierOuvertId === cellier.id ? "w-full bg-emerald-800 " : "w-full bg-emerald-800 text-white "
                }`}
                        >
                        {cellierEnEditionId === cellier.id ? (
                            
                            <input
                            type="text"
                            value={nouveauNomCellier}
                            onChange={(e) => setNouveauNomCellier(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="px-2 py-1 bg-white rounded w-[95%] outline-none border-none focus:ring-0"                            
                            />
                        ) : (                        
                        <div className="flex flex-col items-start">
                            <span className="font-semibold text-white">{cellier.nom}</span>
                            <span className="text-sm text-gray-200">
                                {nbBouteilles === 0
                                    ? "Cellier vide"
                                    : `${nbBouteilles} bouteilles • ${nbVins} vins`}
                            </span>
                        </div>
                        )}
                        <span>{cellierOuvertId === cellier.id ? <FaChevronUp /> : <FaChevronDown className="text-white" />}</span>
                        </button>                        
                    </div>
                    <div
                    className={`overflow-hidden transition-all duration-700 ${
                        cellierOuvertId === cellier.id ? "max-h-[2000px] rounded-lg bg-gray-200 mt-[1px] p-4 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
                    }`}
                    >
                    {cellier.produits && cellier.produits.length > 0 ? (
                        <>
                        {/* Section gestion cellier : modifier le nom */}
                        <div className="flex flex-col md:justify-between gap-4 md:flex-row p-3 items-center mb-4">
                                <button
                                    className="flex items-center gap-2 mt-2 px-3 py-1 bg-cyan-800 text-white rounded-lg hover:bg-white hover:text-cyan-800 cursor-pointer"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setCellierEnEditionId(cellier.id);
                                    setNouveauNomCellier(cellier.nom);
                                    }}
                                >
                                    <GrEdit /> Modifier le nom 
                                </button>
                                
                                {cellierEnEditionId === cellier.id && (
                                    <div className="flex gap-5 items-center" >
                                        <button  className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-800 text-white rounded-lg hover:bg-white hover:text-cyan-800 cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            annulerModificationNomCellier();
                                            }} >
                                            <IoIosUndo /> Annuler
                                        </button>
                                        <button
                                        className="flex items-center gap-2 mt-2 px-3 py-1 rounded-lg bg-cyan-800 text-white hover:bg-white hover:text-cyan-800 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            modifierNomCellier(cellier);
                                        }}
                                        >
                                        <MdOutlineSaveAlt className="text-2xl" /> Enregistrer
                                        </button>
                                    </div>
                                )}
                        </div>                       

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
                            {getProduitsCellier(produitsFiltres, cellier.id)
                            .map((p) => (
                                <div
                                key={`${cellier.id}-${p.id}`}
                                className="flex flex-col items-left p-3 rounded-md shadow-lg bg-white cursor-pointer hover:bg-gray-50"
                                onClick={() => setSelection({ cellier, produit: p })}
                                >
                                <img
                                    src={p.image || "https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png"}
                                    alt={p.name || "Nom du vin non disponible"}
                                    className="w-full aspect-square rounded-md object-contain"
                                />
                                <p className="">{p.name}</p>
                                <p className="text-sm font-bold">Quantité : {p.pivot.quantite}</p>
                                </div>
                            ))}
                        </div>

                        {/* Section gestion cellier : déplacer les bouteilles */}
                            <div className="flex flex-col items-center md:justify-between gap-4 md:flex-row  mt-4 mb-4 p-2 ">
                                <button
                                className="flex items-center gap-2 px-3 py-1 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 hover-text-black cursor-pointer"
                                onClick={() => ouvrirModalDeplacement(cellier.id)}
                                >
                                <MdOutlineDriveFileMove className="text-2xl"/> Déplacer bouteilles
                                </button>                                                            
                            </div>

                        {cellier.produits.length > produitsParPageCellier && (
                            <div className="flex justify-between p-3 mt-2 mb-4">
                            <button
                                className="flex items-center gap-2 px-2 py-1 bg-white cursor-pointer disabled:cursor-default rounded disabled:opacity-80 disabled:text-gray-800 shadow-lg"
                                disabled={(pagination[cellier.id] || 0) === 0}
                                onClick={() =>
                                setPagination((prev) => ({
                                    ...prev,
                                    [cellier.id]: (prev[cellier.id] || 0) - 1,
                                }))
                                }
                            >
                                <MdNavigateBefore /> Précédent
                            </button>
                            <button
                                className="flex items-center gap-2 px-2 py-1 bg-white rounded cursor-pointer disabled:cursor-default disabled:opacity-80 disabled:text-gray-800 shadow-lg"
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
                                Suivant <MdNavigateNext />
                            </button>
                            
                            </div>
                        )}
                        </>
                    ) : (
                        <div>
                            {/* Section gestion cellier : suite modifier le nom du cellier vide */}
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    className="flex items-center gap-2 mt-2 px-3 py-1 bg-cyan-800 text-white rounded-lg hover:bg-white hover:text-cyan-800 cursor-pointer"
                                    onClick={(e) => {
                                    e.stopPropagation();
                                    setCellierEnEditionId(cellier.id);
                                    setNouveauNomCellier(cellier.nom);
                                    }}
                                >
                                    <GrEdit /> Modifier le nom
                                </button>
                                
                                {cellierEnEditionId === cellier.id && (
                                    <div className="flex gap-5 items-center" >
                                        <button  className="flex items-center gap-2 mt-2 px-3 py-1 bg-green-800 text-white bg-cyan-800 text-white rounded-lg hover:bg-white  hover:text-cyan-800 cursor-pointer" onClick={(e) => {
                                            e.stopPropagation();
                                            annulerModificationNomCellier();
                                            }} >
                                           <IoIosUndo /> Annuler
                                        </button>
                                        <button
                                        className="flex items-center gap-2 mt-2 px-3 py-1 bg-[var(--rose_vino)] text-white bg-cyan-800 text-white rounded-lg hover:bg-white hover:text-cyan-800 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            modifierNomCellier(cellier);
                                        }}
                                        >
                                        <MdOutlineSaveAlt className="text-2xl" /> Enregistrer
                                        </button>
                                    </div>
                                )}
                        </div>
                            <p className="p-4 text-gray-800">Aucune bouteille pour l'instant ...</p> 
                            {/* Section gestion cellier : supprimer le cellier vide */}
                            <div className="flex justify-between items-center mt-4 p-2">
                                <button
                                className="flex items-center gap-2 px-3 py-1 bg-[var(--couleur-text)] text-white bg-cyan-800 text-white rounded-lg hover:bg-white  hover:text-cyan-800 cursor-pointer"
                                onClick={() => ouvrirModalSuppression(cellier.id)}
                                >
                                <MdOutlineDeleteForever className="text-2xl" /> Supprimer cellier
                                </button>
                            
                            </div>
                            {/* Fin Section gestion cellier */}
                        </div>                
                    )}
                    
                    </div>
                </li>
                )})}
            </ul>
            ) : (
            <div className="flex flex-col items-center gap-2 mb-5">
                <p className="points">
                    {/* Animations 3 points pour le chargement des celliers */}	                
                    <span></span><span></span><span></span>                    
                </p>
                <p className="text-[var(--couleur-accent)] text-2xl">Chargement des celliers ...</p>
            </div>
            )}

            {/* Formulaire ajout cellier */}
            <div className="relative w-full sm:w-auto">            
            <button
                className="w-full block inline-block text-lg bg-transparent border-[2.5px] border-emerald-700 text-black font-bold text-lg px-6 py-3 border-solid hover:bg-emerald-600 hover:border-transparent hover:text-white rounded-lg cursor-pointer"
                onClick={() => setAfficherFormAjoutCellier((prev) => !prev)}
            >
                {afficherFormAjoutCellier ? "Fermer" : "Ajouter un cellier"}
            </button>

            {afficherFormAjoutCellier && (
                <form className="w-full flex flex-col space-y-4 rounded-lg" onSubmit={gererAjoutCellier}>
                <input
                    type="text"
                    value={nomCellier}
                    onChange={(e) => setNomCellier(e.target.value)}
                    placeholder="Ex. : Cellier du sous-sol"
                    className="px-2 py-1 bg-white text-xl text-gray-800 rounded w-full outline-none border-none focus:ring-0"
                />
                <input type="submit" value="Sauvegarder" className="bg-emerald-700 text-xl text-white px-6 py-3 rounded-lg border-[2px] border-solid cursor-pointer"/>
                </form>
            )}
            </div>

            {/* Fiche bouteille mobile */}
            <FicheProduitCellier
            produit={selection.produit}
            nbBouteilles={selection.produit?.pivot?.quantite}
            onFerme={() => setSelection({ cellier: null, produit: null })}
            onBoit={boireBouteille}
            />

            {/* Modale confirmation simple */}
            <ModalConfirmation
            visible={modalVisible}
            message={modalMessage}
            onFermer={() => setModalVisible(false)}
            />
            {/* Modale Supprimer */}
            <ModalSupprimerPale
                visible={modalSupprimerVisiblePale}
                onAnnule={() => setModalSupprimerVisiblePale(false)}
                onSupprime={() => {
                supprimerCellier();
                }}
            />
                       
            <ModalSupprimerCellier 
                visible={modalVisible}
                message={modalMessage}
                //onSupprime={supprimerCellier}
                onAnnule={()=> {
                setModalSupprimerViderVisible(false);
            }}
            />

            {/* Modale vider cellier */}
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
                setCellierCibleId(null); // réinitialiser le select
            }} 
            />
        </div>
    </div>
  );
};

export default AfficheCellier;
