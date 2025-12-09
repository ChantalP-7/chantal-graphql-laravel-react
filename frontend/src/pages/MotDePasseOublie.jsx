// Importations des bibliothèques
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";


const MotDePasseOublie = () => {
    const[courriel, setCourriel] = useState("");
    const[msgSucces, setMsgSuccess] = useState("");
    const[erreurs, setErreurs] = useState("");

    const gererSoumission = async (e) => {
        e.preventDefault();
        
        try {
            const response = await api.post('/mdp-oublie', {
                email: courriel,
            });

            setMsgSuccess(response.data.message || "Un email a été envoyé pour réinitialiser votre mot de passe.");
            setErreurs("");

        } catch (error) {
            if (error.response && error.response.data) {
                setErreurs(error.response.data.error || " Une erreur est survenue.")
            } else {
                setErreurs('Erreur serveur')
            }
            setMsgSuccess("");
        }
    }

    return (
    <section className="mt-30">
        {msgSucces ? (
            <p className="text-white bg-lime-700 p-4 m-2 rounded">{msgSucces} </p> 
        ) : erreurs && (
            <p className="text-white bg-red-700 p-4 m-2 rounded">{erreurs} </p>
        )}

      <form className="flex flex-col space-y-4 p-4 bg-form rounded-lg w-full max-w-screen-sm mx-auto" onSubmit={gererSoumission}>
        <h1 className="text-4xl font-bold">Mot de passe oublié</h1>
        <div className="flex flex-col mt-2 border-t border-gray-200 pt-5">
            <label className="text-brown" htmlFor="courriel">Courriel</label>
            <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="email"
                id="courriel"
                name="email"
                placeholder="Saisir votre courriel"
                value={courriel}
                required
                onChange={(e) => setCourriel(e.target.value)} 
            />
        </div>

        <input className="bouton-accent" type="submit" value="Envoyer" />
      <Link className="underline mt-4 text-sm" to="/">Retour à la connexion </Link>
      </form>
    </section>
    );
}
 export default MotDePasseOublie;