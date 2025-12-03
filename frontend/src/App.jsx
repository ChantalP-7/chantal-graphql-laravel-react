import { Routes, Route } from "react-router-dom";
import Catalogue from "./pages/Catalogue";
import FicheProduit from "./pages/FicheProduit";
import CellierUtilisateur from "./components/cellierUtilisateur";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import Inscription from "./pages/Inscription";
import CreerCellier from "./pages/CreerCellier";
import MenuMobile from "./components/MenuMobile";
import CompteUsager from "./components/CompteUsager";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="pb-24 flex-1 px-4">
        {" "}
        {/* important pour ne pas cacher le contenu */}
        <Routes>
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/compte" element={<CompteUsager />} />
          <Route path="/" element={<Catalogue />} />         

          <Route path="/produit/:id" element={<FicheProduit />} />      
          <Route path="/user/:id/celliers" element={<CellierUtilisateur />} />
          <Route path="/cellier/creer" element={<CreerCellier />} />
        
          <Route path="/produit/:id" element={<FicheProduit />} />
          <Route path="/celliers" element={<CellierUtilisateur />} />
        </Routes>       
      </main>
      <Footer />
      <MenuMobile /> {/* ajout Menu application mobile */}
    </div>
  );
}

export default App;
