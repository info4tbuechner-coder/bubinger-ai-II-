import React, { useEffect, useRef, useMemo } from 'react';
import type { ChatMessage, SearchResult } from '../types';
import MemoizedChatBubble from './ChatBubble';
import PromptSuggestions from './PromptSuggestions';
import { Bot, RefreshCw, Pin, PinOff } from 'lucide-react';
import { cn } from '../utils/cn';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isStreaming: boolean;
  isLoading: boolean;
  onRegenerateResponse: () => void;
  speak: (text: string, id: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  currentlySpeakingId: string | null;
  searchQuery: string;
  currentSearchResult: SearchResult | null;
  onToggleMessagePin: (messageId: string) => void;
  onSuggestionClick: (text: string) => void;
  isKidsMode: boolean;
  isSearchVisible: boolean;
}

const PinnedMessage: React.FC<{ message: ChatMessage, onToggleMessagePin: (id: string) => void }> = ({ message, onToggleMessagePin }) => (
    <div className="group flex items-center justify-between gap-3 p-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 cursor-pointer transition-colors" onClick={() => {
        const element = document.getElementById(`message-${message.id}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element?.classList.add('animate-highlight-pin');
        setTimeout(() => element?.classList.remove('animate-highlight-pin'), 1200);
    }}>
        <div className="flex items-center gap-2.5 min-w-0">
            <Pin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <p className="text-sm text-slate-300 truncate">
                <span className="font-medium text-slate-200">{message.role === 'user' ? 'Du' : 'KI'}:</span> <span className="opacity-90">{message.text}</span>
            </p>
        </div>
        <button 
            onClick={(e) => { e.stopPropagation(); onToggleMessagePin(message.id);}} 
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
            title="Pin entfernen"
        >
             <PinOff className="w-4 h-4" />
        </button>
    </div>
);

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isStreaming,
  isLoading,
  onRegenerateResponse,
  speak,
  cancel,
  isSpeaking,
  currentlySpeakingId,
  searchQuery,
  currentSearchResult,
  onToggleMessagePin,
  onSuggestionClick,
  isKidsMode,
  isSearchVisible,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (!isSearchVisible) {
      scrollToBottom('auto');
    }
  }, [messages.length, isStreaming, isSearchVisible]);

  const hasOnlyInitialMessage = useMemo(() => {
    return messages.length === 1 && messages[0].role === 'assistant';
  }, [messages]);

  const pinnedMessages = useMemo(() => messages.filter(m => m.isPinned), [messages]);
  const regularMessages = useMemo(() => messages, [messages]);

  const lastMessage = messages[messages.length - 1];
  const lastMessageIsError = lastMessage?.isError === true;
  const canRegenerate = !isLoading && !isStreaming && messages.some(m => m.role === 'model');

  return (
    <div className="flex-grow flex flex-col overflow-hidden relative">
        {pinnedMessages.length > 0 && !isKidsMode && (
            <div className="flex-shrink-0 p-3 border-b border-slate-700/50 bg-transparent z-10 shadow-sm">
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                  {pinnedMessages.map(msg => (
                      <PinnedMessage key={`pin-${msg.id}`} message={msg} onToggleMessagePin={onToggleMessagePin} />
                  ))}
                </div>
            </div>
        )}
        
        <div ref={chatContainerRef} className="flex-grow p-4 sm:p-6 overflow-y-auto custom-scrollbar scroll-smooth">
            <div className="max-w-4xl mx-auto">
                {hasOnlyInitialMessage ? (
                    <div className="h-full flex flex-col items-center justify-center min-h-[50vh]">
                        <PromptSuggestions onSuggestionClick={onSuggestionClick} isKidsMode={isKidsMode} />
                    </div>
                ) : (
                    <div className="space-y-6 pb-4">
                        {regularMessages.map((msg, index) => (
                            <div id={`message-${msg.id}`} key={msg.id} className="transition-all duration-300">
                                <MemoizedChatBubble
                                    message={msg}
                                    isStreaming={isStreaming && index === messages.length - 1}
                                    onRegenerateResponse={onRegenerateResponse}
                                    speak={speak}
                                    cancel={cancel}
                                    isSpeaking={isSpeaking}
                                    currentlySpeakingId={currentlySpeakingId}
                                    searchQuery={searchQuery}
                                    isCurrentSearchResult={currentSearchResult?.messageId === msg.id}
                                    onToggleMessagePin={onToggleMessagePin}
                                />
                            </div>
                        ))}
                        
                        {isLoading && !isStreaming && (
                            <div className="flex items-start gap-3 md:gap-4 my-4 justify-start animate-pulse">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-indigo-400" />
                                </div>
                                <div className="px-5 py-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50 rounded-tl-sm flex items-center h-[52px]">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {(lastMessageIsError || canRegenerate) && (
                            <div className="flex justify-center items-center pt-6 pb-2">
                                <button
                                    onClick={onRegenerateResponse}
                                    disabled={isLoading || isStreaming}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full transition-all",
                                        "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700",
                                        "disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                    )}
                                >
                                    <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                                    <span>Antwort neu generieren</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>
        </div>
    </div>
  );
};

export default ChatMessages;