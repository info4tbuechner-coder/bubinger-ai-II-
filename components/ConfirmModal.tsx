import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in-fast p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="glass-pane rounded-2xl w-full max-w-md transform transition-all flex flex-col animate-fade-in-slide-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-500/10 border border-rose-500/20 sm:mx-0 sm:h-10 sm:w-10">
              <AlertTriangle className="h-5 w-5 text-rose-500" aria-hidden="true" />
            </div>
            <div className="mt-0 text-left">
              <h3 className="text-lg leading-6 font-semibold text-slate-100 tracking-tight" id="modal-title">
                {title}
              </h3>
              <div className="mt-2">
                <p className="text-sm text-slate-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end p-5 border-t border-slate-800 bg-slate-900/50 flex-shrink-0 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-5 py-2.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 shadow-lg shadow-rose-500/20"
            >
              Bestätigen
            </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
