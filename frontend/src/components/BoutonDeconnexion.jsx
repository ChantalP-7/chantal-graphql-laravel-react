import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Fonction déconnexion
export default function BoutonDeconnexion(){
    // recupérer le token
    const token = localStorage.getItem('token');
    const route = useNavigate();

    const deconnexion = async() => {
        try {
            const response = await api.post("http://localhost:8000/api/deconnexion",
                {},
                { headers: { Authorization: `Bearer ${token}`}}
            );
            // Supprimer du localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirectionner vers la page de connexion avec message de succès
            route('/connexion',{
                state:{deconnexionMsg: response.data.message}
            })
        } 
        catch (error) {
            console.error(error.response?.data|| error.message)    
        }
    };

    return (
        <button className="bg-red-950 text-white px-4 py-2 rounded-lg hover:bg-red-200 hover:text-red-950 transition" type="button" onClick={deconnexion}>Se déconnecter</button>
    );
}  