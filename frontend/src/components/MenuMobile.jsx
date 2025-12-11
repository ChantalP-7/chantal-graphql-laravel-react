import { Wine, Columns4, Plus, User, ListChecks } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import GetUsager from "./GetUsager";
import GetToken from "./GetToken";

export default function MenuMobile() {
  const location = useLocation();

  // Récupérer connexion
  const token = GetToken();
  const user = GetUsager;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-red-950 border-t shadow-xl z-50 px-6">
      <ul className="flex justify-between items-center h-full">

        {/* ===== Accueil / Catalogue ===== */}
        {token && user && (
          <>
            <li className="flex-1 text-center">
              <Link
                to="/produits"
                className={`flex flex-col items-center ${
                  isActive("/produits") ? "text-white font-semibold" : "text-white opacity-70"
                }`}
              >
                <Wine className="w-7 h-7" />
                <span className="text-xs mt-1">Catalogue</span>
              </Link>
            </li>

            {/* ===== Mes celliers ===== */}
            <li className="flex-1 text-center">
              <Link
                to="/celliers"
                className={`flex flex-col items-center ${
                  isActive("/celliers") ? "text-white font-semibold" : "text-white opacity-70"
                }`}
              >
                <Columns4 className="w-7 h-7" />
                <span className="text-xs mt-1">Celliers</span>
              </Link>
            </li>

            {/* ===== Ajouter (bouton central) ===== */}
            <li className="flex-1 text-center">
              <Link
                to="/cellier/creer"
                className={`flex flex-col items-center ${
                  isActive("/cellier/creer") ? "text-white font-semibold" : "text-white opacity-70"
                }`}
              >
                <Plus className="w-8 h-8" />
                <span className="text-xs mt-1">Ajouter</span>
              </Link>
            </li>

            {/* ===== Compte ===== */}
            <li className="flex-1 text-center">
              <Link
                to="/compte"
                className={`flex flex-col items-center ${
                  isActive("/compte") ? "text-white font-semibold" : "text-white opacity-70"
                }`}
              >
                <User className="w-7 h-7" />
                <span className="text-xs mt-1">Compte</span>
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link to="/liste-achats"
                className={`flex flex-col items-center ${
                  isActive("/liste-achats") ? "text-white font-semibold" : "text-white opacity-70"
                }`}
              >
                < ListChecks className="w-7 h-7" />
                    <span className="text-xs mt-1">Achats</span>
              </Link>
            </li>
          </>
        )}

        {/* ===== Si NON connecté → montrer seulement “Compte” ===== */}
        {!token && !user && (
          <li className="flex-1 text-center">
            <Link
              to="/connexion"
              className="flex flex-col items-center text-red-900 opacity-80"
            >
              <User className="w-7 h-7" />
              <span className="text-xs mt-1">Connexion</span>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
