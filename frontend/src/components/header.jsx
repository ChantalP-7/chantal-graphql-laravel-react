import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import BoutonDeconnexion from './BoutonDeconnexion';

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [compteOuvert, setCompteOuvert] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  return (
    <>
      {/* ===== HEADER DESKTOP ===== */}
      <header className="bg-white py-4 px-6 shadow flex justify-between items-center">

        {/* LOGO */}
       <h2 className="text-3xl font-serif text-red-950">Vino</h2>

        {/* BARRE DE RECHERCHE */}
        {token && (
        <div className="hidden md:flex items-center w-1/4 bg-white rounded-full px-4 py-2 border border-red-950">
          <Search className="text-red-950 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher un vin..."
            className="ml-2 w-full bg-transparent focus:outline-none text-red-950"
          />
        </div>
        )}

        {/* ===== NAVIGATION DESKTOP ===== */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium">

         {token && (
  <Link to="/" className="hover:text-red-950 transition">
    Catalogue
  </Link>
)}

          {/* ===== SI CONNECTÉ ===== */}
          {token && user && (
            <>
              {/* Sous-menu Mon compte */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 hover:text-red-950"
                  onClick={() => setCompteOuvert(!compteOuvert)}
                >
                  Mon compte
                </button>

                {compteOuvert && (
                  <div className="absolute flex flex-col bg-white border shadow rounded mt-2 w-48 p-3 z-40">
                    <Link to="/compte" className="hover:text-red-950" onClick={() => setCompteOuvert(false)}>
                      Gérer mon compte
                    </Link>
                    <Link to="/celliers" className="hover:text-red-950" onClick={() => setCompteOuvert(false)}>
                      Mes celliers
                    </Link>
                    <Link to="/cellier/creer" className="hover:text-red-950" onClick={() => setCompteOuvert(false)}>
                      Ajouter un cellier
                    </Link>
                  </div>
                )}
              </div>

              {/* Déconnexion desktop */}
              <button
                className="bg-red-950 text-white px-4 py-2 rounded-lg hover:bg-red-200 hover:text-red-950 transition"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.reload();
                }}
              >
                Déconnexion
              </button>
            </>
          )}

          {/* ===== SI NON CONNECTÉ ===== */}
          {!token && !user && (
            <>
              <Link to="/inscription" className="bg-red-950 text-white px-4 py-2 rounded-lg hover:bg-red-200 hover:text-red-950 transition">
                Inscription
              </Link>

              <Link
                to="/connexion"
                className="bg-red-950 text-white px-4 py-2 rounded-lg hover:bg-red-200 hover:text-red-950 transition"
              >
                Connexion
              </Link>
            </>
          )}

        </nav>

        {/* Icône menu mobile */}
        <div className="md:hidden flex items-center">
          <button onClick={() => setMenuOuvert(true)}>
            <Menu className="w-7 h-7 text-red-950 cursor-pointer" />
          </button>
        </div>
      </header>

      {/* ===== MENU MOBILE ===== */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl p-6 z-50 transform transition-transform duration-300 md:hidden
        ${menuOuvert ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* En-tête menu mobile */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-serif text-red-950">
          Vino
        </h2>
          <button onClick={() => setMenuOuvert(false)}>
            <X className="w-8 h-8 text-red-950 cursor-pointer" />
          </button>
        </div>

        {/* Recherche mobile */}
        {token && (
        <div className="bg-white rounded-full px-4 py-2 flex items-center mb-8 border">
          <Search className="text-red-950 w-5 h-5" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="ml-2 w-full bg-transparent focus:outline-none text-red-950"
          />
        </div>
        )}

        {/* ===== NAVIGATION MOBILE ===== */}
        <nav className="flex flex-col gap-4 text-lg font-medium">

          {token && (
  <Link to="/" className="hover:text-red-950 transition">
    Catalogue
  </Link>
)}

          {/* SI CONNECTÉ */}
          {token && user && (
            <>
              {/* Sous-menu mobile */}
              <button
                onClick={() => setCompteOuvert(!compteOuvert)}
                className="flex justify-between w-full text-left hover:text-red-950"
              >
                Mon compte
                {compteOuvert ? <ChevronUp /> : <ChevronDown />}
              </button>

              {compteOuvert && (
                <div className="ml-4 flex flex-col gap-2">
                  <Link to="/compte" className="hover:text-red-950" onClick={() => setMenuOuvert(false)}>
                    Gérer mon compte
                  </Link>
                  <Link to="/celliers" className="hover:text-red-950" onClick={() => setMenuOuvert(false)}>
                    Mes celliers
                  </Link>
                  <Link to="/cellier/creer" className="hover:text-red-950" onClick={() => setMenuOuvert(false)}>
                    Ajouter un cellier
                  </Link>
                </div>
              )}

              {/* Déconnexion mobile */}
              <BoutonDeconnexion />
            </>
          )}

          {/* SI NON CONNECTÉ */}
          {!token && !user && (
            <>
              <Link
                to="/inscription"
                className="mt-4 bg-red-950 text-white text-center py-3 rounded-lg hover:bg-red-100 hover:text-red-950 transition"
                onClick={() => setMenuOuvert(false)}
              >
                Inscription
              </Link>

              <Link
                to="/connexion"
                className="mt-4 bg-red-950 text-white text-center py-3 rounded-lg hover:bg-red-100 hover:text-red-950 transition"
                onClick={() => setMenuOuvert(false)}
              >
                Connexion
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
}
