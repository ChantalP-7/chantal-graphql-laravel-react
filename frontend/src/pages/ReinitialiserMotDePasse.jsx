// Importation des bibliothèques
import { useState } from "react";
import api from "../api/axios";
import GetUsager from "../components/GetUsager";
import GetToken from "../components/GetToken";
 
const ReinitialiserMotDePasse = () => {

    const[nouveauMdp, setNouveauMdp] = useState("");
    const[confirmationMdp, setConfirmationMdp] = useState("");
    const[msgSucces, setMsgSucces] = useState("");
    const[erreurs, setErreurs] = useState("");

    const user = GetUsager();
    const token = GetToken();

    const gererSoumission = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/mdp-reinitialise', {
                password: nouveauMdp,
                user,
                token,
                confirmation_password:confirmationMdp,
            });

            setMsgSucces(response.data.message);
            setErreurs("");

        } catch (error) {
            if (error.response && error.response.data) {
                setErreurs(error.response.data.erreur || " Une erreur est survenue.")
            } else {
                setErreurs('Erreur serveur')
            }
            setMsgSucces("");    
            
        }
    }
    return (
    <section className="mt-30">
        {msgSucces ? (
            <p className="text-white bg-green-600 p-4 m-2 rounded">{msgSucces} </p> 
        ) : erreurs && (
            <p className="text-white bg-red-700 p-4 m-2 rounded">{erreurs} </p>
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
            {erreurs.password && <p className="text-red-500 pt-2">{erreurs.password[0]}</p>}
            </div>
            <div className="flex flex-col">
            <label className="text-brown" htmlFor="confirmationMdp">Confirmation du mot de passe</label>
            <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="password"
                id="confirmationMdp"
                name="confirmation_password"
                placeholder="Saisir de nouveau le mot de passe"
                value={confirmationMdp}
                required
                onChange={(e) => setConfirmationMdp(e.target.value)}
            />
            </div>
            <input className="bouton-accent" type="submit" value="Enregistrer" />
        </form>
    </section>
  );
}
 export default ReinitialiserMotDePasse;