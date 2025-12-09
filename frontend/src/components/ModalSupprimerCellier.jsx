const ModalSupprimerCellier = ({visible, h1, messageSuppression,  onAnnule, onConfirme}) => {
    if (!visible) return null;

    return (
        <section className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h1 className="text-xl text-red-800 border-b font-bold mb-4">{h1}</h1>
                <p className="mb-6"> {messageSuppression}</p>
                <div className="flex justify-end gap-2">
                    <button type="button" className="px-3 py-1 bg-gray-300 hover:bg-gray-200 rounded cursor-pointer" onClick={onAnnule}>
                        Annuler
                    </button>
                    <button type="button" className="px-3 py-1 bg-red-800 text-white hover:bg-red-900 rounded cursor-pointer" onClick={onConfirme}>
                        Supprimer
                    </button>
                </div>
            </div>
        </section>
    );
}
 export default ModalSupprimerCellier;