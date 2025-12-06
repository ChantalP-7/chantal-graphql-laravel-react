const ModaleAjouter = ({visible, message, onFermer}) => {
    if (!visible) return null;

    return (
        <section className="fixed inset-0 bg-white bg-opacity-80 flex justify-center items-center">
            <div className="bg--200 p-6 rounded-lg shadow-lg w-80">
                <p className="text-center text-blue text-bold text-2xl">{message}</p>
                <div className="flex justify-center gap-2">
                    <button
                        onClick={onFermer}
                        className="px-4 py-2 rounded bg-green-500 text-white"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </section>
    );
}
 export default ModaleAjouter;