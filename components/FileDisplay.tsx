
import React, { useState, useMemo } from 'react';
import type { ChatMessageFile } from '../types';
import { FileText, ChevronDown, Image as ImageIcon, FileCode } from 'lucide-react';
import { decodeDataUrlAsText, isCodeFileName } from '../utils/files';
import { CodeBlock } from './CodeBlock';
import { cn } from '../utils/cn';

interface FileDisplayProps {
    file: ChatMessageFile;
    isUserMessage: boolean;
}

const FileDisplay: React.FC<FileDisplayProps> = ({ file, isUserMessage }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const isImage = file.type.startsWith('image/');
    const isCodeFile = useMemo(() => isCodeFileName(file.name), [file.name]);
    const isTextFile = file.type.startsWith('text/') || isCodeFile;
    
    const content = useMemo(() => {
        if (isExpanded && isTextFile) {
            return decodeDataUrlAsText(file.dataUrl);
        }
        return null;
    }, [file.dataUrl, isTextFile, isExpanded]);
    
    const bgColor = isUserMessage 
        ? 'glass-pane border-indigo-500/30' 
        : 'glass-pane border-slate-700/50';

    if (isImage) {
        return (
            <div className={cn("rounded-xl overflow-hidden border shadow-sm group relative", bgColor)}>
                <img src={file.dataUrl} alt={file.name} className="max-w-full h-auto max-h-80 object-contain mx-auto" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="flex items-center gap-2 text-slate-200 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                        <ImageIcon className="w-4 h-4" />
                        <span className="text-xs font-medium truncate max-w-[150px]">{file.name}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isTextFile) {
        return (
            <div className={cn("rounded-xl overflow-hidden border shadow-sm transition-all duration-200", bgColor)}>
                <button 
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/30 transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-expanded={isExpanded}
                    aria-controls={`file-content-${file.name}`}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                            "p-2 rounded-lg",
                            isUserMessage ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700/50 text-slate-400"
                        )}>
                            {isCodeFile ? <FileCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <span className={cn(
                            "text-sm font-medium truncate",
                            isUserMessage ? "text-indigo-100" : "text-slate-200"
                        )}>
                            {file.name}
                        </span>
                    </div>
                    <div className={cn(
                        "p-1.5 rounded-md transition-colors",
                        isUserMessage ? "hover:bg-indigo-500/20 text-indigo-300" : "hover:bg-slate-700 text-slate-400"
                    )}>
                        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", isExpanded && "rotate-180")} />
                    </div>
                </button>
                {isExpanded && (
                    <div id={`file-content-${file.name}`} className={cn(
                        "px-3 pb-3 border-t",
                        isUserMessage ? "border-indigo-500/20" : "border-slate-700/50"
                    )}>
                        <div className="mt-3">
                            {isCodeFile ? (
                               <CodeBlock>{content}</CodeBlock>
                            ) : (
                               <pre className="text-sm text-slate-300 whitespace-pre-wrap break-words max-h-60 overflow-y-auto bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 custom-scrollbar">
                                   {content}
                               </pre>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
    
    // Fallback for other file types
    return (
        <div className={cn("rounded-xl p-3 flex items-center gap-3 border shadow-sm", bgColor)}>
            <div className={cn(
                "p-2 rounded-lg",
                isUserMessage ? "bg-indigo-500/20 text-indigo-400" : "bg-slate-700/50 text-slate-400"
            )}>
                <FileText className="w-4 h-4" />
            </div>
            <span className={cn(
                "text-sm font-medium truncate",
                isUserMessage ? "text-indigo-100" : "text-slate-200"
            )}>
                {file.name}
            </span>
        </div>
    );
};

export default FileDisplay;
