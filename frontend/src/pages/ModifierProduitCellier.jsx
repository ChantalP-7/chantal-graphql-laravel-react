import { useState, useEffect } from "react";
import axios from "axios";

function ModifierProduitCellier({ produit }) {

	const [produitLocal, setProduitLocal] = useState({
		name: produit.name,
		quantite: produit.quantite,
		millesime_produit: produit.millesime_produit,
		identite_produit: produit.identite_produit,
		pays_origine: produit.pays_origine,
		price: produit.price,
		image: produit.image
	});

	// Modification de l'affichage au clic
	const appliquerModification = () => {
		alert("Changements appliqués dans l’interface !");
		console.log("Nouveau produit local :", produitLocal);
	};

	return (
		<div className="p-4 flex flex-col gap-4">
			
			<img
				src={produitLocal.image}
				alt={produitLocal.name}
				className="w-full h-auto rounded"
			/>
		 
			<label className="font-bold">Nom :</label>
			<input
				type="text"
				value={produitLocal.name}
				onChange={e => setProduitLocal({ ...produitLocal, name: e.target.value })}
				className="border p-2 rounded w-full"
			/>
			
			<label className="font-bold">Quantité :</label>

			<div className="flex gap-2">
				<button
					onClick={() =>
						setProduitLocal(p => ({ ...p, quantite: Math.max(0, p.quantite - 1) }))
					}
					className="px-4 py-2 border rounded"
				>
					-
				</button>

				<input
					type="number"
					value={produitLocal.quantite}
					onChange={e =>
						setProduitLocal({ ...produitLocal, quantite: Number(e.target.value) })
					}
					className="border p-2 rounded w-20 text-center"
				/>

				<button
					onClick={() =>
						setProduitLocal(p => ({ ...p, quantite: p.quantite + 1 }))
					}
					className="px-4 py-2 border rounded"
				>
					+
				</button>
			</div>      
			<button
				onClick={appliquerModification}
				className="bg-purple-600 text-white p-3 rounded text-lg"
			>
				Appliquer à l'interface
			</button>
		</div>
	);
}

export default ModifierProduitCellier;