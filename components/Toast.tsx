
import React, { useEffect, useState } from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../utils/cn';

interface ToastProps {
    toast: ToastMessage;
    onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleRemove = () => {
        setIsExiting(true);
    };

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onRemove(toast.id);
            }, 300); // Entspricht der Dauer der Ausblende-Animation
            return () => clearTimeout(timer);
        }
    }, [isExiting, onRemove, toast.id]);

    const getToastStyles = (type: ToastMessage['type']) => {
        switch (type) {
            case 'success':
                return {
                    container: 'glass-pane border-emerald-500/30 text-emerald-200 shadow-emerald-500/10',
                    icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
                    closeBtn: 'hover:bg-emerald-500/20 text-emerald-400/70 hover:text-emerald-300'
                };
            case 'error':
                return {
                    container: 'glass-pane border-rose-500/30 text-rose-200 shadow-rose-500/10',
                    icon: <AlertCircle className="w-5 h-5 text-rose-400" />,
                    closeBtn: 'hover:bg-rose-500/20 text-rose-400/70 hover:text-rose-300'
                };
            case 'info':
            default:
                return {
                    container: 'glass-pane border-blue-500/30 text-blue-200 shadow-blue-500/10',
                    icon: <Info className="w-5 h-5 text-blue-400" />,
                    closeBtn: 'hover:bg-blue-500/20 text-blue-400/70 hover:text-blue-300'
                };
        }
    };

    const styles = getToastStyles(toast.type);

    return (
        <div 
            className={cn(
                "w-full max-w-sm p-4 rounded-xl shadow-lg border flex items-start gap-3",
                "transition-all duration-300 ease-in-out transform",
                isExiting ? "opacity-0 translate-x-full scale-95" : "opacity-100 translate-x-0 scale-100",
                styles.container
            )}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                {styles.icon}
            </div>
            <div className="flex-1 text-sm font-medium leading-relaxed">
                {toast.message}
            </div>
            <button 
                onClick={handleRemove} 
                className={cn("p-1.5 rounded-lg transition-colors flex-shrink-0", styles.closeBtn)}
                aria-label="Benachrichtigung schließen"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;
