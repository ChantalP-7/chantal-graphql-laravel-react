export default function ModalViderCellier({
  visible,
  cellierId,
  onFermer,
  celliers,
  cellierCibleId,
  setCellierCibleId,
  deplacerBouteilles
}) {
  if (!visible || !cellierId) return null;

  const cellier = celliers.find(c => c.id === cellierId);
  if (!cellier) return null;

  //const aBouteilles = cellier.produits?.some((p) => p.pivot?.quantite > 0) ?? false;
  const nbBouteilles = cellier.produits?.reduce(
    (total, p) => total + (p.pivot?.quantite || 0),
    0
  ) ?? 0;

  // Liste des celliers disponibles pour déplacer les bouteilles (différents du cellier courant)
  const celliersDisponibles = (celliers || []).filter(c => c.id !== cellier.id);

  return (
    <div className="fixed inset-35 flex bg-black-40 justify-center items-top pt-20 fade-in-modale">
      <div className="bg-white rounded-lg p-4 w-80 max-w-sm">
        {
          celliersDisponibles.length > 0 ? (
            <>
              <p className="mb-4">
                Ce cellier contient {nbBouteilles} bouteille{nbBouteilles > 1 ? "s" : ""}.                
              </p>
              <label className="block mb-2 font-semibold">
                Sélectionnez le cellier cible :
              </label>
              <select
                className="w-full px-2 py-1 border rounded mb-3 cursor-pointer"
                value={cellierCibleId || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setCellierCibleId(value ? Number(value) : null);
                }}
              >
                <option value="" className="cursor-pointer">Choisir un cellier cible</option>
                {celliersDisponibles.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nom}
                  </option>
                ))}
              </select>

              <button
                className="w-full px-3 py-2 bg-emerald-700 text-white rounded disabled:opacity-60 disabled:cursor-auto hover:cursor-pointer hover:bg-emerald-800"
                disabled={!cellierCibleId}
                onClick={() => deplacerBouteilles(cellier.id, cellierCibleId)}
              >
                Déplacer les bouteilles
              </button>
            </>
          
        ) : (
          <p className="mb-4 text-gray-600">
            Ce cellier ne contient aucune bouteille.
          </p>
        )}

        <button
          onClick={onFermer}
          className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
