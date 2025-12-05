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
import AjouterProduitCellier from './pages/AjouterProduitCellier'; 
import "./App.css";
import { useEffect } from "react";
import api from "./api/axios"

function App() {
  useEffect(() => {
    // Configurer le header au démarrage si token existe
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pb-24 flex-1 px-4">
        {" "}
        {/* important pour ne pas cacher le contenu */}
        <Routes>
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/" element={<Auth />} />
          <Route path="/compte" element={<CompteUsager />} />
                 
          <Route path="/produits" element={<Catalogue />} />      
          <Route path="/produits/:id" element={<FicheProduit />} />

          <Route path="/user/:id/celliers" element={<CellierUtilisateur />} />
          <Route path="/cellier/creer" element={<CreerCellier />} />          
          <Route path="/user/:userId/celliers/produits/:produitId" element={<AjouterProduitCellier />} 
    />
          <Route path="/celliers" element={<CellierUtilisateur />} />
        </Routes>       
      </main>
      <Footer />
      <MenuMobile /> {/* ajout Menu application mobile */}
    </div>
  );
}

export default App;
