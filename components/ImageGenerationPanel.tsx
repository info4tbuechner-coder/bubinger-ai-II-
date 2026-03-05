import React, { useState, useCallback } from 'react';
import { getAiService } from '../services/aiService';
import { useToast } from '../contexts/ToastContext';
import { Image as ImageIcon, Sparkles, XCircle, Download, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const ImageGenerationPanel: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToast } = useToast();
    const aiService = getAiService('gemini-2.5-flash');

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            addToast("Bitte geben Sie einen Prompt ein.", "info");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        try {
            const images = await aiService.generateImages(prompt);
            if (images && images.length > 0) {
                setGeneratedImages(images);
                addToast("Bilder erfolgreich generiert!", "success");
            } else {
                setError("Die KI konnte für diesen Prompt keine Bilder generieren. Versuchen Sie es anders.");
                 addToast("Keine Bilder generiert.", "info");
            }
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : "Ein unbekannter Fehler ist aufgetreten.";
            setError(errorMessage);
            addToast(`Fehler bei der Bildgenerierung: ${errorMessage}`, "error");
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aiService, addToast]);

    const handleDownload = (base64Image: string, index: number) => {
        const link = document.createElement('a');
        link.href = `data:image/jpeg;base64,${base64Image}`;
        const sanitizedPrompt = prompt.slice(0, 20).replace(/[^a-z0-9]/gi, '_').toLowerCase();
        link.download = `bubinger-ai-${sanitizedPrompt}-${index + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="glass-pane rounded-2xl flex flex-col h-full max-h-[calc(100vh-8rem)] overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 flex items-center gap-3 bg-slate-800/30">
                <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <ImageIcon className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-slate-100 tracking-tight">Bildgenerierung</h2>
            </div>
            
            <div className="flex-grow p-4 md:p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar">
                {/* Input Section */}
                <div className="flex-shrink-0">
                    <div className="bg-slate-800/40 rounded-xl border border-slate-700/50 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all p-3 shadow-inner">
                         <textarea
                            rows={3}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Beschreiben Sie das Bild, das Sie erstellen möchten... z.B. 'Ein Astronaut, der auf einem Oktopus im Weltraum reitet, im Stil von Van Gogh'"
                            className="w-full bg-transparent text-slate-200 placeholder-slate-500 rounded-lg p-2 focus:outline-none text-sm resize-none"
                            disabled={isLoading}
                        />
                        <div className="flex justify-end mt-2">
                            <button
                                onClick={handleGenerate}
                                disabled={isLoading || !prompt.trim()}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg transition-all text-sm font-medium shadow-md shadow-indigo-500/20",
                                    "hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5",
                                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-600 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                                )}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                <span>{isLoading ? 'Generiere...' : 'Generieren'}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Display Section */}
                <div className="flex-grow flex items-center justify-center rounded-xl bg-slate-800/20 border border-slate-700/30 min-h-[300px] overflow-hidden relative">
                    {isLoading ? (
                        <div className="text-center text-slate-400 flex flex-col items-center gap-5 animate-fade-in">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping"></div>
                                <div className="absolute inset-2 bg-indigo-500/30 rounded-full animate-pulse"></div>
                                <ImageIcon className="w-10 h-10 text-indigo-400 relative z-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="font-medium text-slate-200 text-lg">Ihre Vision wird Realität...</p>
                                <p className="text-sm text-slate-500 max-w-sm mx-auto">Dies kann einen Moment dauern. Die KI verwandelt Ihre Ideen gerade in Pixel.</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-rose-400 flex flex-col items-center gap-3 animate-fade-in p-6 bg-rose-500/5 rounded-2xl border border-rose-500/10 max-w-md">
                            <XCircle className="w-12 h-12 text-rose-500" />
                            <div className="space-y-1">
                                <p className="font-semibold text-rose-200 text-lg">Fehler bei der Generierung</p>
                                <p className="text-sm text-rose-400/80">{error}</p>
                            </div>
                        </div>
                    ) : generatedImages.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 animate-fade-in w-full h-full overflow-y-auto custom-scrollbar">
                            {generatedImages.map((img, index) => (
                                <div key={index} className="group relative rounded-xl overflow-hidden shadow-lg aspect-square border border-slate-700/50 bg-slate-800/50">
                                    <img src={`data:image/jpeg;base64,${img}`} alt={`Generiertes Bild ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                     <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <button 
                                            onClick={() => handleDownload(img, index)}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all transform hover:scale-105 hover:shadow-lg"
                                        >
                                            <Download className="w-5 h-5"/>
                                            <span className="font-medium">Download</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center text-slate-400 flex flex-col items-center gap-5 p-6 max-w-md">
                            <div className="relative">
                                <div className="p-5 bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-inner">
                                    <ImageIcon className="w-12 h-12 text-slate-500" />
                                </div>
                                <div 
                                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center"
                                >
                                    <Sparkles className="w-4 h-4 text-white animate-pulse"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-slate-200 text-xl tracking-tight">Starten Sie Ihre kreative Reise</p>
                                <p className="text-sm text-slate-500 leading-relaxed">Beschreiben Sie eine Szene, eine Idee oder einen Traum im Textfeld oben, und die KI wird sie zum Leben erwecken.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerationPanel;