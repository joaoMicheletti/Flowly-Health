interface ModalProps {
  title: string;

  isOpen: boolean;

  onClose: () => void;

  children: React.ReactNode;
}

export function Modal({
  title,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-500"
          >
            ✕
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}