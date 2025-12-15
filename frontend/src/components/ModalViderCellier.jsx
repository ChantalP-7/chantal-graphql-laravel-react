
export default function ModalViderCellier({
  visible,
  cellier,
  onFermer,
  onVider
}) {
    if (!visible || !cellier) return null;

  const aBouteilles =
  cellier.produits?.some((p) => p.pivot?.quantite > 0) ?? false;

  const nbBouteilles =
    cellier.produits?.reduce(
      (total, p) => total + (p.pivot?.quantite || 0),
      0
    ) ?? 0;

  return (
    <div className="fixed inset-0 flex bg-white opacity-90 justify-center items-top pt-20 fade-in-modale">
      <div className="bg-white rounded-lg p-4 w-80 max-w-sm">
        <h2 className="text-lg font-bold mb-2">Supprimer {cellier.nom} ?</h2>

        {aBouteilles ? (
            <>
              <p className="mb-4">
                Ce cellier contient {nbBouteilles} bouteille
                {nbBouteilles > 1 ? "s" : ""}.
                Veux-tu les enlever du cellier ?
              </p>

              <button
                onClick={() => onVider(cellier.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Enlever et supprimer le cellier
              </button>
            </>
          ) : (
            <>
              <p className="mb-4 text-gray-600">
                Ce cellier ne contient aucune bouteille.
              </p>

              <button
                onClick={() => onVider(cellier.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Supprimer le cellier
              </button>
            </>
          )}

        <button
          onClick={onFermer}
          className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </div>
  );
}