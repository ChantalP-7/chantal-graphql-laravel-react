import { FaChevronUp } from "react-icons/fa";

/**
 * Fonction qui prend en paramètre un produit et les actions de fermer la fiche et de consommer le produit. En le consommant, cela veut dire que l'utilisateur boira ce vin. La quantité bue sera déduite.
 * @params {produit, onFerme, onBoit}
 * @returns Retourne la fiche de la bouteille sélectionnée et la possibilité de boire le vin, donc de diminuer la quantité*/
const FicheProduitCellier = ({ produit, onFerme, onAjouteCellier, onAjouteListe }) => {
    if (!produit) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50">
        <div className="bg-white w-full rounded-t-2xl p-5  max-h-[85vh] overflow-y-auto shadow-lg">
            <div className="flex justify-center">
                <button onClick={onFerme} className="text-gray-900 text-xl mb-3 cursor-pointer hover:text-[var(--couleur-text)] hover:font-bold"><FaChevronUp /></button>
            </div>     
            <h2 className="text-2xl font-bold mb-2">{produit.name}</h2>            
            <p className="text-[var(--couleur-text)] mt-1 text-lg text-left"><strong>Millésime : </strong>{produit.millesime_produit}</p>
            <p className="text-[var(--couleur-text)] mt-1 text-lg text-left"><strong>Pays d'origine : </strong>{produit.pays_origine}</p>
            <p className="text-[var(--couleur-text)] mt-1 text-lg text-left mb-2"><strong>Type : </strong>{produit.identite_produit}</p>
            <button
            onClick={onAjouteCellier}
            className="w-full mt-3 bg-gray-800 hover:bg-white border-1 border-transparent hover:text-gray-800 hover:border-gray-800 p-4 text-white py-2 mb-15 rounded-lg text-sm md:text-lg lg:text-xl cursor-pointer"
            >
            Ajouter au cellier
            </button>
            <button
            onClick={onAjouteListe}
            className="w-full mt-3 bg-gray-800 hover:bg-white border-1 border-transparent hover:text-gray-800 hover:border-gray-800 p-4 text-white py-2 mb-15 rounded-lg text-sm md:text-lg lg:text-xl cursor-pointer"
            >
            Ajouter à ma liste
            </button>
        </div>
        </div>
    );
}

export default FicheProduitCellier;
