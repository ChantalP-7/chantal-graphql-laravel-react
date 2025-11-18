import { Routes, Route } from "react-router-dom";
import Catalogue from "./pages/Catalogue";
import Product from "./pages/FicheProduit";
import Layout from "./components/Layout";
//import Login from "./pages/Login";
//import Register from "./pages/Register";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Catalogue />} />
        <Route path="/produit/:id" element={<Product />} />        
      </Routes>
    </Layout>
  );
}