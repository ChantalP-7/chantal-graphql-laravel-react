import { Routes, Route} from "react-router-dom";
import { useState } from "react";
import "./App.css";

// Pages
import Catalogue from "./pages/Catalogue";
import FicheProduit from "./pages/FicheProduit";
import Auth from "./pages/Auth";
import Inscription from "./pages/Inscription";
import AjouterProduitCellier from "./pages/AjouterProduitCellier";
import CreerCellier from "./pages/CreerCellier";
import ListeAchats from "./pages/ListeAchats";
import ReinitialiserMotDePasse from "./pages/ReinitialiserMotDePasse";
import MotDePasseOublie from "./pages/MotDePasseOublie";

// Composants
import Header from "./components/header";
import Footer from "./components/Footer";
import MenuMobile from "./components/MenuMobile";
import CompteUsager from "./components/CompteUsager";
import CellierUtilisateur from "./components/CellierUtilisateur";

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
          <Route path="/mdp-oublie" element={<MotDePasseOublie />} />
          <Route path="/mdp-reinitialise" element={<ReinitialiserMotDePasse />} />
          <Route path="/inscription" element={<Inscription />} />

          {/* Compte */}
          <Route path="/compte" element={<CompteUsager />} />

          {/* Produits */}
          <Route path="/produits" element={<Catalogue />} />
          <Route path="/produits/:id" element={<FicheProduit />} />

          {/* Celliers */}
          <Route path="/celliers" element={<CellierUtilisateur />} />
          <Route path="/user/:id/celliers" element={<CellierUtilisateur />} />
          <Route path="/cellier/creer" element={<CreerCellier />} />
          <Route path="/user/:userId/celliers/produits/:produitId" element={<AjouterProduitCellier />} />

          {/* Liste d’achats */}
          <Route path="/liste-achats" element={<ListeAchats />} />

        </Routes>
      </main>

      {/* FOOTER & MENU MOBILE */}
      <Footer />
      <MenuMobile />

    </div>
  );
}

export default App;
