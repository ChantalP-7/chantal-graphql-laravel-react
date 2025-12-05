import { Github } from "lucide-react";
import { Link } from "react-router-dom";
import GetUsager from "./GetUsager";
import GetToken from "./GetToken";

export default function Footer() {
  
  // Récupérer token et user depuis localStorage ou sessionStorage
  const token = GetToken
  const user = GetUsager();

  return (
    <footer className="mt-20 bg-stone-200 text-red-950">

      {/* SECTION HAUT — TITRE & DESCRIPTION */}
      <div className="text-center px-6 py-12 max-w-3xl mx-auto">

        <h2 className="text-4xl font-serif mb-4">Vino</h2>

        <p className="text-sm leading-relaxed mb-8">
         Découvrez, gérez et savourez vos bouteilles favorites.
          Suivez vos celliers, explorez votre collection et profitez pleinement de l’univers du vin.
        </p>

        {/* Icône GitHub */}
        <div className="flex justify-center mt-6">
          <Link
            to="https://github.com/Equipe-MCHNC/graphql-laravel-react"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub du projet"
            className="hover:scale-110 transition"
          >
            <Github className="w-8 h-8" />
          </Link>
        </div>

      </div>


      {/* NAVIGATION BAS */}
      <div className="border-t border-gray-300 shadow py-8">

      {/* SECTION LIENS NAVIGATION (dynamique selon état de connexion) */}
  
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">

          

          {/* === Connecté === */}
          {token && user && (
            <>
            <Link to="/produits" className="hover:text-red-700">Catalogue</Link>
              <Link to="/celliers" className="hover:text-red-800">Mes celliers</Link>
              <Link to="/compte" className="hover:text-red-800">Mon compte</Link>

              <button
                className="text-red-950 hover:text-red-700"
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

          {/* === Non connecté === */}
          {(!token || !user) && (
            <>
              <Link to="/inscription" className="hover:text-red-800">Inscription</Link>
              <Link to="/connexion" className="hover:text-red-800">Connexion</Link>
            </>
          )}

        </nav>
      </div>

      {/* BAS DE PAGE */}
      <div className="bg-red-950 text-white text-center py-4 text-xs sm:text-sm">
        © 2025 Vino — Tous droits reservés.
      </div>

    </footer>
  );
}
