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
	const [filtre, setFiltre] = useState({ identite: null, pays: null });
	const [ordre, setOrdre] = useState("");

	// Obtenir les infos de l'usager 
	const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

	const bouteillesParPage = 12;

	useEffect(() => {
		setPageCourante(1);
	}, [filtre, ordre]);

	if (!user) {
	return <p>Veuillez vous connecter pour voir le catalogue.</p>
	}
	useEffect(() => {
		getproduits(pageCourante, bouteillesParPage, filtre, ordre)
			.then((res) => {
				// API retourne tjrs un objet (quand on load ou change de page) (res.data) 
				const data = res.data;
				
				setproduits(data.data || []); 
				setTotalPages(data.last_page || 1); 
			})
			.catch((err) => console.error("Erreur API :", err));
	}, [pageCourante, filtre, ordre]);
	const prochainePage = () => {
		if (pageCourante < totalPages) setPageCourante(pageCourante + 1);
	};
	const pagePrecedente = () => {
		if (pageCourante > 1) setPageCourante(pageCourante - 1);
	};

	const allALaPage = (page) => {
		setPageCourante(page);
	};

	{/* Animations 3 points pour le chargement de la page */}
	if (!produits) return <div className="points"> 
		<span></span><span></span><span></span>
	</div>;
  	return (
		<div className="contenu"> 
			<p className="flex justify-end mb-15 text-sm">{user && user.name ? `Bienvenue ${user.name} !` : ""}</p>
			<h1 className="mt-10 mb-6 text-4xl text-bold text-center">Catalogue</h1>
			<Filtre filtre={filtre} setFiltre={setFiltre} ordre={ordre} setOrdre={setOrdre} setproduits={setproduits}/>		
			<div className="grilleBouteille">
				{Array.isArray(produits) && produits.map((p) => (				
					<div className="carteBouteille" key={p.id}>
						<img className="imageBouteille" src={p.image || 'https://cdn.pixabay.com/photo/2012/04/13/11/49/wine-32052_1280.png'}
						alt={p.name ? `Nom du vin ${p.name}` : 'Nom du vin non disponible'}/>
						<div className="carteContenu">
							<h3 className="font-bold">{p.name} {p.millesime_produit}</h3>
							<p>{p.identite_produit} - {p.pays_origine}</p>
							<p className="font-bold">{Number(p.price).toFixed(2)} $</p>	
							<div className="carteBouton flex justify-between items-center">								
								<button className="bg-lime-700 border-transparent hover:bg-lime-800 p-2 rounded-md " id="ajoutBouteille">
									<Link className="block " to={`/produits/${p.id}`}>
										<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" color="#fff"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
									</Link>
								</button>
								<button className="bg-lime-700 border-transparent p-2 rounded-md hover:bg-lime-800 " id="ajoutBouteille">								
									<Link className="block" to={`/user/${user.id}/celliers/produits/${p.id}`}>
										<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" color="#fff"><path d="M0 0h24v24H0z" fill="none"></path><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>								
									</Link>
								</button>			
							</div>
						</div>
					</div>				
				))}			
			</div>
			{
			totalPages > 1 && (
				<div className="navigationCatalogue div-boutons flex justify-center items-center mb-8 mt-8">				
					{/* 1. Fleche gauge pas visible à la page 1*/}
					{pageCourante > 1 && (
						<button
							onClick={pagePrecedente}
							className="px-4 py-2 bouton bouton-vin rounded text-lg mr-5"
						>
							<span className="boutonRosee">◀</span>
						</button>
					)}
					{/* 2. Page 1 pas visible à la page 1 ou 2 */}
					{pageCourante !== 1 && (
						<button
							onClick={() => goToPage(1)}
							className="allALaPage"
						>
							1
						</button>
					)}
					{pageCourante > 3 && (
						<span className="text-lg">...</span>
					)}
					{pageCourante > 2 && (
						<button
							onClick={pagePrecedente}
							className="pagesuivante"
							
						>
							{pageCourante - 1}
						</button>
					)}
					<span className="pagerourante">
						{pageCourante}
					</span>
					
					{pageCourante < totalPages - 1 && (
						<button
							onClick={prochainePage}
							className="pagesuivante"
							
						>
							{pageCourante + 1}
						</button>
					)}
					{pageCourante < totalPages - 2 && (
						<span className="text-lg">...</span>
					)}
					{pageCourante !== totalPages && (
						<button
							onClick={() => goToPage(totalPages)}
							className="allALaPage"
						>
							{totalPages}
						</button>
					)}
					{pageCourante < totalPages && (
						<button
							onClick={prochainePage}
							className="px-4 py-2 rounded bouton bouton-vin text-lg ml-5"
						>
							<span className="boutonRosee text-md">▶</span>
						</button>
					)
				}
				</div>
			)}
		</div>
	);
}

export default Catalogue
