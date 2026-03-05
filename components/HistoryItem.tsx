import React, { useState, useRef, useEffect } from 'react';
import type { ChatSession } from '../types';
import { formatRelativeTime } from '../utils/time';
import { Pencil, Trash2, Check, X, Pin, PinOff } from 'lucide-react';
import { cn } from '../utils/cn';

interface HistoryItemProps {
    session: ChatSession;
    isActive: boolean;
    onSelect: (sessionId: string) => void;
    onDelete: (sessionId: string) => void;
    onRename: (sessionId: string, newTitle: string) => void;
    onTogglePin: (sessionId: string) => void;
    style?: React.CSSProperties;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
    session,
    isActive,
    onSelect,
    onDelete,
    onRename,
    onTogglePin,
    style
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(session.title);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const handleRename = () => {
        if (title.trim() && title.trim() !== session.title) {
            onRename(session.id, title.trim());
        } else {
            setTitle(session.title);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleRename();
        } else if (e.key === 'Escape') {
            setTitle(session.title);
            setIsEditing(false);
        }
    };

    const handleSelect = () => {
        if (!isEditing) {
            onSelect(session.id);
        }
    };

    return (
        <div
            style={style}
            onClick={handleSelect}
            className={cn(
                "group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 border border-transparent",
                isActive 
                    ? "bg-indigo-500/20 border-indigo-500/30 shadow-md shadow-indigo-500/10" 
                    : "hover:bg-slate-800/40 hover:border-slate-700/40",
                "animate-fade-in-slide-up"
            )}
        >
            <div className="flex-grow min-w-0 pr-2">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-slate-900/50 border border-indigo-500/50 rounded px-2 py-1 text-sm font-medium text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                ) : (
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                            {session.isPinned && <Pin className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
                            <p className={cn(
                                "text-sm font-medium truncate",
                                isActive ? "text-indigo-100" : "text-slate-200 group-hover:text-white"
                            )}>
                                {session.title}
                            </p>
                        </div>
                        <p className={cn(
                            "text-xs",
                            isActive ? "text-indigo-300/70" : "text-slate-500 group-hover:text-slate-400"
                        )}>
                            {formatRelativeTime(session.createdAt)}
                        </p>
                    </div>
                )}
            </div>

            <div className="flex-shrink-0 flex items-center">
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <button onClick={handleRename} className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setIsEditing(false)} className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <div className={cn(
                        "flex items-center gap-0.5 transition-opacity duration-200",
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onTogglePin(session.id); }} 
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                session.isPinned 
                                    ? "text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20" 
                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                            )} 
                            title={session.isPinned ? 'Pin entfernen' : 'Anpinnen'}
                        >
                            {session.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-md transition-colors" 
                            title="Umbenennen"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(session.id); }} 
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors" 
                            title="Löschen"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const MemoizedHistoryItem = React.memo(HistoryItem);
export default MemoizedHistoryItem;