const ModalConfirmation = ({ visible, message, children, onFermer }) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        {message && <p className="text-center text-[var(--couleur-text)] text-bold text-2xl">{message}</p>}
        {children}
        {!children && <button onClick={onFermer} className="mt-4 bouton-accent">Fermer</button>}
      </div>
    </div>
  );
};

export default ModalConfirmation;