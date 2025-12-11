import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import BoutonDeconnexion from "./BoutonDeconnexion";
import GetUsager from "./GetUsager";
import GetToken from "./GetToken";
import Recherche from "./Recherche";

export default function Header({deconnexion, recherche, setRecherche }) {

  const [menuOuvert, setMenuOuvert] = useState(false);
  const [compteOuvert, setCompteOuvert] = useState(false);

  const token = GetToken();
  const user = GetUsager();

  return (
    <>
      {/* ===== HEADER DESKTOP ===== */}
      <header className="bg-white py-4 px-6 shadow flex justify-between items-center">

        <h2 className="text-3xl font-serif titre"><img className="v-titre" src='/images/Vino_Rouge.png'></img>ino</h2>

        {/* BARRE DE RECHERCHE */}
        {token && (
        <div className="hidden md:flex items-center w-1/4">
          <Recherche recherche={recherche} setRecherche={setRecherche} />
        </div>
        )}

        {/* ===== NAVIGATION ===== */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">
          {token && (
            <Link to="/produits" className="hover:text-red-950 transition">
              Catalogue
            </Link>
          )}

          {token && (
            <Link to="/liste-achats" className="hover:text-red-950 transition">
                Mes Achats
            </Link>
          )}

          {token && user && (
            <>
              <div className="relative">
                <button
                  className="flex items-center gap-2 hover:text-red-950 cursor-pointer transition"
                  onClick={() => setCompteOuvert(!compteOuvert)}
                >
                  Mon compte
                </button>

                {compteOuvert && (
                  <div className="absolute flex flex-col bg-white border shadow rounded mt-2 w-48 p-3 z-40">
                    <Link to="/compte">Gérer mon compte</Link>
                    <Link to="/celliers">Mes celliers</Link>
                    <Link to="/cellier/creer">Ajouter un cellier</Link>
                  </div>
                )}
              </div>

              {/* Déconnexion desktop */}
              <BoutonDeconnexion deconnexion={deconnexion} />
            </>
          )}

          {!token && !user && (
            <>
              <Link to="/inscription" className="bg-red-950 text-white px-4 py-2 rounded-lg">
                Inscription
              </Link>
              <Link to="/" className="bg-red-950 text-white px-4 py-2 rounded-lg">
                Connexion
              </Link>
            </>
          )}
        </nav>

        {/* Menu mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOuvert(true)}>
            <Menu className="w-7 h-7 text-red-950 cursor-pointer" />
          </button>
        </div>
      </header>

      {/* MENU MOBILE */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl p-6 z-50 transform transition-transform duration-300 md:hidden ${
          menuOuvert ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif text-red-950">Vino</h2>
          <button onClick={() => setMenuOuvert(false)}>
            <X className="w-8 h-8 text-red-950 cursor-pointer" />
          </button>
        </div>

        {/* Recherche mobile */}
        {token && (
        <div className="flex md:hidden items-center w-full mt-4 mb-4 md:mt-0">
            <Recherche recherche={recherche} setRecherche={setRecherche} />
        </div>
        )}

        {/* NAV mobile */}
        <nav className="flex flex-col gap-4 text-lg font-medium">
          {token && <Link className="hover:text-lime-800" to="/produits">Catalogue</Link>}
          {token && <Link className="hover:text-lime-800" to="/liste-achats">Achats</Link>}
          
          {token && user && (
            <>
              <button
                onClick={() => setCompteOuvert(!compteOuvert)}
                className="flex justify-between w-full text-left mb-4"
              >
                Mon compte
                {compteOuvert ? <ChevronUp /> : <ChevronDown />}
              </button>

              {compteOuvert && (
                <div className="ml-4 mb-4 flex flex-col gap-2">
                  <Link className="hover:text-lime-800" to="/compte">Gérer mon compte</Link>
                  <Link className="hover:text-lime-800" to="/celliers">Mes celliers</Link>
                  <Link className="hover:text-lime-800" to="/cellier/creer">Ajouter un cellier</Link>
                </div>
              )}

              <BoutonDeconnexion deconnexion={deconnexion} />
            </>
          )}

          {!token && !user && (
            <>
              <Link to="/inscription"  className="bg-red-950 text-white text-center px-4 py-2 rounded-lg">Inscription</Link>
              <Link to="/" className="bg-red-950 text-white text-center px-4 py-2 rounded-lg">Connexion</Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
