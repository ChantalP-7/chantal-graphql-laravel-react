import { useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

 const CreerCellier = () => {
  
  const [nomCellier, setNomCellier] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState("");
  
  
  const gererSoumission = async (e) => {
    e.preventDefault();
    
    setErreurs({});
    setMessage("");
    
    // Vérifier côté front que le champ n'est pas vide
    //if (!nomCellier.trim()) {
      //setErreurs({ nom: "Le nom du cellier est requis." });
      //return;
    //}
    
    try {
      const reponse = await api.post("/celliers", { nom: nomCellier });
      
      setNomCellier("");
      setMessage(reponse.data.message || "Cellier créé avec succès !");    
      
      
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErreurs(error.response.data.errors);
      } else {
        setMessage("Une erreur est survenue lors de la création du cellier.");
      }
    }
  };

  //if (!nomCellier) return <div className="points">
        //<span></span><span></span><span></span>
    //</div>;


  return (
    <section className="mt-20">
      <form
      className="flex flex-col space-y-4 p-4 bg-form rounded-lg"
      onSubmit={gererSoumission}
      >
        <h1 className="text-4xl font-bold">Créer un cellier</h1>
      
        <div className="flex flex-col mt-2 border-t border-gray-200 pt-5">
          <label className="text-brown" htmlFor="nomCellier">
          Nom du cellier
          </label>
          <input
          className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-red-300 focus:ring-1 focus:ring-red-300"
          type="text"
          id="nomCellier"
          name="nom"
          placeholder="Ex. : Cellier du sous-sol"
          value={nomCellier}
          onChange={(e) => setNomCellier(e.target.value)}
          />
          {erreurs.nom && <p className="text-red-500 pt-2">{erreurs.nom[0]}</p>}
        </div>
      
        {message && (
          <p className="text-sm font-semibold text-green-700 pt-2">{message}</p>
        )}
      
        <input
        className="bouton-accent"
        type="submit"
        value="Créer le cellier"
        />
      
        <Link className="underline mt-4 text-sm" to="/celliers">
        Retour à mes celliers
        </Link>
      </form>
    </section>
  );
}

export default CreerCellier;
