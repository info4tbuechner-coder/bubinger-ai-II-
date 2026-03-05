
import React from 'react';
import { useToast } from '../contexts/ToastContext';
import Toast from './Toast';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div 
            aria-live="assertive"
            className="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-50 space-y-3"
        >
            {toasts.map(toast => (
                <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
                    <Toast toast={toast} onRemove={removeToast} />
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
