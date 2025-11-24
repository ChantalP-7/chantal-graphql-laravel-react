import { Linkedin, Instagram, Github, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20">
      
      {/* --- SECTION PRINCIPALE --- */}
      <div className="bg-orange-50 px-8 py-14 text-red-950">
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* --- COLONNE 1 --- */}
          <div>
            <h2 className="text-3xl font-serif mb-4">Vino</h2>
            <p className="text-sm mb-4">
              Vino est votre compagnon idéal pour découvrir, gérer et savourer vos bouteilles de vin.
              Explorez vos celliers, ajoutez vos découvertes et profitez d’une expérience unique.
            </p>

            <div className="flex gap-4 mt-4">
              <a href="#" aria-label="LinkedIn">
                <Linkedin className="w-6 h-6 hover:text-red-950" />
              </a>
              <a href="#" aria-label="GitHub">
                <Github className="w-6 h-6 hover:text-red-950" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-6 h-6 hover:text-red-950" />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook className="w-6 h-6 hover:text-red-950" />
              </a>
            </div>
          </div>

          {/* --- COLONNE 2 --- */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="/Catalogue" className="hover:text-red-950">Catalogue</a></li>
              <li><a href="/cellier" className="hover:text-red-950">Mes celliers</a></li>
              <li><a href="/compte" className="hover:text-red-950">Mon compte</a></li>
              <li><a href="/inscription" className="hover:text-red-950">Inscription</a></li>
              <li><a href="/connexion" className="hover:text-red-950">Connexion</a></li>
            </ul>
          </div>

          {/* --- COLONNE 3 --- */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-red-950">Contact</a></li>
              <li><a href="#" className="hover:text-red-950">Notre mission</a></li>
              <li><a href="#" className="hover:text-red-950">Politique de confidentialité</a></li>
              <li><a href="#" className="hover:text-red-950">Conditions d’utilisation</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* --- BARRE INFÉRIEURE --- */}
      <div className="bg-red-950 text-white text-center py-4 text-xs sm:text-sm">
        © 2025 Vino · Tous droits réservés
      </div>

    </footer>
  );
}
