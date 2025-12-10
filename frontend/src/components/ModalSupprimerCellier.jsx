const ModalSupprimerCellier = ({visible, h1, messageSupprimerCellier, onAnnule, onConfirme, chargement}) => {
    if (!visible) return null;

    return (
        <section className="fixed inset-0 bg-grey-700 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl text-red-800 border-b font-bold mb-4">{h1}</h1>
                <p className="mb-6"> {messageSupprimerCellier}</p>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded"
                        onClick={onAnnule}
                        disabled={chargement}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="px-3 py-1 bg-red-800 text-white hover:bg-red-900 rounded"
                        onClick={onConfirme}
                        disabled={chargement}
                    >
                        {chargement ? "Suppression..." : "Supprimer"}
                    </button>
                </div>
            </div>
        </section>
    );
};
 export default ModalSupprimerCellier;