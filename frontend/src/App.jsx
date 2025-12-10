import { Routes, Route} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";
// Pages
import Catalogue from "./pages/Catalogue";
import FicheProduit from "./pages/FicheProduit";
import Auth from "./pages/Auth";
import Inscription from "./pages/Inscription";
import AjouterProduitCellier from "./pages/AjouterProduitCellier";
import CreerCellier from "./pages/CreerCellier";
import ListeAchats from "./pages/ListeAchats";

// Composants
import Header from "./components/header";
import Footer from "./components/Footer";
import MenuMobile from "./components/MenuMobile";
import CompteUsager from "./components/CompteUsager";
import CellierUtilisateur from "./components/CellierUtilisateur";
import MotDePasseOublie from "./pages/MotDePasseOublie";

import "./App.css";

function App() {

  const [recherche, setRecherche] = useState(""); 

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header recherche={recherche} setRecherche={setRecherche} />

      {/* MAIN CONTENT */}
      <main className="pb-24 flex-1 px-4">
        <Routes>

          {/* Auth */}
          <Route path="/" element={<Auth />} />
          <Route path="/inscription" element={<Inscription />} />

          {/* Compte */}
          <Route path="/compte" element={<CompteUsager />} />

          {/* Produits */}
          <Route path="/produits" element={<Catalogue />} />
          <Route path="/produits/:id" element={<FicheProduit />} />

          {/* Liste d’achats */}
          <Route path="/liste-achats" element={<ListeAchats />} />

          {/* Celliers */}
           <Route path="/celliers" element={<CellierUtilisateur />} />
          <Route path="/user/:id/celliers" element={<CellierUtilisateur />} />
          <Route path="/cellier/creer" element={<CreerCellier />} />
          <Route
            path="/user/:userId/celliers/produits/:produitId"
            element={<AjouterProduitCellier />}
          />
          {/* Mot de passe oublié*/}
          <Route path="/mdp-oublie" element={<MotDePasseOublie />} />

        </Routes>
      </main>

      {/* FOOTER & MENU MOBILE */}
      <Footer />
      <MenuMobile />

    </div>
  );
}

export default App;
