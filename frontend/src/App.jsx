import { useEffect, useState } from "react";
import api from "./api/axios";
import { Routes, Route } from "react-router-dom";
import Catalogue from "./pages/Catalogue";
import FicheProduit from "./pages/FicheProduit";
import CellierUtilisateur from "./components/CellierUtilisateur";
import Auth from "./pages/Auth";
import Inscription from "./pages/Inscription";
import CreerCellier from "./pages/CreerCellier";
import MenuMobile from "./components/MenuMobile";
import CompteUsager from "./components/CompteUsager";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AjouterProduitCellier from "./pages/AjouterProduitCellier";
import ListeAchats from "./pages/ListeAchats";

import "./App.css";

// Faire afficher les vues de react
function App() {

  useEffect(() => {
    // Configurer le header au démarrage si token existe
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  const [recherche, setRecherche] = useState(""); 
  
  return (
    <div className="min-h-screen flex flex-col">
    
      <Header recherche={recherche} setRecherche={setRecherche} />

      <main className="pb-24 flex-1 px-4">
        {/* important pour ne pas cacher le contenu */}
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Auth />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/compte" element={<CompteUsager />} />

          {/* Catalogue */}
          <Route path="/produits" element={<Catalogue />} />
          <Route path="/produits/:id" element={<FicheProduit />} />

          {/* Celliers */}
          <Route path="/user/:id/celliers" element={<CellierUtilisateur />} />
          <Route path="/cellier/creer" element={<CreerCellier />} />
          <Route
            path="/user/:userId/celliers/produits/:produitId"
            element={<AjouterProduitCellier />}
          />
          <Route path="/celliers" element={<CellierUtilisateur />} />

          {/* Liste d'achats */}
          <Route path="/liste-achats" element={<ListeAchats />} />
        </Routes>
      </main>

      <Footer />
      <MenuMobile /> {/* menu mobile persistent */}
    </div>
  );
}

export default App;
