const ModaleAjouter = ({visible, messageAjout, onFermer}) => {
    if (!visible) return null;

    return (
        <section className="fixed inset-0 flex bg-white opacity-90 justify-center items-top pt-20 fade-in-modale">
            <div className="w-full p-6 rounded-lg shadow-lg w-80">                
                <div className="flex col justify-center gap-2">
                    <p className="text-center text-[var(--couleur-text)] font-bold text-2xl">{messageAjout}</p>
                    <button
                        onClick={onFermer}
                        className="px-4 py-2 rounded bg-[var(--couleur-text)] text-white cursor-pointer"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </section>
    );
}
 export default ModaleAjouter;