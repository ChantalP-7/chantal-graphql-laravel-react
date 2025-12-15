export default function ModalErreur({ visible, messageErreur, onFermer, children }) {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-4 w-80 max-w-sm">
        <p className="mb-4">{messageErreur}</p>
        {children && <div className="mt-2">{children}</div>}
        <button
          onClick={onFermer}
          className="mt-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}