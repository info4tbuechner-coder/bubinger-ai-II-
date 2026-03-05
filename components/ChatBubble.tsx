import React, { useMemo } from 'react';
import type { ChatMessage } from '../types';
import { Role } from '../types';
import { Bot, User, Copy, Pin, PinOff, Volume2, Square, AlertTriangle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import FileDisplay from './FileDisplay';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../utils/cn';

interface ChatBubbleProps {
  message: ChatMessage;
  isStreaming: boolean;
  searchQuery: string;
  isCurrentSearchResult: boolean;
  onRegenerateResponse: () => void;
  speak: (text: string, id: string) => void;
  cancel: () => void;
  isSpeaking: boolean;
  currentlySpeakingId: string | null;
  onToggleMessagePin: (messageId: string) => void;
}

const HighlightedText = ({ text, highlight }: { text: string, highlight: string }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
    }
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return (
        <>
            {parts.map((part, i) =>
                regex.test(part) ? (
                    <mark key={i} className="bg-yellow-400 dark:bg-yellow-600 text-black rounded px-1">
                        {part}
                    </mark>
                ) : (
                    <span key={i}>{part}</span>
                )
            )}
        </>
    );
};

const MarkdownRenderer = ({ content, searchQuery }: { content: string, searchQuery: string }) => {
    return (
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-pre:p-0 prose-pre:bg-transparent">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div className="rounded-md overflow-hidden my-4 border border-slate-700/50 glass-pane">
                                <div className="bg-slate-800/50 px-4 py-1.5 text-xs text-slate-300 flex justify-between items-center border-b border-slate-700/50">
                                    <span className="font-mono">{match[1]}</span>
                                </div>
                                <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ margin: 0, borderRadius: 0, background: 'transparent' }}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            </div>
                        ) : (
                            <code {...props} className={cn("bg-slate-800/60 border border-slate-700/50 text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono", className)}>
                                {children}
                            </code>
                        );
                    },
                    p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>;
                    }
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isStreaming,
  searchQuery,
  isCurrentSearchResult,
  onRegenerateResponse,
  speak,
  cancel,
  isSpeaking,
  currentlySpeakingId,
  onToggleMessagePin,
}) => {
  const { addToast } = useToast();
  const isUser = message.role === Role.USER;
  const isModel = message.role === Role.MODEL;
  const isSpeakingThis = currentlySpeakingId === message.id;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text).then(() => {
      addToast("Nachricht kopiert!", "success");
    }).catch(err => {
      addToast("Kopieren fehlgeschlagen.", "error");
      console.error(err);
    });
  };

  const bubbleRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isCurrentSearchResult) {
      bubbleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrentSearchResult]);

  return (
    <div
      ref={bubbleRef}
      className={`flex items-start gap-3 md:gap-4 my-4 animate-fade-in-slide-up ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isModel ? 'bg-indigo-600/20 border border-indigo-500/30' : 'bg-transparent'}`}>
          {isModel && <Bot className="w-5 h-5 text-indigo-400" />}
        </div>
      )}

      <div className={`group relative w-full max-w-xl lg:max-w-2xl xl:max-w-3xl ${isUser ? 'order-1 flex justify-end' : 'order-2'}`}>
        <div
          className={cn(
            "px-5 py-3.5 rounded-2xl transition-all duration-300 shadow-sm",
            isUser ? "bg-indigo-600/90 backdrop-blur-md border border-indigo-500/30 text-white rounded-tr-sm shadow-lg shadow-indigo-900/20" : "bg-slate-800/60 backdrop-blur-md border border-slate-700/50 text-slate-200 rounded-tl-sm shadow-lg",
            message.isError && "bg-red-500/10 border border-red-500/50",
            isCurrentSearchResult && "ring-2 ring-indigo-400 focus-glow"
          )}
        >
          {message.files && message.files.length > 0 && (
             <div className="mb-3 space-y-2">
                {message.files.map((file, index) => (
                    <FileDisplay key={index} file={file} isUserMessage={isUser} />
                ))}
             </div>
          )}
          {message.isError ? (
            <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-sm text-red-200">{message.text}</span>
            </div>
          ) : (
             <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
                 {message.text ? (
                     <MarkdownRenderer content={message.text} searchQuery={searchQuery} />
                 ) : (
                    isStreaming && (
                      <div className="flex space-x-1.5 h-6 items-center">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      </div>
                    )
                 )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className={cn(
            "absolute -bottom-10 flex items-center gap-1.5 transition-opacity duration-200",
            isUser ? "right-0" : "left-0",
            "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        )}>
          {isModel && !message.isError && message.text && (
            isSpeakingThis ? (
              <button onClick={cancel} className="p-1.5 text-slate-400 bg-slate-800 rounded-md hover:bg-slate-700 hover:text-red-400 transition-colors">
                <Square className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={() => speak(message.text, message.id)} className="p-1.5 text-slate-400 bg-slate-800 rounded-md hover:bg-slate-700 hover:text-slate-200 transition-colors">
                <Volume2 className="w-4 h-4" />
              </button>
            )
          )}
          {!message.isError && message.text && (
            <button onClick={handleCopy} className="p-1.5 text-slate-400 bg-slate-800 rounded-md hover:bg-slate-700 hover:text-slate-200 transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onToggleMessagePin(message.id)} className={cn(
            "p-1.5 bg-slate-800 rounded-md hover:bg-slate-700 transition-colors",
            message.isPinned ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
          )}>
            {message.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center order-2">
          <User className="w-5 h-5 text-indigo-400" />
        </div>
      )}
    </div>
  );
};
const MemoizedChatBubble = React.memo(ChatBubble);
export default MemoizedChatBubble;