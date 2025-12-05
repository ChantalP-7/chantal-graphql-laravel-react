// Importation des bibliothèques
import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Incription() {
  const [nom, setNom] = useState("");
  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [confirmationMdp, setConfirmationMdp] = useState("");
  const [erreurs, setErreurs] = useState({});

  const route = useNavigate();

//Empêcher le rechargement de la page
  const gererSoumission = async (e) => {
    e.preventDefault();

    // Connexion avec la requête du backend via axios
    try {
    const response = await api.post("/inscription", {
        name: nom,
        email: courriel,
        password: motDePasse,
        password_confirmation: confirmationMdp 
      });

      // Ajouter les props de l'objet et vider les champs après soumission
      setNom('')
      setCourriel('')
      setMotDePasse('')
      setConfirmationMdp('')
      setErreurs({})

      // Redirige vers la page de connexion avec message de succès
      route('/', {
        state:{message: response.data.message }
      })

      // Affiche les erreurs de validation
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErreurs(error.response.data.errors);
      }
    }
  };
  /*if (!connexion) return <div className="points">
        <span></span><span></span><span></span>
    </div>; */
  return (
    <section className="mt-30">
      <form className="flex flex-col space-y-4 px-4 py-4 bg-form rounded-lg w-full max-w-screen-sm mx-auto " onSubmit={gererSoumission}>
      <h1 className="text-4xl font-bold">Inscription</h1>
        <div className="flex flex-col mt-2 border-t border-gray-200 pt-5">
          <label className="text-brown" htmlFor="nom">Nom</label>
          <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
            type="text"
            id="nom"
            name="name"
            placeholder="Nom complet"
            value={nom}
            required
            onChange={(e) => setNom(e.target.value)} 
          />
          {erreurs.name && <p className="text-red-500 pt-2">{erreurs.name[0]}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-brown" htmlFor="courriel">Courriel</label>
          <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
            type="email"
            id="courriel"
            name="email"
            placeholder="Courriel"
            value={courriel}
            required
            onChange={(e) => setCourriel(e.target.value)} 
          />
          {erreurs.email && <p className="text-red-500 pt-2">{erreurs.email[0]}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-brown" htmlFor="motDePasse">Mot de passe</label>
          <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
            type="password"
            id="motDePasse"
            name="password"
            placeholder="Entrer un mot de passe"
            value={motDePasse}
            required
            onChange={(e) => setMotDePasse(e.target.value)}
          />
          {erreurs.password && <p className="text-red-500 pt-2">{erreurs.password[0]}</p>}
        </div>
        <div className="flex flex-col">
          <label className="text-brown" htmlFor="confirmationMptDePasse">Confirmation du mot de passe</label>
          <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
            type="password"
            id="confirmationMptDePasse"
            name="password_confirmation"
            placeholder="Entrer de nouveau le mot de passe"
            value={confirmationMdp}
            required
            onChange={(e) => setConfirmationMdp(e.target.value)}
          />
        </div>
        <input className="bouton-accent" type="submit" value="S'inscrire" />
       <Link className="underline mt-4 text-sm" to="/">Déjà inscrit? Se connecter</Link>
      </form>
   </section>
  );
}

