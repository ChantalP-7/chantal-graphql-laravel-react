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
    <>
    {token && user && (
    <nav className="fixed bottom-0 left-0 w-full h-16 bg-red-950 border-0.5 border-black shadow-xl z-50 px-6">
      <ul className="flex justify-between items-center h-full">

        {/* ===== Accueil / Catalogue ===== */}
            <li className="flex-1 text-center">
              <Link
                to="/produits"
                className={`flex flex-col items-center p-1.5 ${
                  isActive("/produits") ? "bg-white text-[var(--rouge_lecture)] hover:bg-white" : "text-white opacity-90"
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
                className={`flex flex-col items-center p-1.5 ${
                  isActive("/celliers") ? "bg-white text-[var(--rouge_lecture)] hover:bg-white" : "text-white opacity-90"
                }`}
              ><>
              <img src={`${
                  isActive("/celliers") ? "/images/bouteille-de-vin-bordeau.png" : "/images/bouteille-de-vin-blanc-24.png"}`}
                ></img>
              </>
                
                <span className="text-xs mt-1">Celliers</span>
              </Link>
            </li>

            {/* ===== Ajouter (bouton central) ===== */}
            <li className="flex-1 text-center">
              <Link
                to="/cellier/creer"
                className={`flex flex-col items-center p-1.5 ${
                  isActive("/cellier/creer") ? "bg-white text-[var(--rouge_lecture)] hover:bg-white" : "text-white opacity-90"
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
                className={`flex flex-col items-center p-1.5 ${
                  isActive("/compte") ? "bg-white text-[var(--rouge_lecture)] hover:bg-white" : "text-white opacity-90"
                }`}
              >
                <User className="w-7 h-7" />
                <span className="text-xs mt-1">Compte</span>
              </Link>
            </li>

            <li className="flex-1 text-center">
              <Link to="/liste-achats"
                className={`flex flex-col items-center p-1.5 ${
                  isActive("/liste-achats") ? "bg-white text-[var(--rouge_lecture)] hover:bg-white" : "text-white opacity-90"
                }`}
              >
                  <ListChecks className="w-7 h-7" />
                  <span className="text-xs mt-1">Liste vins</span>
              </Link>
            </li>
      </ul>
    </nav>
    )}
  </>
  );
}
