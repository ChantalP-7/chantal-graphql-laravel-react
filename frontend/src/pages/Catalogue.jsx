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

console.log(localStorage.getItem("user"));

const bouteillesParPage = 12;

	// Quand un filtre est choisi, on met la page à 1
	useEffect(() => {
		setPageCourante(1);
	}, [filtre, ordre]);


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
					<div className="flexjustify-center align-center mt-auto">
						<Link className="block w-full" key={p.id} to={`/produit/${p.id}`}>			
							<button className="bouton-accent w-full flex items-center justify-center gap-2 " id="ajoutBouteille">
								Voir détail
								<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" Stroke="currentColor" color="#fff"><path StrokeLineCap="round" StrokeLineJoin="round" StrokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path StrokeLineCap="round" StrokeLineJoin="round" StrokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
								</svg>
							</button>
						</Link>
											
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
						className="px-4 py-2 bouton bouton-vin text-white rounded text-lg"
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
						className="px-4 py-2 rounded bouton bouton-vin text-white text-lg"
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
