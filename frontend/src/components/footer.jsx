import { Github } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  

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


      {/* BAS DE PAGE */}
      <div className="bg-red-950 text-white text-center py-4 text-xs sm:text-sm">
        © 2025 Vino — Tous droits reservés.
      </div>

    </footer>
  );
}
