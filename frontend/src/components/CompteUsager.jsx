import api from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalSupprimer from "./ModalSupprimer";


export default function CompteUsager() {
  const [usager, setUsager] = useState("");
  const [nom, setNom] = useState("");
  const [mdpActuel, setMdpActuel] = useState("");
  const [nouveauMdp, setNouveauMdp] = useState("");
  const [confNouveauMdp, setConfNouveauMdp] = useState("");
  const [erreurs, setErreurs] = useState({});
  const [msgSucces, setMsgSucces] = useState("");
  const [msgErreur, setMsgErreur] = useState("");
  const [afficherForm, setAfficherForm] = useState(false); // toggle afficher/cacher le formulaire
  const [modalVisible, setModalVisible] = useState(false); // toggle afficher/cacher la boite modal 

  const route = useNavigate();

  // afficher info de l'usager
  useEffect(() => {
    api.get("/user")
    .then(res => {
      setUsager(res.data);
      setNom(res.data.name);
    })
    .catch(error => {
      setErreurs(error.response?.data?.message || "Erreur lors du chargement du profil");
    });
  }, []);

  if (!usager) return 
  <div className="points">
    <span></span><span></span><span></span>
  </div>

  // Mettre à jour le profil
  const modifierInfos = async (e) => {
    e.preventDefault();

    try {
      const data = {
        name: nom
      };
      
      // Si l’utilisateur veut changer le mot de passe 
      if (nouveauMdp !== "") {
        data.current_password = mdpActuel;
        data.new_password = nouveauMdp;
        data.new_password_confirmation = confNouveauMdp;
      }

      const res = await api.put("/user", data);

      // afficher les données de certains champs
      setUsager(res.data.user);
      setNom(res.data.user.name);
      setMdpActuel("");
      setNouveauMdp("");
      setConfNouveauMdp("");
      setAfficherForm(false); //cacher le formulaire après succès
      setErreurs({});
      setMsgSucces(res.data.message);
      setMsgErreur("");
      
      // faire disparaître le message après 5 secondes
      setTimeout(() => setMsgSucces(""), 5000);

    } catch (error) {
      if (error.response?.data?.errors) {
        setErreurs(error.response.data.errors);
      }
      else if(error.response?.data?.message){
        setMsgErreur(error.response.data.message);
      }
    }
  };

  // Supprimer le compte
  const supprimerCompte = async () => {
    
    try {
      const res = await api.delete("/user");

      // Supprimer infos de tous storages
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      localStorage.removeItem("souvenir_courriel");

      // Redirige vers la page connexion avec message de succès
      route('/', {
        state:{msgCompteSupprime: res.data.message }
      });

    } catch (error) {
      setErreurs(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };
  
  return (
    <section className="p-4">
      <div className="contenu">
        {msgSucces && (
          <p className="text-lime-700 mb-4">{msgSucces}</p>
        )}
        <h1 className="text-2xl font-bold">Mon profil</h1>
        {/* --- AFFICHAGE DU PROFIL --- */}
        <div className="mb-10 mt-3">
          <p>Nom : <strong>{usager.name}</strong></p>
          <p>Courriel : <strong>{usager.email}</strong></p>
        </div>
        <div className="flex flex-col gap-2">
          <button className="bouton-edit" onClick={() => setAfficherForm(!afficherForm)}>
            {afficherForm ? "Fermer" : "Modifier mes infos"}
          </button>
          <button className="bouton-danger" onClick={() => setModalVisible(true)}>
            Supprimer mon compte
          </button>
        </div>
        {/* --- FORMULAIRE (affiché si afficherForm = true) --- */}
        {afficherForm && (
          <form className="flex flex-col space-y-4 px-4 py-4 bg-form rounded-lg w-full max-w-screen-sm mx-auto mt-6" onSubmit={modifierInfos}>
            <h1 className="text-2xl font-bold">Modifier mon compte</h1>
            <div className="flex flex-col mt-2 border-t border-gray-200 pt-5">
              {msgErreur && (
                <p className="text-red-600 mb-3">{msgErreur}</p>
              )}
              <label className="text-brown" htmlFor="nom">Nom</label>
              <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="text"
                id="nom"
                name="name"
                placeholder="Nom complet"
                value={nom}
                required
                onChange={(e) => setNom(e.target.value)} />
                {erreurs.name && <p className="text-red-500 pt-2">{erreurs.name[0]}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-brown" htmlFor="courriel">Courriel</label>
              <input className="px-2 py-1 bg-gray-200 cursor-not-allowed rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="email"
                id="courriel"
                name="email"
                placeholder="Courriel"
                value={usager.email}
                disabled/>
            </div>
            <div className="flex flex-col">
              <label className="text-brown" htmlFor="motDePasse">Mot de passe actuel</label>
              <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="password"
                id="motDePasse"
                name="current_password"
                value={mdpActuel}
                onChange={e => setMdpActuel(e.target.value)}
                placeholder="Laisser vide si pas de changement"/>
                {erreurs.current_password && <p className="text-red-500 pt-2">{erreurs.current_password[0]}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-brown" htmlFor="nouveauMdp">Nouveau mot de passe</label>
              <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="password"
                id="nouveauMpd"
                name="new_password"
                value={nouveauMdp}
                onChange={e => setNouveauMdp(e.target.value)}
                placeholder="Nouveau mot de passe"/>
                {erreurs.new_password && <p className="text-red-500 pt-2">{erreurs.new_password[0]}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-brown" htmlFor="confNouveauMdp">Confirmer nouveau mot de passe</label>
              <input className="px-2 py-1 bg-white rounded w-full focus:outline-none focus:border-green-200 focus:ring-1 focus:ring-green-200"
                type="password"
                id="confNouveauMpd"
                name="new_password_confirmation"
                value={confNouveauMdp}
                onChange={e => setConfNouveauMdp(e.target.value)}
                placeholder="Confirmez nouveau mot de passe"/>
            </div>

            <button type="submit" className="bouton-edit mt-4">Enregistrer les modifications</button>
          </form>
        )}
      </div>
       {/* MODAL SUPPRIMER */}
    <ModalSupprimer
      visible={modalVisible}
      onAnnule={() => setModalVisible(false)}
      onConfirme={() => {
        setModalVisible(false);
        supprimerCompte();
      }}
    />
    </section>
  );
}
