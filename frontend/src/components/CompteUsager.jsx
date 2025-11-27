import axios from "axios";
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
  const [msg, setMsg] = useState("");
  const [afficherForm, setAfficherForm] = useState(false); // toggle afficher/cacher le formulaire
  const [modalVisible, setModalVisible] = useState(false); // toggle afficher/cacher la boite modal 

  const route = useNavigate();

  // afficher info de l'usager
  useEffect(() => {
    axios.get("http://localhost:8000/api/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
      setUsager(res.data);
      setNom(res.data.name);
    })
    .catch(error => {
      setErreurs(error.response?.data?.message || "Erreur lors du chargement du profil");
    });
  }, []);

  if (!usager) return <div>Chargement...</div>;

  // Mettre à jour le profil
  const modifierInfos = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        "http://localhost:8000/api/user",
        {
          name: nom,
          current_password: mdpActuel,
          new_password: nouveauMdp,
          new_password_confirmation: confNouveauMdp
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }
      );
      // afficher les données de certains champs
      setUsager(res.data.user);
      setNom(res.data.user.name);
      setMdpActuel("");
      setNouveauMdp("");
      setConfNouveauMdp("");
      setAfficherForm(false); //cacher le formulaire après succès
      setErreurs({});
      setMsg(res.data.message);
      
      // faire disparaître le message après 5 secondes
      setTimeout(() => setMsg(""), 5000);

    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErreurs(error.response.data.errors);
      }
      else if(error.response && error.response.data.message){
        setMsg(error.response.data.message);
      }
    }
  };

  // Supprimer le compte
  const supprimerCompte = async () => {
    
    try {
      const res = await axios.delete("http://localhost:8000/api/user", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirige vers la page connexion avec message de succès
      route('/connexion', {
        state:{msgCompteSupprime: res.data.message }
      });

    } catch (error) {
      setErreurs(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  return (
    <section className="p-3 py-4">
      <div className="contenu">
        {msg && <p className="text-lime-700 mb-3">{msg}</p>}
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

            <button type="submit" className="bouton-edit mt-2">Enregistrer les modifications</button>
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
