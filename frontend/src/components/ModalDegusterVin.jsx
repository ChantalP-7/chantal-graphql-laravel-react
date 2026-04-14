import { useState } from "react";

export default function ModalDegusterVin ({
  visible,
  nbBouteilles,
  onFerme,
  soumettre
}) {
  
  const [nouveauNbBouteilles, setNouveauNbBouteilles] = useState(1);

  if (!visible) return null;
  
  const changerQuantite = (valeur) => {
    if (valeur < 1) return;
    if (valeur > nbBouteilles) return;

    setNouveauNbBouteilles(valeur);
  };
  
  return (
    <div className="fixed inset-0 flex bg-black-40 justify-center items-top pt-20 fade-in-modale">
      <div className="bg-white rounded-lg p-4 w-80 max-w-sm">
        {          
            <>
              <p className="mb-4">
                Ce cellier contient {nbBouteilles} bouteille{nbBouteilles > 1 ? "s" : ""}.                
              </p>
              <label className="block mb-2 font-semibold">
                Choisi le nombre de bouteilles pour déguster
              </label>
              <div className="flex justify-center items-center gap-2 mb-3">
                <button
                  onClick={() => changerQuantite(nouveauNbBouteilles - 1)}
                  className="bg-emerald-800 text-white px-2 rounded cursor-pointer"
                >
                  -
                </button>

                <input
                  type="number"
                  value={nouveauNbBouteilles}
                  onChange={(e) => {
                      let value = Number(e.target.value);
                      if (value < 1) value = 1;
                      if (value > nbBouteilles) value = nouveauNbBouteilles;
                      setNouveauNbBouteilles(value);
                      }}
                  className="w-16 text-center"
                />

                <button
                  onClick={() => changerQuantite(nouveauNbBouteilles + 1)}
                  className="bg-emerald-800 text-white px-2 rounded cursor-pointer"
                >
                  +
                </button>
              </div>
              
              <button
                className="w-full px-3 py-2 bg-emerald-800 text-white rounded disabled:opacity-60 hover:cursor-pointer"
                disabled={!nouveauNbBouteilles}
                onClick={() => soumettre(nouveauNbBouteilles)}
              >
                Je déguste 🍷
              </button>
            </>
        }

        <button
          onClick={onFerme}
          className="w-full mt-4 px-3 py-1 bg-gray-400 shadow-lg rounded hover:bg-gray-300 cursor-pointer"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
