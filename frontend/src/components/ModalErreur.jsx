const ModaleErreur = ({visible, messageErreur, onFermer}) => {
    if (!visible) return null;

    return (
        <section className="fixed inset-0 flex bg-white opacity-90 justify-center items-top pt-20 fade-in-modale">
            <div className="bg--200 p-6 rounded-lg shadow-lg w-80">
                <p className="text-center text-[var(--couleur-text)] text-bold text-2xl">{messageErreur}</p>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={onFermer}
                        className="px-4 py-2 rounded bg-red-500 text-white"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </section>
    );
}
 export default ModaleErreur;