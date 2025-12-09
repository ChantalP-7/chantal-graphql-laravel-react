import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000/api"; 
const getHeaders = (customHeaders = {}) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const headers = { "X-Requested-With": "XMLHttpRequest", 'Content-Type': 'application/json', ...customHeaders };
    if (token) { headers.Authorization = `Bearer ${token}`; }
    return headers;
};
const api = {
    get: async (endpoint) => {
        const url = `${API_BASE_URL}${endpoint}`;
        const response = await fetch(url, { method: 'GET', headers: getHeaders(), credentials: 'include' });
        if (!response.ok) { 
            const errorBody = await response.text();
            console.error(`Erreur API: ${response.status}`, errorBody);
            throw new Error(`Échec de la recherche: ${response.status}`);
        }
        return { data: await response.json() };
    },
};

export default function Recherche({ recherche, setRecherche }) {
    const [inputValue, setInputValue] = useState(recherche);
    const [resultatRecherche, setResultatRecherche] = useState([]);
    const [chargement, setChargement] = useState(false);

    useEffect(() => {
        if (recherche === "") {
            setInputValue("");
        }
    }, [recherche]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRecherche(inputValue);
        }, 500);

        return () => clearTimeout(timer);
    }, [inputValue, setRecherche]);

    useEffect(() => {
        if (recherche) {
            const fetchResults = async () => {
                setChargement(true);
                try {
                    // /produits selon le fichier api.php
                    const response = await api.get(`/produits?q=${encodeURIComponent(recherche)}`);
                    
                    setResultatRecherche(response.data.data || response.data); 
                } catch (error) {
                    console.error("Erreur lors de l'appel API de recherche:", error.message);
                    setResultatRecherche([]);
                } finally {
                    setChargement(false);
                }
            };

            fetchResults();
        } else {
            setResultatRecherche([]);
        }
    }, [recherche]); 

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };
    const handleClearSearch = () => {
        setInputValue("");
        setRecherche(""); 
    };

    return (
        <div className="flex flex-col w-full relative">
            <div className="flex items-center w-full relative">
                <input
                    type="search"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Rechercher par nom ou millésime"
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-red-950 focus:border-red-950 text-gray-900"
                />
                <svg
                    className="w-5 h-5 absolute left-3 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                    ></path>
                </svg>
                
                {chargement ? (
                    <div className="absolute right-3 p-1">
                        <svg className="animate-spin h-4 w-4 text-red-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                ) : inputValue && (
                    <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute right-3 p-1 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                )}
            </div>

            {recherche && !chargement && resultatRecherche.length > 0 && (
                <div className="contenuPreview absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl p-2 overflow-y-auto">
                    <p className="text-xs text-gray-500 mb-1">Résultats trouvés :</p>
                    {resultatRecherche.slice(0, 5).map((resulta, index) => (
                        <a 
                            key={index} 
                            href={`/produits/${resulta.id}`}
                        >
                            <div key={index} className="p-1 hover:bg-gray-50 cursor-pointer text-sm previewRecherche">
                                {resulta.name} <span className="previewAnne">{resulta.millesime_produit}</span>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
}