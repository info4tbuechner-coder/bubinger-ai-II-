import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronUp, ChevronDown, X, MoreVertical, Trash2, Download } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { cn } from '../utils/cn';

interface ChatHeaderProps {
    chatTitle: string;
    isSearchVisible: boolean;
    setIsSearchVisible: (visible: boolean) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResultsCount: number;
    currentResultIndex: number;
    onPrevResult: () => void;
    onNextResult: () => void;
    onClearChat: () => void;
    onExportChat: () => void;
}

const ChatPanelMenu: React.FC<{ onClearChat: () => void; onExportChat: () => void; }> = React.memo(({ onClearChat, onExportChat }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClearChatClick = () => {
        setIsConfirmOpen(true);
        setIsOpen(false);
    };
    
    const handleExport = () => {
        onExportChat();
        setIsOpen(false);
    }

    return (
        <>
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Chat-Optionen"
            >
                <MoreVertical className="w-5 h-5" />
            </button>
            {isOpen && (
                <div 
                  className="absolute top-full right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-fast origin-top-right"
                  role="menu"
                >
                    <div className="p-1" role="none">
                        <button
                            onClick={handleExport}
                            className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-md transition-colors"
                            role="menuitem"
                        >
                            <Download className="w-4 h-4 text-slate-400" />
                            <span>Chat exportieren</span>
                        </button>
                        <button
                            onClick={handleClearChatClick}
                            className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                            role="menuitem"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span>Chat leeren</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
        <ConfirmModal
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={onClearChat}
            title="Chat leeren"
            message="Möchten Sie wirklich alle Nachrichten in diesem Chat löschen? Diese Aktion kann nicht rückgängig gemacht werden."
        />
        </>
    );
});


const ChatHeader: React.FC<ChatHeaderProps> = ({
    chatTitle, isSearchVisible, setIsSearchVisible, searchQuery, setSearchQuery, 
    searchResultsCount, currentResultIndex, onPrevResult, onNextResult, onClearChat, onExportChat
}) => {
    const searchButtonRef = useRef<HTMLButtonElement>(null);
    
    const closeSearch = () => {
      setIsSearchVisible(false);
      setSearchQuery('');
      searchButtonRef.current?.focus();
    }

    return (
        <div className="flex-shrink-0 bg-transparent border-b border-slate-800/60 z-10">
            <div className="p-4 flex items-center justify-between">
                <h2 className="text-[15px] font-medium text-slate-200 truncate pr-4">{chatTitle}</h2>
                <div className="flex items-center gap-1">
                    <button 
                        ref={searchButtonRef}
                        onClick={() => setIsSearchVisible(prev => !prev)}
                        className={cn(
                            "p-2 rounded-lg transition-colors",
                            isSearchVisible ? "text-indigo-400 bg-indigo-500/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                        )}
                        aria-label="Im Chat suchen"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <ChatPanelMenu onClearChat={onClearChat} onExportChat={onExportChat} />
                </div>
            </div>
            
            <div className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden border-t border-slate-800/60 bg-slate-800/30",
                isSearchVisible ? "max-h-16 opacity-100" : "max-h-0 opacity-0 border-transparent"
            )}>
                <div className="p-2.5 flex items-center gap-2 max-w-3xl mx-auto">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Im Chat suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
                            autoFocus={isSearchVisible}
                        />
                    </div>
                    
                    <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg p-0.5">
                        <span className="text-xs font-medium text-slate-400 px-2 min-w-[3rem] text-center">
                            {searchQuery.length > 2 ? `${searchResultsCount > 0 ? currentResultIndex + 1 : 0}/${searchResultsCount}` : '0/0'}
                        </span>
                        <div className="w-px h-4 bg-slate-700 mx-0.5"></div>
                        <button onClick={onPrevResult} disabled={searchResultsCount === 0} className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-700 hover:text-slate-200 rounded-md transition-colors">
                            <ChevronUp className="w-4 h-4" />
                        </button>
                        <button onClick={onNextResult} disabled={searchResultsCount === 0} className="p-1 text-slate-400 disabled:opacity-30 hover:bg-slate-700 hover:text-slate-200 rounded-md transition-colors">
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <button onClick={closeSearch} className="p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 rounded-lg transition-colors ml-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatHeader;
