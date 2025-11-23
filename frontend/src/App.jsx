import { Routes, Route } from "react-router-dom";
import Catalogue from "./pages/Catalogue";
import FicheProduit from "./pages/FicheProduit";
import CellierUtilisateur from "./components/cellierUtilisateur";
import Layout from "./components/Layout";
import "./App.css";
//import Login from "./pages/Login";
import Inscription from "./pages/Inscription";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/" element={<Catalogue />} />         
        <Route path="/produit/:id" element={<FicheProduit />} />      
        <Route path="/user/:id/celliers" element={<CellierUtilisateur />} />      
      </Routes>
    </Layout>
  );
}