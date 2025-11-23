import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

/**
 * Fonction qui affiche les détails d'un vin et qui affiche le formulaire d'ajout du vin sélectionné et qui permet d'ajouter le vin dans le cellier de l'utilisateur connecté. La quantité ajoutée est enregistrée dans la table pivot cellier_produit dans la colonne "quantite"
 * @param {*} param0 
 * @returns Retourne la fiche de détail d'un vin
 */
export default function FicheProduit({  }) {
    const { id } = useParams();
    const [produit, setProduit] = useState(null);
    const [celliers, setCelliers] = useState([]);
    const [cellierSelectionne, setCellierSelectionne] = useState(null);
    const [quantite, setQuantite] = useState(1); // valeur par défaut 1

    // Récupérer le produit
    useEffect(() => {
        axios.get(`http://localhost:8000/api/produits/${id}`)
            .then(res => setProduit(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // Récupérer les celliers de l'utilisateur
    useEffect(() => {
        const idUtilisateur = 1; // temporaire pour tester
        axios.get(`http://localhost:8000/api/users/${idUtilisateur}/celliers`)
            .then(res => {
                const listeCelliers = Array.isArray(res.data) ? res.data : [];
                setCelliers(listeCelliers);
                if (listeCelliers.length > 0) {
                    setCellierSelectionne(listeCelliers[0].id);
                }
            })
            .catch(err => console.error(err));
    }, []);

    /**
     * Fonction qui ajoute un vin dans un cellier à partir d'un formulaire d'ajoute. Possibilité d'incrémenter ou décrémenter la quantité avant de soumettre.
     * @returns retourne le vin ajouté au cellier
     */
    const ajouterProduit = () => {
        if (!produit || !cellierSelectionne) return;

        axios.post(`http://localhost:8000/api/celliers/${cellierSelectionne}/produits`, {
            produit_id: produit.id,
            quantite: quantite
        })
        .then(() => {
            alert(`Ajouté ${quantite} bouteille(s) au cellier !`);
            setQuantite(1); // reset à 1 après ajout
        })
        .catch(err => {
            console.error(err);
            alert("Erreur lors de l'ajout du produit.");
        });
    };

    if (!produit) return <p>Chargement...</p>;

    return (
        <div className="grilleBouteille grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            <div className="carteFicheBouteille w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
                <div className="carteColonne flex flex-col items-center">
                <img
                    className="imageBouteille w-full h-auto mb-4 rounded"
                    src={produit.image}
                    alt={produit.name}
                />
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                    Nom : {produit.name}
                </h1>
                <p className="text-md mb-1 text-lg sm:text-xl"><strong>Catégorie :</strong> {produit.identite_produit}</p>
                <p className="text-md mb-1 text-lg sm:text-xl"><strong>Millésime :</strong> {produit.millesime_produit}</p>
                <p className="text-md mb-1 text-lg sm:text-xl"><strong>Origine :</strong> {produit.pays_origine}</p>
                <p className="text-md mb-1 text-lg sm:text-xl"><strong>Prix :</strong> {Number(produit.price).toFixed(2)} $</p>
                </div>
            </div>
        <div className="carteFicheBouteille w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="carteColonne flex flex-col items-center">
            <img
                className="imageCarte w-full h-auto mb-4 rounded"
                src="../../public/images/wine-1802763_640.jpg"
                alt="Image cellier"
            />
            <h2 className="text-xl sm:text-2xl font-semibold mb-3">Choisi un cellier</h2>
            <select
                className="w-full text-lg sm:text-xl p-3 mb-4 rounded-sm bouton-vin text-white pr-8 focus:outline-none"
                value={cellierSelectionne || ''}
                onChange={e => setCellierSelectionne(e.target.value)}
            >
                {celliers.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
            </select>
            <div className="gap-sm w-full flex justify-center gap-[2px] mb-4">
                <button
                onClick={() => setQuantite(q => Math.max(0, q - 1))}
                className="text-xl text-center font-bold px-4 py-2 rounded bouton-rosee cursor-pointer border-white border-[2px]"
                >
                -
                </button>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={quantite}
                    onChange={e => {
                        const val = e.target.value.replace(/\D/g, "");
                        setQuantite(Math.max(1, Math.min(99, Number(val) || 1)));
                    }}
                    className="text-xl w-full text-lg sm:text-xl rounded-md bouton-rosee text-center border-white border-[2px]"
                    placeholder="0"
                    />
                <button
                onClick={() => setQuantite(q => Math.min(99, q + 1))}
                className="text-xl text-center text-lg sm:text-xl font-bold px-4 py-2 rounded bouton-rosee cursor-pointer border-white border-[2px]"
                >
                +
                </button>
            </div>
            <button
                onClick={ajouterProduit}
                className="w-full p-4 bouton-vin text-lg sm:text-xl text-white rounded cursor-pointer border-xs transition-colors"
            >
                Ajouter une bouteille
            </button>
            </div>
        </div>
    </div>
    );
}