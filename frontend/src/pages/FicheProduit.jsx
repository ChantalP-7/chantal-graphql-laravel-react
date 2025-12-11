import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import GetUsager from "../components/GetUsager"

/**
 * Fonction fléchée qui affiche les détails d'un vin et qui affiche le formulaire d'ajout du vin sélectionné et qui permet d'ajouter le vin dans le cellier de l'utilisateur connecté. La quantité ajoutée est enregistrée dans la table pivot cellier_produit dans la colonne "quantite"
 * @param {*} param0 
 * @returns Retourne la fiche de détail d'un vin
 */
 const FicheProduit = () => {
    const { id } = useParams();
    const [produit, setProduit] = useState(null); 

    const user = GetUsager();

       // Récupérer le produit
    useEffect(() => {
        api.get(`/produits/${id}`)
            .then(res => setProduit(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const ajouterALaListe = async (produitId) => {
        try {
            const response = await api.post(`/liste-achats/${produitId}`);

            console.log("Ajout réussi :", response.data);
            alert("Produit ajouté à votre liste d'achat !");
        } catch (err) {
            console.error("Erreur ajout liste d'achat :", err);
            alert("Impossible d'ajouter ce produit à votre liste.");
        }
    };

   {/* Animations 3 points pour le chargement de la page */}
   if (!produit) return <div className="points"> 
        <span></span><span></span><span></span>
    </div>

    return (
        
        <div className="container mx-auto p-4">
            <h1 className="text-center mt-20 text-4xl lg:text-5xl">Fiche détaillée</h1>
            <h1 className="text-center text-3xl md:text-4xl mt-5 mb-10"><strong>{produit.name}</strong></h1>
            <hr className="border-t-1 border-dashed bouton-[var(--couleur-texte)] mt-15 mb-15 my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="flex justify-center">            
                    <img className="w-sm sm:w-xsm" src={produit.image || 'https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png'}
                    alt={produit.name ? `Nom du vin ${produit.name}` : 'Nom du vin non disponible'} loading="lazy"/>
                </div>               
                <div className="flex flex-col mt-5 gap-4 h-full">
                    <ul className="space-y-2">
                        <li className="text-sm md:text-2xl text-[var(--couleur-text)] lg:text-3xl "><strong>Prix - </strong> {Number(produit.price).toFixed(2)} $</li>
                        <li className="text-sm md:text-xl lg:text-3lg "><strong>Catégorie - </strong> {produit.identite_produit}</li>
                        <li className="text-sm md:text-xl lg:text-3lg "><strong>Millésime - </strong> {produit.millesime_produit}</li>
                        <li className="text-sm md:text-xl lg:text-3lg "><strong>Origine - </strong> {produit.pays_origine}</li>
                    </ul>

                    <div className="flex gap-5 justify-left items-center ">
                        <Link className="block w-full" to={user ? `/user/${user.id}/celliers/produits/${produit.id}` : ""}>
                            <button className="mt-6 px-6 py-3 border-2 hover:border-[var(--couleur-text)] hover:text-[var(--couleur-text)] hover:bg-white rounded-lg bg-[var(--couleur-text)] text-white transition duration-300 cursor-pointer text-sm md:text-md lg:text-lg">Ajouter au cellier</button>
                        </Link>
                        <Link className="block w-full" to={user ? `/user/${user.id}/liste/produits/${produit.id}` : ""}>
                            <button
                                onClick={() => ajouterALaListe(produit.id)}
                                className="mt-6 px-6 py-3 border-2 hover:border-[var(--couleur-text)] hover:text-[var(--couleur-text)] hover:bg-white rounded-lg bg-[var(--couleur-text)] text-white transition duration-300 cursor-pointer text-sm md:text-md lg:text-lg"
                                >
                                    Ajouter à ma liste
                            </button>
                        </Link>

                    </div>
                </div>
                
            </div>
        </div>
        
    );
}

export default FicheProduit