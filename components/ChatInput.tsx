import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useToast } from '../contexts/ToastContext';
import type { ChatMessage } from '../types';
import { Paperclip, Mic, Globe, Send, Square, FileText, X } from 'lucide-react';
import { cn } from '../utils/cn';

const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;

interface FilePreviewProps {
    file: File;
    onRemove: () => void;
}

const FilePreview: React.FC<FilePreviewProps> = ({ file, onRemove }) => {
    return (
        <div className="relative group/file bg-slate-800/80 rounded-xl p-2 pr-8 flex items-center gap-2.5 border border-slate-700/50 animate-fade-in-fast shadow-sm">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-500/30">
                <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-xs text-slate-300 truncate min-w-0 max-w-[120px]">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
            <button 
                onClick={onRemove} 
                className="absolute top-1/2 right-2 -translate-y-1/2 p-1 bg-slate-700/50 hover:bg-red-500/20 hover:text-red-400 rounded-full text-slate-400 transition-colors"
            >
                <X className="w-3.5 h-3.5"/>
            </button>
        </div>
    );
};

interface ChatInputProps {
    isLoading: boolean;
    isStreaming: boolean;
    onSendMessage: (message: string, files: File[]) => void;
    onStopGeneration: () => void;
    inputText: string;
    onInputChange: (value: string) => void;
    isKidsMode: boolean;
    isWebSearchEnabled: boolean;
    onToggleWebSearch: () => void;
    onRegenerateResponse: () => void;
    onClearChat: () => void;
    messages: ChatMessage[];
}

const ChatInput: React.FC<ChatInputProps> = ({
    isLoading,
    isStreaming,
    onSendMessage,
    onStopGeneration,
    inputText,
    onInputChange,
    isKidsMode,
    isWebSearchEnabled,
    onToggleWebSearch,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();
    const { isListening, command, startListening, stopListening } = useSpeechRecognition();
    const [files, setFiles] = useState<File[]>([]);

    useEffect(() => {
        if (command) {
            onInputChange((prevText) => (prevText ? prevText + ' ' : '') + command.text);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [command]);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = `${Math.min(scrollHeight, 200)}px`;
        }
    }, [inputText]);
    
    const handleSendMessage = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if ((!inputText.trim() && files.length === 0) || isLoading || isStreaming) return;
        onSendMessage(inputText, files);
        setFiles([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            let validFiles = [...files];
            let errorShown = false;

            for (const file of newFiles) {
                if (validFiles.length >= MAX_FILES) {
                    if (!errorShown) addToast(`Sie können maximal ${MAX_FILES} Dateien hochladen.`, "error");
                    errorShown = true;
                    break;
                }
                const typedFile = file as File;
                if (typedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
                     if (!errorShown) addToast(`Datei "${typedFile.name}" ist größer als ${MAX_FILE_SIZE_MB}MB.`, "error");
                     errorShown = true;
                    continue;
                }
                validFiles.push(typedFile);
            }
            setFiles(validFiles.slice(0, MAX_FILES));
        }
        if(fileInputRef.current) fileInputRef.current.value = '';
    };
    
    const removeFile = (indexToRemove: number) => {
        setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="p-4 bg-transparent flex-shrink-0 z-10 relative">
            <div className="max-w-4xl mx-auto">
                {files.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2 px-2">
                        {files.map((file, i) => (
                            <FilePreview key={i} file={file} onRemove={() => removeFile(i)} />
                        ))}
                    </div>
                )}
                <div className={cn(
                    "glass-pane rounded-2xl transition-all",
                    "focus-within:focus-glow"
                )}>
                    <form onSubmit={handleSendMessage} className="flex items-end gap-2 p-2">
                        <div className="flex-shrink-0 flex items-center gap-1 self-end pb-1.5 pl-1">
                            {!isKidsMode && (
                                <>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*,text/*,.js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.cs,.go,.php,.rb,.rs,.swift,.kt,.kts,.html,.css,.scss,.less,.json,.xml,.yaml,.yml,.md,.sh,.bash,.sql"/>
                                    <button 
                                        type="button" 
                                        onClick={() => fileInputRef.current?.click()} 
                                        className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors" 
                                        aria-label="Datei anhängen"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={isListening ? stopListening : startListening} 
                                        className={cn(
                                            "p-2 rounded-xl transition-colors",
                                            isListening ? "text-red-400 bg-red-500/10 animate-pulse" : "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                                        )}
                                        aria-label="Spracheingabe"
                                    >
                                        <Mic className="w-5 h-5" />
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={onToggleWebSearch} 
                                        className={cn(
                                            "p-2 rounded-xl transition-colors",
                                            isWebSearchEnabled ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
                                        )}
                                        aria-label="Web-Suche umschalten"
                                    >
                                        <Globe className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <div className="flex-grow relative py-1">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                placeholder={isKidsMode ? "Frag Bubi etwas..." : "Nachricht an Bubinger-AI..."}
                                className="w-full bg-transparent text-slate-200 placeholder-slate-500 px-2 py-2 focus:outline-none text-[15px] resize-none max-h-[200px] min-h-[44px] leading-relaxed"
                                value={inputText}
                                onChange={(e) => onInputChange(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading || isStreaming}
                            />
                        </div>
                        
                        <div className="flex-shrink-0 self-end pb-1.5 pr-1">
                            {isStreaming ? (
                                <button 
                                    type="button" 
                                    onClick={onStopGeneration} 
                                    className="w-10 h-10 flex items-center justify-center bg-slate-700 text-slate-300 rounded-xl hover:bg-slate-600 hover:text-red-400 transition-all"
                                >
                                    <Square className="w-4 h-4 fill-current" />
                                </button>
                            ) : (
                                <button 
                                    type="submit" 
                                    disabled={(!inputText.trim() && files.length === 0) || isLoading} 
                                    className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-400 transition-all"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-500">KI kann Fehler machen. Überprüfe wichtige Informationen.</span>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;