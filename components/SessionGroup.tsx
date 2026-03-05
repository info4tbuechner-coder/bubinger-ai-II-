import React, { useState } from 'react';
import type { ChatSession } from '../types';
import MemoizedHistoryItem from './HistoryItem';
import ConfirmModal from './ConfirmModal';
import { cn } from '../utils/cn';

interface SessionGroupProps {
    title: string;
    sessions: ChatSession[];
    activeSessionId: string;
    isPinnedGroup?: boolean;
    onSwitchSession: (sessionId: string) => void;
    onDeleteSession: (sessionId: string) => void;
    onRenameSession: (sessionId: string, newTitle: string) => void;
    onTogglePinSession: (sessionId: string) => void;
}

const SessionGroup: React.FC<SessionGroupProps> = ({
    title,
    sessions,
    activeSessionId,
    isPinnedGroup = false,
    onSwitchSession,
    onDeleteSession,
    onRenameSession,
    onTogglePinSession,
}) => {
    const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);

    if (sessions.length === 0) return null;
    
    const handleConfirmDelete = () => {
        if (sessionToDelete) {
            onDeleteSession(sessionToDelete.id);
        }
    };

    return (
        <div className="mb-6 last:mb-0">
            <h4 className={cn(
                "sticky top-0 px-3 py-2 text-xs font-bold uppercase tracking-wider z-10",
                "glass-pane rounded-lg mb-2 shadow-sm",
                isPinnedGroup ? "text-indigo-400 border border-indigo-500/20" : "text-slate-400 border border-slate-700/50"
            )}>
                {title}
            </h4>
            <div className="space-y-1.5 px-1">
                {sessions.map((session, index) => (
                    <MemoizedHistoryItem
                        key={session.id}
                        session={session}
                        isActive={session.id === activeSessionId}
                        onSelect={onSwitchSession}
                        onDelete={() => setSessionToDelete(session)}
                        onRename={onRenameSession}
                        onTogglePin={onTogglePinSession}
                        style={{ animationDelay: `${index * 30}ms` }}
                    />
                ))}
            </div>
            <ConfirmModal
                isOpen={!!sessionToDelete}
                onClose={() => setSessionToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Chat löschen"
                message={<>Möchten Sie den Chat "<strong>{sessionToDelete?.title}</strong>" wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.</>}
            />
        </div>
    );
};

export default React.memo(SessionGroup);
