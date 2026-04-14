import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Fonction déconnexion
export default function BoutonDeconnexion({setIsAuth}) {
    const route = useNavigate();

    const deconnexion = async() => {
        try {
            const response = await api.post("/deconnexion");

            // Supprimer du localStorage et sessionStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            // Mets à jour immédiatement le menu
                if (setIsAuth) setIsAuth(false);

            // Redirectionner vers la page de connexion avec message de succès
            route('/',{
                state:{deconnexionMsg: response.data.message}
            })
        } 
        catch (error) {
            console.error(error.response?.data|| error.message)    
        }
    };    
    return (
        <button className="bg-emerald-800 text-white text-center py-2 px-4 rounded-lg cursor-pointer hover:bg-lime-800 transition" type="button" onClick={deconnexion}>Se déconnecter</button>
    );
}  