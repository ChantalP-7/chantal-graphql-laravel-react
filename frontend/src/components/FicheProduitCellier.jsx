import { useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import { MdOutlineDriveFileMove } from "react-icons/md";
import { PiWineFill } from "react-icons/pi";
import ModalDegusterVin from "./ModalDegusterVin";

/**
 * Fonction qui prend en paramètre un produit et les actions de fermer la fiche et de consommer le produit. En le consommant, cela veut dire que l'utilisateur boira ce vin. La quantité bue sera déduite.
 * @params {produit, nbBouteilles, selection, onFerme, onOuvre}
 * @returns Retourne la fiche de la bouteille sélectionnée et la possibilité de boire le vin, donc de diminuer la quantité*/



const FicheProduitCellier = ({ produit, nbBouteilles, onFerme, onBoit}) => {    
    if (!produit) return null;
    const [modalDegusterVin, setModalDegusterVin] = useState(false);    
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
            <p className="text-[var(--couleur-text)] mt-1 text-lg text-left mb-2"><strong>Nombre de bouteilles : </strong>{nbBouteilles}</p>
            <div className="flex flex-col md:justify-between gap-4 md:flex-row mt-10 mb-20 items-center small:block">                
                <button
                    onClick={() => setModalDegusterVin(true)}
                    className="flex items-center gap-2 border-1 border-transparent bg-cyan-800 text-white hover:bg-white hover:text-cyan-800 hover:border-cyan-800 p-4 py-2 rounded-lg text-sm md:text-md lg:text-lg cursor-pointer"
                    >
                    <PiWineFill className="text-2xl"/> Dégustation ++
                </button>
            </div>
            <ModalDegusterVin 
            visible={modalDegusterVin}
            nbBouteilles={nbBouteilles}
            onFerme={() => setModalDegusterVin(false)}
            soumettre={(quantite) => {
                onBoit(quantite);
                setModalDegusterVin(false);
            }}            
            />
                
        </div>
        </div>
    );
}

export default FicheProduitCellier;
