import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Fonction déconnexion
export default function BoutonDeconnexion(){
    const route = useNavigate();

    const deconnexion = async() => {
        try {
            const response = await api.post("/deconnexion");

            // Supprimer du localStorage et sessionStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

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
        <button className="bg-red-950 text-white text-center p-3 rounded-lg hover:text-red-950 hover:bg-red-100 text-red-950 transition" type="button" onClick={deconnexion}>Se déconnecter</button>
    );
}  