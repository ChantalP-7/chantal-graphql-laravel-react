import { Linkedin, Instagram, Github, Facebook } from "lucide-react";

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

        {/* Icônes */}
        <div className="flex justify-center gap-6 mt-6">
          <a href="#" aria-label="LinkedIn"><Linkedin className="w-6 h-6 hover:scale-110 transition" /></a>
          <a href="#" aria-label="GitHub"><Github className="w-6 h-6 hover:scale-110 transition" /></a>
          <a href="#" aria-label="Instagram"><Instagram className="w-6 h-6 hover:scale-110 transition" /></a>
          <a href="#" aria-label="Facebook"><Facebook className="w-6 h-6 hover:scale-110 transition" /></a>
        </div>

      </div>

      {/* NAVIGATION BAS */}
      <div className="border-t border-gray-300 shadow py-8">
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <a href="/" className="hover:text-red-700">Catalogue</a>
          <a href="/celliers" className="hover:text-red-700">Mes celliers</a>
          <a href="/compte" className="hover:text-red-700">Mon compte</a>
          <a href="/inscription" className="hover:text-red-700">Inscription</a>
          <a href="/connexion" className="hover:text-red-700">Connexion</a>
        </nav>
      </div>

      {/* BAS DE PAGE */}
      <div className="bg-red-950 text-white text-center py-4 text-xs sm:text-sm">
        © 2025 Vino — Tous droits réservés.
      </div>

    </footer>
  );
}
