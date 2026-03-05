

import React, { useState, useMemo } from 'react';
import type { ChatSession, DashboardStats } from '../types';
import StatCard from './StatCard';
import { MessageSquare, User, Bot, Search, X, ArchiveX } from 'lucide-react';
import { groupSessionsByDate } from '../utils/time';
import SessionGroup from './SessionGroup';
import { cn } from '../utils/cn';

interface DashboardPanelProps {
  stats: DashboardStats;
  sessions: ChatSession[];
  activeSessionId: string;
  onSwitchSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onToggleSidebar: () => void;
  onTogglePinSession: (sessionId: string) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  stats, sessions, activeSessionId, onSwitchSession, onDeleteSession, onRenameSession, onToggleSidebar, onTogglePinSession
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSessions = useMemo(() => {
    return sessions.filter(session =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sessions, searchTerm]);
  
  const pinnedSessions = useMemo(() => {
    return filteredSessions.filter(s => s.isPinned).sort((a, b) => b.createdAt - a.createdAt);
  }, [filteredSessions]);

  const unpinnedSessions = useMemo(() => {
    return filteredSessions.filter(s => !s.isPinned).sort((a, b) => b.createdAt - a.createdAt);
  }, [filteredSessions]);

  const groupedSessions = useMemo(() => groupSessionsByDate(unpinnedSessions), [unpinnedSessions]);
  const groupOrder = ['Heute', 'Gestern', 'Letzte 7 Tage', 'Älter'];

  return (
    <div className="glass-pane lg:rounded-2xl p-4 sm:p-6 space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center flex-shrink-0">
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">Dashboard</h2>
        <button onClick={onToggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
           <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-shrink-0">
        <StatCard title="Nachrichten" value={stats.messageCount} icon={<MessageSquare className="w-5 h-5" />} />
        <StatCard title="Von Ihnen" value={stats.userMessages} icon={<User className="w-5 h-5" />} />
        <StatCard title="Von KI" value={stats.modelMessages} icon={<Bot className="w-5 h-5" />} />
      </div>

      <div className="flex flex-col min-h-0 space-y-4 flex-grow">
          <div className="flex-grow flex flex-col min-h-0 bg-transparent rounded-xl border border-slate-700/50 overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 flex-shrink-0 bg-transparent">
                <h3 className="text-sm font-semibold text-slate-300 mb-3 uppercase tracking-wider">Verlauf</h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    placeholder="Chats durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow text-sm"
                  />
                </div>
            </div>
            
            <div className="p-2 flex-grow overflow-y-auto custom-scrollbar">
              {filteredSessions.length > 0 ? (
                  <div className="space-y-4 p-2">
                    <SessionGroup
                        title="Gepinnt"
                        sessions={pinnedSessions}
                        isPinnedGroup
                        activeSessionId={activeSessionId}
                        onSwitchSession={onSwitchSession}
                        onDeleteSession={onDeleteSession}
                        onRenameSession={onRenameSession}
                        onTogglePinSession={onTogglePinSession}
                    />
                    {groupOrder.map(groupName => (
                        <SessionGroup
                            key={groupName}
                            title={groupName}
                            sessions={groupedSessions[groupName]}
                            activeSessionId={activeSessionId}
                            onSwitchSession={onSwitchSession}
                            onDeleteSession={onDeleteSession}
                            onRenameSession={onRenameSession}
                            onTogglePinSession={onTogglePinSession}
                        />
                    ))}
                  </div>
              ) : (
                <div className="text-center text-sm text-slate-400 p-8 flex flex-col items-center justify-center h-full gap-3">
                  <div className="p-3 bg-slate-800 rounded-full">
                    <ArchiveX className="w-8 h-8 text-slate-500" />
                  </div>
                  <p>Keine Chats gefunden.</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </div>
  );
};

export default DashboardPanel;