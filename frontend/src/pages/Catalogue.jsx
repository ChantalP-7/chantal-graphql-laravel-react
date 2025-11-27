import { useEffect, useState } from "react";
import { getproduits } from "../api/produits";
import { Link } from "react-router-dom";
import Filtre from "../components/Filtre";


/**
 * @param
 * Fonction qui liste le catalogue de bouteilles 
 * @returns produits
 */
const Catalogue = () => {
const [produits, setproduits] = useState([]);
const [pageCourante, setPageCourante] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [filtre, setFiltre] = useState("");
const [ordre, setOrdre] = useState("asc");

// Obtenir les infos de l'usager 
const user = JSON.parse(localStorage.getItem("user"));
 
const bouteillesParPage = 12;

	useEffect(() => {
		getproduits(pageCourante, bouteillesParPage, filtre)
			.then((res) => {

				if (filtre) {
					setproduits(Array.isArray(res.data) ? res.data : res.data.data || []);
					setTotalPages(1);
				} else {
					setproduits(res.data.data || []);
					setTotalPages(res.data.last_page || 1);
				}
			})
			.catch((err) => console.error("Erreur API :", err));
	}, [pageCourante, filtre]);



	const prochainePage = () => {
		if (pageCourante < totalPages) setPageCourante(pageCourante + 1);
	};

	const pagePrecedente = () => {
		if (pageCourante > 1) setPageCourante(pageCourante - 1);
	};

  return (
	  <div className="contenu">
        <p className="flex justify-end mb-15 text-sm">{user ? `Bienvenue  ${user.name} !` : ""}</p>
		<h1 className="mt-10 mb-6 text-4xl text-bold text-center">Catalogue</h1>

	 <Filtre filtre={filtre} setFiltre={setFiltre} ordre={ordre} setOrdre={setOrdre} setproduits={setproduits}/>

		
		<div className="grilleBouteille">
			{Array.isArray(produits) && produits.map((p) => (
				
				<div className="carteBouteille" key={p.id}>
					<img className="imageBouteille" src={p.image} alt="Nom de l'image {p.name} "/>
					<div className="carteContenu">
					<h3 className="font-bold">{p.name}</h3>
					<p>{p.identite_produit}</p>
					<p>{Number(p.price).toFixed(2)} $</p>	
					<div className="flex justify-between align-center">
						<>
							<Link key={p.id} to={`/produit/${p.id}`}>			
								<button className="ajoutBouteille" id="ajoutBouteille"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" color="#000"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg><span></span>
								</button>
							</Link>
						</>
						<button className="ajoutBouteille" id="ajoutBouteille"><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#000"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg> <span></span>
						</button>
					</div>
					</div>
				</div>				
			))}			
		</div>
		{totalPages > 1 && (
			<div className="div-boutons flex justify-center items-center gap-4 mb-8 mt-8">
				<button
					onClick={pagePrecedente}
					disabled={pageCourante === 1}
					className="px-4 py-2 bouton bouton-vin text-white mt-50 mb-50 rounded text-lg disabled:text:gray"
				>
					<span className="boutonRosee">◀</span>
				</button>					
				<button className="px-4 py-2 rounded bouton bouton-vin text-white">
					{pageCourante}
				</button>					
				<span className=" text-lg">
					. . . sur {totalPages}
				</span>
				<button
					onClick={prochainePage}
					disabled={pageCourante === totalPages}
					className="px-4 py-2 rounded bouton bouton-vin text-white text-lg mt-50 mb-50 disabled:text-gray"
				>
					<span className="boutonRosee text-md">▶</span>
				</button>
			</div>
		)}
	</div>
  );
}

export default Catalogue
