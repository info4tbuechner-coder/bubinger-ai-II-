
import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

interface PromptSuggestionsProps {
    onSuggestionClick: (suggestion: string) => void;
    isKidsMode: boolean;
}

const suggestions = [
    "Erzähl mir einen Witz",
    "Erkläre Quantencomputing einfach",
    "Schreibe ein kurzes Gedicht über den Herbst",
    "Was ist die beste Reisezeit für Japan?",
];

const kidsSuggestions = [
    "Erzähl mir eine Tiergeschichte 🧸",
    "Was ist meine Lieblingsfarbe?",
    "Singe ein Lied über die Sonne ☀️",
    "Male mir einen lila Elefanten",
]

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSuggestionClick, isKidsMode }) => {
    
    const currentSuggestions = isKidsMode ? kidsSuggestions : suggestions;

    return (
        <div className="text-center py-10 animate-fade-in flex flex-col items-center justify-center h-full max-w-2xl mx-auto">
            <div className={cn(
                "bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 mb-6 shadow-xl shadow-indigo-500/20 border border-indigo-400/20 relative",
                isKidsMode && "transform scale-125 rounded-3xl from-amber-400 to-orange-500 shadow-amber-500/20 border-amber-300/20"
            )}>
               <Bot className={cn("text-white", isKidsMode ? "w-16 h-16" : "w-12 h-12")} />
               {isKidsMode && (
                   <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-200 animate-pulse" />
               )}
            </div>
            
            {isKidsMode ? (
                <div className="mb-8 space-y-2">
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 tracking-tight">
                       Hallo, ich bin Bubi!
                    </h1>
                    <p className="text-slate-300 text-lg font-medium">Wollen wir zusammen spielen?</p>
                </div>
            ) : (
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold text-slate-100 tracking-tight">
                        Bubinger-AI
                    </h1>
                    <p className="text-slate-400">Womit können wir heute beginnen?</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {currentSuggestions.map((text) => (
                    <button
                        key={text}
                        onClick={() => onSuggestionClick(text)}
                        className={cn(
                            "text-left transition-all duration-200 border",
                        isKidsMode 
                                ? "px-5 py-4 rounded-2xl glass-pane hover:bg-slate-700/80 border-slate-700 hover:border-amber-500/50 text-slate-200 text-base font-medium hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10" 
                                : "px-4 py-3 rounded-xl glass-pane hover:bg-slate-800/80 border-slate-700/50 hover:border-indigo-500/50 text-slate-300 text-sm hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/10"
                        )}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PromptSuggestions;