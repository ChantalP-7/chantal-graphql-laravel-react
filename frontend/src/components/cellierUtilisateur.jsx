import { useEffect, useState } from "react";
import api from "../api/axios";
import FicheProduitCellier from "./FicheProduitCellier";
import ModalAjouter from "../components/ModalAjouter";
import ModalErreur from "../components/ModalErreur";
import ModalSupprimerCellier from "../components/ModalSupprimerCellier";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { GiGrapes } from "react-icons/gi";
import { GiBarrel } from "react-icons/gi";
 

const produitsParPageCellier = 6;

const AfficheCellier = () => {
    const [celliers, setCelliers] = useState([]);
    const [cellierOuvertId, setCellierOuvertId] = useState(null);
    const [produitSelectionne, setProduitSelectionne] = useState(null);
    const [pagination, setPagination] = useState({});
    const [afficherFormAjoutCellier, setAfficherFormAjoutCellier] = useState(false); // toggle afficher/cacher le formulaire d'ajout
    const [afficherFormModifCellier, setAfficherFormModifCellier] = useState(false); // toggle afficher/cacher le formulaire de modif
    const [afficherFormSupprimerCellier, setAfficherFormSupprimerCellier] = useState(false) // toggle afficher/cacher le formulaire de suppression de cellier
    const [nomCellier, setNomCellier] = useState("");
    const [nomCellierModif, setNomCellierModif] = useState("");
    const [nomCellierSup, setNomCellierSup] = useState("");
    const [cellierSelectionne, setCellierSelectionne] = useState("");
    const [erreurs, setErreurs] = useState({});
    const [message, setMessage] = useState("");
    const [messageAjout, setMessageAjout] = useState("");
    const [messageSupprimerCellier, setMessageSupprimerCellier] = useState("");
    const [modalAjouterVisible, setModalAjouterVisible] = useState(false); // affiche la boite modale d'ajout et quantité
    const [modalErreurVisible, setModalErreurVisible] = useState(false);
    const [modalSupprimerCellierVisible, setModalSupprimerCellierVisible] = useState(false);
    const [chargementSupprimer, setChargementSupprimer] = useState(false);

    useEffect(() => {
        api.get("/celliers")
        .then(res => setCelliers(Array.isArray(res.data) ? res.data : []))
        .catch(err => {
            console.error("Erreur lors de la récupération des celliers :", err);
            setCelliers([]);
        });
    }, []);

    // Supression / Boire une bouteille
    const gestionRetraitBouteille = async (cellierId, produitId, quantiteActuelle) => {
        const nouvelleQuantite = quantiteActuelle - 1;
        try {
        await api.put(`/celliers/${cellierId}/produits/${produitId}`, { quantite: nouvelleQuantite });
        setMessageRetireBouteille("");
        setCelliers(prev =>
            prev.map(cellier => {
            if (cellier.id !== cellierId) return cellier;
            setMessageRetireBouteille("Retrait de la bouteille avec succès !");
            return {
                ...cellier,
                produits: cellier.produits
                .map(p => p.id === produitId ? { ...p, pivot: { ...p.pivot, quantite: nouvelleQuantite } } : p)
                .filter(p => p.pivot.quantite > 0),
            };
            })
        );
        setProduitSelectionne(null); // Ferme la modal après suppression
        } catch (error) {
        console.error(error);
        alert("Erreur lors du retrait de la bouteille !");
        }
    };

    // Ajout d'un nouveau cellier

    const gererSoumission = async (e) => {
        e.preventDefault();
        
        setErreurs({});
        setMessage("");
        
        if (!nomCellier.trim()) {
            setErreurs({ nom: "Le nom du cellier est requis." });
            return;
        }

        try {
            const reponse = await api.post("/celliers", { nom: nomCellier });
            
            setNomCellier("");
            setMessageAjout(reponse.data.message || "Cellier créé avec succès !");
            setModalAjouterVisible(true);

            // Fermer la modal après 5 secondes
            setTimeout(() => setModalAjouterVisible(false), 5000);

        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErreurs(error.response.data.errors);
            } else {
                setMessageAjout("Une erreur est survenue lors de la création du cellier.");
                setModalAjouterVisible(true);
            }
        }
    };

    // Modifier le nom du cellier
    const modifierNomCellier = async (e) => {
        e.preventDefault();

        try {
            const res = await api.put(`/celliers/${cellierSelectionne}`, {
                nom: nomCellierModif
            });

            // Mettre à jour la liste des celliers dans l'interface
            setCelliers(prev =>
                prev.map(c =>
                    c.id == cellierSelectionne ? { ...c, nom: nomCellierModif } : c
                )
            );

            // Modale retire bouteille du cellier
            setMessageAjout(`Tu as bien modifié le nom du cellier pour : ${nomCellierModif}!`);
            setModalAjouterVisible(true);

            // fermer la modale après 5s
            setTimeout(() => {
                setModalAjouterVisible(true);
            }, 5000);

            // Réinitialiser les champs
            setNomCellierModif("");
            setCellierSelectionne("");
            
            // Fermer le formulaire
            setAfficherFormModifCellier(false);

            // Nettoyer les erreurs
            setErreurs({});

            // Message de confirmation
            setMessage(res.data.message);

            // Disparition du message après 5 secondes
            setTimeout(() => setMessage(""), 5000);

        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErreurs(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            }
        }
    };

    

    const supprimerCellier = async () => {
        setChargementSupprimer(true);
        try {
            const id = Number(cellierSelectionne);

            await api.delete(`/celliers/${id}`);
            
            setCelliers(prev => prev.filter(c => c.id !== id));
            
            setMessageSupprimerCellier("Ton cellier a bien été supprimé !");

            setTimeout(() => {
                setMessageSupprimerCellier("");
            }, 3000);
            
            setModalSupprimerCellierVisible(false);
            setAfficherFormSupprimerCellier(false);

            // Reset
            setNomCellierSup("");
            setCellierSelectionne("");

        } catch (error) {
            console.error(error);
            setMessageSupprimerCellier("Erreur lors de la suppression.");
        } finally {
        setChargementSupprimer(false);
    }
    };

    //

    const confirmer = async () => {
        setChargementSupprimer(true); // ✔ feedback immédiat

        try {
            await api.delete(`/celliers/${idASupprimer}`);

            setCelliers(prev => prev.filter(c => c.id !== idASupprimer));
            setModalVisible(false);

            // ici tu affiches ton message de réussite
            setSuccessMessage("Le cellier a été supprimé avec succès !");
            
        } catch (err) {
            console.error(err);
        } finally {
            setChargementSuppression(false);
        }
    };


    // Pagination

    const changerPage = (cellierId, direction) => {
        setPagination(prev => {
        const page = prev[cellierId] || 0;
        return { ...prev, [cellierId]: page + direction };
        });
    };

    const getProduitsPage = (cellier) => {
        const page = pagination[cellier.id] || 0;
        const start = page * produitsParPageCellier;
        const end = start + produitsParPageCellier;
        return cellier.produits.slice(start, end);
    };

    {/* Animations 3 points pour le chargement de la page */}
	if (!celliers) return <div className="points"> 
		<span></span><span></span><span></span>
	</div>;

    return (
        <div className="flex justify-center align-col px-3 py-4">                        
            <div className="w-full lg:w-4/5">
                <div>
                    <h1 className="text-3xl mt-8 mb-8 text-center">Gestion des celliers</h1>
                </div>
                <h2 className="text-2xl mt-8 mb-8 text-center flex gap-2 items-center">Mes Celliers <GiBarrel /></h2>

                {celliers.length > 0 ? (
                <ul className="space-y-4 mb-20">
                    {celliers.map(cellier => (
                    <li key={cellier.id} className="rounded-lg shadow-sm overflow-hidden">
                        <button
                        onClick={() => setCellierOuvertId(cellierOuvertId === cellier.id ? null : cellier.id)}
                        className="w-full text-left p-3 flex justify-between items-center bg-[var(--couleur-form)] hover:bg-[#e5e5e5] rounded-lg cursor-pointer"
                        >
                        <span className="font-semibold">{cellier.nom}</span>
                        <span className="text-md">{cellierOuvertId === cellier.id ? <FaChevronUp /> : <FaChevronDown />}</span>
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ${cellierOuvertId === cellier.id ? "max-h-[2000px] opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}`}>
                        {cellier.produits && cellier.produits.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 bg-[var(--couleur-form)] lg:grid-cols-5 gap-2 p-2">
                            {getProduitsPage(cellier).map(p => (
                                <div
                                key={p.id}
                                className="flex flex-col items-left p-2 bg-white rounded-md shadow cursor-pointer hover:bg-gray-50"
                                onClick={() => setProduitSelectionne({ ...p, cellierId: cellier.id })}
                                >
                                <div className="w-full aspect-square  rounded-md flex items-center justify-center">                                
                                    <img className="imageCellier" src={p.image || 'https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png'}
                                    alt={p.name ? `Nom du vin ${p.name}` : 'Nom du vin non disponible'}/>
                                </div>
                                <p className="text-sm font-medium text-[var(--couleur-text)] mt-1 mb-1">{p.name}</p>
                                <p className="text-sm font-bold  text-[var(--couleur-text)] ">Quantité : {p.pivot.quantite}</p>
                                </div>
                            ))}

                            {/* Pagination des celliers - 6 par section maximum */}
                            {cellier.produits.length > produitsParPageCellier && (
                                <div className="flex justify-between col-span-full mt-2">
                                <button
                                    className="px-3 py-1 bg-white rounded disabled:opacity-50 disabled:cursor-default hover:cursor-pointer"
                                    onClick={() => changerPage(cellier.id, -1)}
                                    disabled={(pagination[cellier.id] || 0) === 0}
                                >
                                    Précédent
                                </button>
                                <button
                                    className="px-3 py-1 bg-white rounded disabled:opacity-50 disabled:cursor-default hover:cursor-pointer"
                                    onClick={() => changerPage(cellier.id, 1)}
                                    disabled={(pagination[cellier.id] || 0) >= Math.floor(cellier.produits.length / produitsParPageCellier)}
                                >
                                    Suivant
                                </button>
                                </div>
                            )}
                            </div>
                        ) : (
                            <p className="p-4 text-gray-500">Aucun produit dans ce cellier.</p>
                        )}
                        </div>
                    </li>
                    ))}
                </ul>
                ) : (
                <p></p>
                )}
                
                <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-20">                    
                    { /* Ajout d'un nouveau cellier */ }
                    <div className="relative w-full sm:w-auto">
                        <p className="text-2xl mb-8 flex gap-2 items-center">Nouveau cellier</p>
                        
                        <button className="sm:w-full sm:block inline-block text-lg px-6 py-3 mb-10 border-[2px] border-solid border-[var(--couleur-accent)] text-[var(--couleur-accent)] hover:bg-[var(--couleur-accent)] hover:text-white rounded-lg cursor-pointer" onClick={() => setAfficherFormAjoutCellier(prev => prev === "ajout" ? null : "ajout")}>
                                
                            {afficherFormAjoutCellier === "ajout" ? "Fermer" : "Ajouter un cellier"}
                        </button>
                        {afficherFormAjoutCellier === "ajout" &&  (
                            <form className="w-full flex flex-col bg-form space-y-4 p-4" onSubmit={gererSoumission}>
                                
                                
                                <div className="flex flex-col mt-2">
                                    <label className="text-brown" htmlFor="nomCellier">
                                    Nom du cellier
                                    </label>
                                    <input
                                    className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300"
                                    type="text"
                                    id="nomCellier"
                                    name="nom"
                                    placeholder="Ex. : Cellier du sous-sol"
                                    value={nomCellier}
                                    onChange={(e) => setNomCellier(e.target.value)}
                                    />
                                    {erreurs.nom && <p className="text-red-500 pt-2">{erreurs.nom[0]}</p>}
                                </div>                                
                                {messageAjout}
                                
                                <input
                                className="bouton-accent"
                                type="submit"
                                value="Créer le cellier"
                                />
                            </form>
                            
                        )}                
                    </div>

                    {/* Modification du nom du cellier */ }

                    <div className="w-full sm:w-auto">
                        <p className="text-2xl mb-8 flex gap-2 items-center">Modifier le nom</p>
                        
                        <button className="sm:w-full sm:block inline-block text-lg cursor-pointer px-6 py-3 mb-10 border-[2px] border-solid border-[var(--couleur-accent)] text-[var(--couleur-accent)] hover:bg-[var(--couleur-accent)]  hover:text-white rounded-lg" onClick={() => setAfficherFormModifCellier(!afficherFormModifCellier)}>                        
                            {afficherFormModifCellier ? "Fermer" : "Modifier le nom"}
                        </button>
                        {afficherFormModifCellier && (
                            <form className="w-full flex flex-col sm:width-full space-y-4 p-4 bg-form rounded-lg" onSubmit={modifierNomCellier}>
                                <div className="flex flex-col mt-2">
                                    <select
                                        className="w-full p-3 mb-4 text-lg sm:text-xl rounded-sm bouton-accent text-white bg-transparent focus:outline-none"
                                        defaultValue=""
                                        onChange={e => {
                                            const id = e.target.value;
                                            setCellierSelectionne(id);

                                            const cellierSelectionne = celliers.find(c => c.id == id);
                                            if (cellierSelectionne) {
                                                setNomCellierModif(cellierSelectionne.nom);
                                            }
                                        }}
                                    >
                                        <option value="">Sélectionne un cellier</option>
                                        {celliers.map(c => (
                                            <option key={c.id} value={c.id}>{c.nom}</option>
                                        ))}
                                    </select>
                                    <input
                                    className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300"
                                    type="text"
                                    id="nomCellier"
                                    name="nom"
                                    placeholder="Ex. : Cellier du sous-sol"
                                    value={nomCellierModif}
                                    onChange={(e) => setNomCellierModif(e.target.value)}
                                    />
                                    {erreurs.nom && <p className="text-red-500 pt-2">{erreurs.nom[0]}</p>}
                                </div>                                
                                                               
                                <input
                                className="bouton-accent"
                                type="submit"
                                value="Mettre à jour"
                                />
                            </form>
                            
                        )}
                    
                    </div>

                    {/* Suppression d'un cellier */ }

                    
                    <div className="relative w-full sm:w-auto">
                        <p className="text-2xl mb-8 flex gap-2 items-center">Supprimer un cellier</p>
                        {messageSupprimerCellier && (
                            <p className="text-green-600 font-semibold mb-4">{messageSupprimerCellier}</p>
                        )}
                        <button className="sm:w-full sm:block inline-block text-lg px-6 py-3 mb-10 border-[2px] border-solid border-[var(--couleur-accent)] text-[var(--couleur-accent)] hover:bg-[var(--couleur-accent)] hover:text-white rounded-lg cursor-pointer" onClick={() => setAfficherFormSupprimerCellier(prev => prev === "supprimer" ? null : "supprimer")}>
                                
                            {afficherFormSupprimerCellier === "supprimer" ? "Fermer" : "Supprimer un cellier"}
                        </button>
                        {afficherFormSupprimerCellier === "supprimer" &&  (
                            <form className="w-full flex flex-col sm:width-full space-y-4 p-4 bg-form rounded-lg" onSubmit={(e) => {
                                e.preventDefault();
                                if (!cellierSelectionne) {
                                    setMessageSupprimerCellier("Sélectionne un cellier.");
                                    return;
                                }
                                setModalSupprimerCellierVisible(true);
                            }}>
                            
                                <div className="flex flex-col mt-2 ">
                                    <select
                                        className="w-full p-3 mb-4 text-lg sm:text-xl rounded-sm bouton-accent text-white bg-transparent focus:outline-none"
                                        defaultValue=""
                                        onChange={e => {
                                            const id = e.target.value;
                                            setCellierSelectionne(id);
                                            const cellierSelectionne = celliers.find(c => c.id == id);
                                            if (cellierSelectionne) {
                                                setNomCellierSup(cellierSelectionne.nom);
                                            }
                                        }}
                                    >
                                        <option value="">Choisi un cellier</option>
                                        {celliers.map(c => (
                                            <option key={c.id} value={c.id}>{c.nom}</option>
                                        ))}
                                    </select>
                                    <input
                                    className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300"
                                    type="text"
                                    id="nomCellier"
                                    name="nom"
                                    placeholder="Ex. : Cellier du sous-sol"
                                    value={nomCellierSup}
                                    onChange={(e) => setNomCellierSup(e.target.value)}
                                    />
                                    {erreurs.nom && <p className="text-red-500 pt-2">{erreurs.nom[0]}</p>}
                                </div>                       
                                <input
                                className="bouton-accent"
                                type="submit"
                                value="Supprimer le cellier"
                                />
                            </form>                            
                        )}                
                    </div>
                </div>

                {/* Fiche bouteille cellier mobile */}
                {produitSelectionne && (
                    <FicheProduitCellier
                        produit={produitSelectionne}
                        onFerme={() => setProduitSelectionne(null)}
                        onRetire={() =>
                        gestionRetraitBouteille(
                            produitSelectionne.cellierId,
                            produitSelectionne.id,
                            produitSelectionne.pivot.quantite
                        )
                        }
                    />
                    )}
                </div>
            {/* Modal succès et erreur*/}
                <ModalAjouter
                    visible={modalAjouterVisible}
                    messageAjout={messageAjout}
                    onFermer={() => setModalAjouterVisible(false)}
                />
                <ModalErreur
                    visible={modalErreurVisible}
                    erreurs={erreurs}
                    onFermer={() => setModalErreurVisible(false)}
                />
                {/* MODAL SUPPRIMER */}
                <ModalSupprimerCellier
                    visible={modalSupprimerCellierVisible}
                    h1="Supprimer ce cellier ?"
                    messageSupprimerCellier="Cette action est irréversible."
                    onAnnule={() => setModalSupprimerCellierVisible(false)}
                    onConfirme={supprimerCellier}
                    chargement={chargementSupprimer}                    
                />
        </div>
    );
    }

    export default AfficheCellier;