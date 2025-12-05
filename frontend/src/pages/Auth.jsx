// importation des bibliothèques
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/axios";


export default function Auth() {
  const [courriel, setCourriel] = useState(localStorage.getItem('souvenir_courriel') || "");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [souvenirDeMoi, setSouvenirDeMoi] = useState(() => Boolean(localStorage.getItem('souvenir_courriel')));

  
  const route = useNavigate();
  const localisation = useLocation();
  
  // Récupérer les messages venant de BoutonDeconnexion.jsx et CompteUsager.jsx
  const deconnexionMsg = localisation.state?.deconnexionMsg;
  const msgCompteSupprime = localisation.state?.msgCompteSupprime;
  
  const [msgSucces, setMsgSucces] = useState(deconnexionMsg || msgCompteSupprime || "" );
  
  // Faire disparaitre message après 5 secondes
  useEffect(() =>{
    if (msgSucces) {
      const temps = setTimeout(() => {
        setMsgSucces("");
      }, 5000);
      return () => clearTimeout(temps)
    }
  }, [msgSucces]);
  
  const gererSoumission = async (e) => {
    e.preventDefault();
    
    // Connexion avec la requête du backend via axios
    try {
      const response = await api.post("/", {
        email: courriel,
        password: motDePasse,
        
      });

      // Selonle choix de l'usager, le token et les infos de l'usager seront conservés soit dans le LocalStorage ou sessionStorage
      if (souvenirDeMoi) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        
      } else {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
      }

      // Sauvegarder ou supprimer l'email selon "Se souvenir de moi"
      if (souvenirDeMoi) {
        localStorage.setItem('souvenir_courriel', courriel);
      } else {
        localStorage.removeItem('souvenir_courriel');
      }
      
      // Vider les champs après soumission
      setCourriel('')
      setMotDePasse('')
      setSouvenirDeMoi(false)
      setErreurs({})
      
      // Redirige vers la page catalogue
      route('/produits');
      
      // Affiche les erreurs de validation
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErreurs(error.response.data.errors);
      }
      else if(error.response && error.response.data.message){
        setErreurs({general: error.response.data.message});
      }
    }
  };  
  return (
    <section className="mt-30">
      {msgSucces &&(
        <p className="text-green-600 border p-4 m-2 rounded">{msgSucces} </p>  
      )}
      <form className="flex flex-col space-y-4 p-4 bg-form rounded-lg w-full max-w-screen-sm mx-auto" onSubmit={gererSoumission}>
        <h1 className="text-4xl font-bold">Se connecter</h1>
        <div className="flex flex-col mt-2 border-t border-gray-200 pt-5">
          {erreurs.general && <p className="text-red-600">{erreurs.general}</p>}
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

        <div className="flex items-center gap-2">
          <input className="w-4 h-4 checked:bg-blue-600"
           type="checkbox"
           checked={souvenirDeMoi}
           onChange={(e) => setSouvenirDeMoi(e.target.checked)} 
           />
          <label className=" text-sm" htmlFor="souvenirDeMoi">Se souvenir de moi</label>
        </div>

        <input className="bouton-accent" type="submit" value="Se connecter" />

        <Link className="underline mt-4 text-sm" to="/inscription">Pas encore membre? S'inscrire</Link>
        <Link className="underline text-sm" to="#">Mot de passe oublié?</Link>
      </form>
    </section>
  );
}
