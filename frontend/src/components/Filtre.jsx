import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function Filtre({ filtre, setFiltre, ordre, setOrdre }) {
    const [identites, setIdentites] = useState([]);
    const [open, setOuvert] = useState(false);
    const [openOrder, setOuvertOrdre] = useState(false);
    const dropdownRef = useRef(null);
    const orderDropdownRef = useRef(null);
    const paysDropdownRef = useRef(null);
    const [pays, setPays] = useState([]);
    const [openPays, setOpenPays] = useState(false);
    const [filtreOuvert, setFiltreOuvert] = useState(false);

    const lesFiltresOrdre = [
        "Millésime (Croissant)",
        "Millésime (Décroissant)",
        "Prix (Croissant)",
        "Prix (Décroissant)"
    ];

    /* Lors que le site tente de trouver l'identité des produits */
    useEffect(() => {
        api.get("/identite_produit") 
            .then(res => setIdentites(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        api.get("/pays_origine").then(res => setPays(res.data));
    }, []);

    const handleClearIdentite = (e) => {
        e.stopPropagation();
        setFiltre(prev => ({ ...prev, identite: "" }));
        setOuvert(false);
    };

    const handleClearOrdre = (e) => {
        e.stopPropagation();
        setOrdre("");
        setOuvertOrdre(false);
    };

    const handleClearPays = (e) => {
        e.stopPropagation();
        setFiltre(prev => ({ ...prev, pays: "" }));
        setOpenPays(false);
    };

    if (!lesFiltresOrdre) return <div className="points">
        <span></span><span></span><span></span>
    </div>;

    return (
    <div className="boutonDropdown">
        <button 
            type="button" 
            onClick={() => setFiltreOuvert(!filtreOuvert)}
            className="dropdownDeDropdown bouton-filtre bg-lime-700"
        >
            {filtreOuvert ? "Cacher les filtres" : "Afficher les filtres"}
        </button>

        <div className={`filter-container ${filtreOuvert ? "open" : ""}`}>
            <form className="formulaire_de_filtre" style={{ marginBottom: "1rem" }}>
                
                <div
                    ref={dropdownRef}
                    className={`custom-select ${open ? "open" : ""}`}
                    onClick={() => setOuvert(!open)}
                >
                    <div 
                        className="selected"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>{filtre.identite || "Filtrez par identité"}</span>
                        {filtre.identite && (
                            <button 
                                type="button" 
                                onClick={handleClearIdentite}
                                style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--rouge_lecture)', fontWeight: 'bold' }}
                            >
                                X
                            </button>
                        )}
                    </div>

                    {open && (
                    <ul className="options">
                        {identites.map(i => (
                        <li 
                            key={i} 
                            className="option" 
                            onClick={(e) => { 
                            e.stopPropagation(); 
                            setFiltre(prev => ({ ...prev, identite: i }));
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
                    <div 
                        className="selected"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>{ordre || "Trier par"}</span>
                        {ordre && (
                            <button 
                                type="button" 
                                onClick={handleClearOrdre}
                                style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--rouge_lecture)', fontWeight: 'bold' }}
                            >
                                X
                            </button>
                        )}
                    </div>
                    {openOrder && (
                        <ul className="options">
                            {lesFiltresOrdre.map(o => (
                                <li
                                    key={o}
                                    className="option"
                                    onClick={(e) => { e.stopPropagation(); setOrdre(o); setOuvertOrdre(false); }}
                                >
                                    {o}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div
                    ref={paysDropdownRef}
                    className={`custom-select ${openPays ? "open" : ""}`}
                    onClick={() => setOpenPays(!openPays)}
                >
                    <div 
                        className="selected"
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                        <span>{filtre.pays || "Filtrer par pays"}</span>
                        {filtre.pays && (
                            <button 
                                type="button" 
                                onClick={handleClearPays}
                                style={{ marginLeft: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--rouge_lecture)', fontWeight: 'bold' }}
                            >
                                X
                            </button>
                        )}
                    </div>

                    {openPays && (
                        <ul className="options">
                            {pays.map(p => (
                                <li
                                    key={p}
                                    className="option"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setFiltre(prev => ({ ...prev, pays: p }));
                                        setOpenPays(false);
                                    }}
                                >
                                    {p}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>
        </div>
    </div>
    );
}