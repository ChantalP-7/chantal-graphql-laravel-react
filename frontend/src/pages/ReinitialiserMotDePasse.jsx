// Importation des bibliothèques
import { useState } from "react";
import api from "../api/axios";
import { useSearchParams, Link } from "react-router-dom";

 
const ReinitialiserMotDePasse = () => {
    // Récupérer le id  et le token de l'usager dans le url
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("user");
    const token = searchParams.get("token");

    const[nouveauMdp, setNouveauMdp] = useState("");
    const[confirmationMdp, setConfirmationMdp] = useState("");
    const[msgSucces, setMsgSucces] = useState("");
    const[erreurs, setErreurs] = useState("");

   
    // Empêcher le rechargement de la page
    const gererSoumission = async (e) => {
        e.preventDefault();

        // Envoyer une requête au backend
        try {
            const response = await api.post('/mdp-reinitialise', {
                user: userId,
                token: token,
                password: nouveauMdp,
                password_confirmation: confirmationMdp,
            });

            // Récupérer le message de succès et vides les champs après soumission
            setMsgSucces(response.data.message);
            setErreurs("");
            setNouveauMdp("");
            setConfirmationMdp("");

        } catch (error) {
            
            if (error.response.status === 422 && error.response.data.errors) {
                setErreurs(error.response.data.errors); // Erreurs de validation

            } else if (error.response.data.erreur) {
                setErreurs({ general: error.response.data.erreur });// Erreurs personnalisées coté backend

            } else if (error.response.data.message) {
                setErreurs({ general: error.response.data.message });

            } else {
                setErreurs({ general: "Une erreur est survenue" });
            }
            setMsgSucces("");
        }

    }
    // Retourne un formulaire de réinitialisation avec mot de passe et confirmation du mot de passe
    return (
    <section className="mt-30">
        {msgSucces ? (
            <p className="text-white bg-green-600 p-4 m-2 rounded">{msgSucces} </p> 
        ) : erreurs?.general && (
            <p className="text-white bg-red-700 p-4 m-2 rounded">{erreurs.general} </p>
        )}
        <form className="flex flex-col space-y-4 p-4 bg-form rounded-lg w-full max-w-screen-sm mx-auto" onSubmit={gererSoumission}>
            <h1 className="text-4xl font-bold">Réinitialiser le mot de passe</h1>
            <div className="flex flex-col mt-2 border-t border-gray-200 pt-5">
                <label className="text-brown" htmlFor="motDePasse">Mot de passe</label>
                <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                    type="password"
                    id="motDePasse"
                    name="password"
                    placeholder="Entrer un mot de passe"
                    value={nouveauMdp}
                    required
                    onChange={(e) => setNouveauMdp(e.target.value)}
                />
                {erreurs?.password && <p className="text-red-500 pt-2">{erreurs.password[0]}</p>}
            </div>
            <div className="flex flex-col">
                <label className="text-brown" htmlFor="confirmationMdp">Confirmation du mot de passe</label>
                <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                    type="password"
                    id="confirmationMdp"
                    name="password_confirmation"
                    placeholder="Saisir de nouveau le mot de passe"
                    value={confirmationMdp}
                    required
                    onChange={(e) => setConfirmationMdp(e.target.value)}
                />
            </div>
            <input className="bouton-accent" type="submit" value="Enregistrer" />
            <Link className="underline mt-4 text-sm" to="/">Retour à la connexion </Link>
        </form>
    </section>
  );
}
export default ReinitialiserMotDePasse;