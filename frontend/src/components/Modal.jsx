import AppIcon from "./AppIcon";

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl p-7 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fade"
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">{title}</h3>
          <button onClick={onClose} className="bg-transparent border-none cursor-pointer text-gray-400 hover:text-gray-700 inline-flex">
            <AppIcon name="x" size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
