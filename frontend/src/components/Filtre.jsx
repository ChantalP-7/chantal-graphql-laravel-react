import { useEffect, useState, useRef } from "react";
import axiosClient from "../api/axios";

export default function Filtre({ filtre, setFiltre, ordre, setOrdre, setproduits }) {
	/*const [couleurs, setCouleurs] = useState([]);*/
	const [identites, setIdentites] = useState([]);
	const [open, setOuvert] = useState(false);
	const [openOrder, setOuvertOrdre] = useState(false);
	const dropdownRef = useRef(null);
	const orderDropdownRef = useRef(null);

	const lesFiltresOrdre = [
		"Millésime (Croissant)",
		"Millésime (Décroissant)",
		"Prix (Croissant)",
		"Prix (Décroissant)"
	];
	const ordreMap = {
		"Millésime (Croissant)": "anneeJeuneVieux",
		"Millésime (Décroissant)": "anneeVieuxJeune",
		"Prix (Croissant)": "prixBasHaut",
		"Prix (Décroissant)": "prixHautBas"
	};
/*
	useEffect(() => {
		axiosClient.get("/couleurs")
			.then(res => setCouleurs(res.data))
			.catch(err => console.error(err));
	}, []);
*/

	useEffect(() => {
		axiosClient.get("/identite_produit") 
			.then(res => setIdentites(res.data))
			.catch(err => console.error(err));
	}, []);

	useEffect(() => {
		if (!ordre) return;

		const key = ordreMap[ordre];

		setproduits(prev => {
			const sorted = [...prev];
			if (key === "anneeJeuneVieux") sorted.sort((a,b) => a.millesime_produit - b.millesime_produit);
			else if (key === "anneeVieuxJeune") sorted.sort((a,b) => b.millesime_produit - a.millesime_produit);
			else if (key === "prixBasHaut") sorted.sort((a,b) => a.price - b.price);
			else if (key === "prixHautBas") sorted.sort((a,b) => b.price - a.price);
			return sorted;
		});
	}, [ordre, setproduits]);


	// Detection de click hors du dropdown
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
				setOuvert(false);
			}
			else if (orderDropdownRef.current && !orderDropdownRef.current.contains(e.target)) {
				setOuvertOrdre(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<form className="formulaire_de_filtre" style={{ marginBottom: "1rem" }}>
			<div
				ref={dropdownRef}
				className={`custom-select ${open ? "open" : ""}`}
				onClick={() => setOuvert(!open)}
			>
				<div className="selected">{filtre || "Filtrez par identité"}</div>
				{open && (
					<ul className="options">
					{identites.map(i => (
						<li 
						key={i} 
						className="option" 
						onClick={(e) => { 
							e.stopPropagation(); 
							console.log('clicked identite:', i); 
							setFiltre(i); 
							setOuvert(false); 
						}}
						>
						{i}
						</li>
					))}
					</ul>
				)}
			</div>

			<div
				ref={orderDropdownRef}
				className={`custom-select ${openOrder ? "open" : ""}`}
				onClick={() => setOuvertOrdre(!openOrder)}
			>
				<div className="selected">{ordre || "Trier par"}</div>
				{openOrder && (
					<ul className="options">
						{lesFiltresOrdre.map(o => (
							<li
								key={o}
								className="option"
								onClick={() => { setOrdre(o); setOuvertOrdre(false); }}
							>
								{o}
							</li>
						))}
					</ul>
				)}
			</div>

		</form>
	);
}