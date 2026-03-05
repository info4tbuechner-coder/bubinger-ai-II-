import React, { useState, useEffect, useRef } from 'react';
import type { AppMode } from '../types';
import { Bot, Settings, Plus, Sparkles, Volume2, VolumeX, Image as ImageIcon, MessageSquare, ChevronRight, UserCircle, LogOut } from 'lucide-react';
import { cn } from '../utils/cn';

interface HeaderProps {
    onNewChat: () => void;
    onOpenSettings: () => void;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    isAutoPlaybackEnabled: boolean;
    onToggleAutoPlayback: () => void;
    isKidsMode: boolean;
    onToggleKidsMode: () => void;
    appMode: AppMode;
    setAppMode: (mode: AppMode) => void;
    onLogout: () => void;
}

const UserMenu: React.FC<Pick<HeaderProps, 'onOpenSettings' | 'isAutoPlaybackEnabled' | 'onToggleAutoPlayback' | 'isKidsMode' | 'onToggleKidsMode' | 'onLogout'>> = ({
    onOpenSettings,
    isAutoPlaybackEnabled,
    onToggleAutoPlayback,
    isKidsMode,
    onToggleKidsMode,
    onLogout
}) => {
    const [isOpen, setIsOpen] = useState(false);
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

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={cn(
                    "p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all",
                    isOpen && "bg-slate-800 text-slate-200"
                )}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <UserCircle className="w-6 h-6" />
            </button>
            {isOpen && (
                 <div 
                  className="absolute top-full right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in-fast origin-top-right"
                  role="menu"
                >
                    <div className="p-1.5" role="none">
                        <button
                            onClick={() => { onOpenSettings(); setIsOpen(false); }}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                        >
                            <Settings className="w-4 h-4 text-slate-400" />
                            <span>Einstellungen</span>
                        </button>
                        <button
                            onClick={() => { onToggleAutoPlayback(); setIsOpen(false); }}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                        >
                            {isAutoPlaybackEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                            <span>Automatische Wiedergabe</span>
                        </button>
                         <button
                            onClick={() => { onToggleKidsMode(); setIsOpen(false); }}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-slate-100 rounded-lg transition-colors"
                        >
                            <Sparkles className={cn("w-4 h-4", isKidsMode ? "text-amber-400" : "text-slate-400")} />
                            <span>Kindermodus</span>
                        </button>
                        <div className="h-px bg-slate-700 my-1.5 mx-2"></div>
                        <button
                            onClick={() => { onLogout(); setIsOpen(false); }}
                            className="w-full text-left flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>Abmelden</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export const Header: React.FC<HeaderProps> = ({
    onNewChat,
    onOpenSettings,
    isSidebarOpen,
    onToggleSidebar,
    isAutoPlaybackEnabled,
    onToggleAutoPlayback,
    isKidsMode,
    onToggleKidsMode,
    appMode,
    setAppMode,
    onLogout
}) => {
    return (
        <header className="p-4 flex-shrink-0 z-20 relative">
            <div className="container mx-auto flex items-center justify-between glass-pane rounded-2xl px-4 py-3 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-2.5 shadow-lg shadow-indigo-500/20 border border-white/10">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300 hidden sm:block tracking-tight">
                        Bubinger-AI
                    </h1>
                </div>

                {!isKidsMode && (
                    <div className="absolute left-1/2 -translate-x-1/2 p-1 bg-slate-900/50 backdrop-blur-md rounded-full flex items-center gap-1 border border-slate-700/50 shadow-sm">
                       <button 
                            onClick={() => setAppMode('chat')} 
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-full flex items-center gap-2 transition-all",
                                appMode === 'chat' ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                           <MessageSquare className="w-4 h-4" />
                           <span className="hidden md:inline">Chat</span>
                       </button>
                        <button 
                            onClick={() => setAppMode('image')} 
                            className={cn(
                                "px-4 py-1.5 text-sm font-medium rounded-full flex items-center gap-2 transition-all",
                                appMode === 'image' ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                        >
                            <ImageIcon className="w-4 h-4" />
                           <span className="hidden md:inline">Bilder</span>
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <button
                        onClick={onNewChat}
                        className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors rounded-full"
                        aria-label="Neuer Chat"
                    >
                        <Plus className="w-6 h-6" />
                    </button>
                    
                    {!isKidsMode && (
                         <>
                            <UserMenu 
                                onOpenSettings={onOpenSettings}
                                isAutoPlaybackEnabled={isAutoPlaybackEnabled}
                                onToggleAutoPlayback={onToggleAutoPlayback}
                                isKidsMode={isKidsMode}
                                onToggleKidsMode={onToggleKidsMode}
                                onLogout={onLogout}
                            />
                            <button
                                onClick={onToggleSidebar}
                                className={cn(
                                    "p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors rounded-full hidden lg:inline-flex",
                                    isSidebarOpen && "bg-slate-800 text-slate-200"
                                )}
                                aria-label={isSidebarOpen ? "Seitenleiste schließen" : "Seitenleiste öffnen"}
                            >
                                <ChevronRight className={cn("w-6 h-6 transition-transform duration-300", isSidebarOpen ? "rotate-180" : "")} />
                            </button>
                        </>
                    )}
                     {isKidsMode && (
                        <button
                            onClick={onToggleKidsMode}
                            className={cn(
                                "p-2 transition-colors rounded-full",
                                isKidsMode ? "text-amber-400 hover:bg-amber-400/10" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                            )}
                            aria-label="Kindermodus verlassen"
                        >
                            <Sparkles className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};