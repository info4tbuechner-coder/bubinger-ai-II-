
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Copy, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface CodeBlockProps {
    className?: string;
    children?: React.ReactNode;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ className, children }) => {
    const { addToast } = useToast();
    const [isCopied, setIsCopied] = useState(false);

    if (children === null || children === undefined) {
        return null;
    }

    const textToCopy = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }).catch(() => {
            addToast("Kopieren fehlgeschlagen.", "error");
        });
    };

    return (
        <div className="relative group/code my-4 text-left rounded-xl overflow-hidden border border-slate-700/50 glass-pane shadow-sm">
            <div className="absolute top-2 right-2 flex items-center opacity-0 group-hover/code:opacity-100 transition-opacity duration-200 z-10">
                <button
                    onClick={handleCopy}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all backdrop-blur-sm",
                        isCopied 
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                            : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700 border border-slate-700"
                    )}
                    aria-label="Code kopieren"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Kopiert</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopieren</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 pt-10 overflow-x-auto text-sm custom-scrollbar">
                <code className={cn("text-slate-300 font-mono", className)}>
                    {children}
                </code>
            </pre>
        </div>
    );
};
