import React, { useState, useEffect } from 'react';
import type { ModelConfig, Persona, AiModelId } from '../types';
import { X, HelpCircle, Bookmark, Trash2, Pencil, Check, Settings, UserCircle, Bot } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import ConfirmModal from './ConfirmModal';
import { cn } from '../utils/cn';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    modelConfig: ModelConfig;
    setModelConfig: (config: Partial<ModelConfig>) => void;
    personas: Persona[];
    addPersona: (name: string, instruction: string) => void;
    deletePersona: (id: string) => void;
    updatePersona: (id: string, updates: { name: string; instruction: string }) => void;
}

type Tab = 'general' | 'personas';


const ModelSettingSlider: React.FC<{
    label: string;
    tooltip: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (value: number) => void;
}> = ({ label, tooltip, value, min, max, step, onChange }) => {
    return (
        <div className="space-y-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    {label}
                    <div className="group relative flex items-center">
                        <HelpCircle className="w-4 h-4 text-slate-500 hover:text-indigo-400 transition-colors cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-20 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {tooltip}
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 border-b border-r border-slate-700 transform rotate-45"></div>
                        </div>
                    </div>
                </label>
                <span className="text-sm font-mono font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                    {value.toFixed(step < 1 ? 2 : 0)}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
            />
        </div>
    );
};

const SettingsModal: React.FC<SettingsModalProps> = ({ 
    isOpen, onClose, modelConfig, setModelConfig, personas, addPersona, deletePersona, updatePersona
}) => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const [localConfig, setLocalConfig] = useState<ModelConfig>(modelConfig);
    
    const [editingPersona, setEditingPersona] = useState<Persona | null>(null);
    const [editName, setEditName] = useState('');
    const [editInstruction, setEditInstruction] = useState('');
    const [personaToDelete, setPersonaToDelete] = useState<Persona | null>(null);
    

    const availableModels: { id: AiModelId, name: string }[] = [
        { id: 'gemini-2.5-flash', name: 'Gemini Flash' }
    ];

    useEffect(() => {
        if (isOpen) {
            setLocalConfig(modelConfig);
            setActiveTab('general');
            setEditingPersona(null);
        }
    }, [isOpen, modelConfig]);

    if (!isOpen) return null;
    
    const handleSaveNewPersona = () => {
        if (!localConfig.systemInstruction.trim()) {
            addToast("Die System-Anweisung darf nicht leer sein, um sie zu speichern.", "error");
            return;
        }
        const name = window.prompt("Geben Sie einen Namen für die neue Persona ein:");
        if (name) {
            addPersona(name, localConfig.systemInstruction);
            addToast(`Persona "${name}" gespeichert!`, 'success');
        }
    }
    
    const selectedPersona = personas.find(p => p.instruction === localConfig.systemInstruction);

    const handleConfirmDeletePersona = () => {
        if (personaToDelete) {
            deletePersona(personaToDelete.id);
            addToast("Persona gelöscht.", "info");
            if (selectedPersona?.id === personaToDelete.id) {
                 setLocalConfig(prev => ({...prev, systemInstruction: personas.find(p => p.isDefault)?.instruction || ''}))
            }
        }
    };
    
    const handleStartEdit = (persona: Persona) => {
        setEditingPersona(persona);
        setEditName(persona.name);
        setEditInstruction(persona.instruction);
    };

    const handleCancelEdit = () => {
        setEditingPersona(null);
    };

    const handleSaveEdit = () => {
        if (editingPersona) {
            updatePersona(editingPersona.id, { name: editName, instruction: editInstruction });
            addToast(`Persona "${editName}" aktualisiert.`, 'success');
            setEditingPersona(null);
        }
    };

    const handleSaveAndClose = () => {
        setModelConfig(localConfig);
        addToast("Einstellungen gespeichert.", "success");
        onClose();
    };

    return (
        <>
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-fade-in-fast p-4 sm:p-6"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="glass-pane rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in-slide-up overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
               {/* Header */}
               <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                            <Settings className="w-5 h-5 text-indigo-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-100 tracking-tight">Einstellungen</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors" aria-label="Einstellungen schließen">
                        <X className="w-5 h-5" />
                    </button>
                </div>

               {/* Tabs */}
                <div className="flex-shrink-0 border-b border-slate-800 px-5 bg-slate-900/30">
                    <nav className="flex space-x-6">
                       <button 
                           onClick={() => setActiveTab('general')} 
                           className={cn(
                               "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors",
                               activeTab === 'general' 
                                   ? "border-indigo-500 text-indigo-400" 
                                   : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                           )}
                       >
                           <Settings className="w-4 h-4"/> Allgemein
                       </button>
                       <button 
                           onClick={() => setActiveTab('personas')} 
                           className={cn(
                               "flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors",
                               activeTab === 'personas' 
                                   ? "border-indigo-500 text-indigo-400" 
                                   : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
                           )}
                       >
                           <UserCircle className="w-4 h-4"/> Personas
                       </button>
                    </nav>
               </div>
               
               {/* Main Content */}
               <div className="p-6 space-y-8 flex-grow overflow-y-auto custom-scrollbar">
                 {activeTab === 'general' && (
                     <div className="space-y-6 animate-fade-in-fast">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Modell-Konfiguration</h3>
                            <div className="space-y-2">
                                <label htmlFor="model-select" className="block text-sm font-medium text-slate-300">KI-Modell</label>
                                <select 
                                    id="model-select" 
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm appearance-none" 
                                    value={localConfig.model} 
                                    onChange={(e) => setLocalConfig(prev => ({...prev, model: e.target.value as AiModelId }))}
                                >
                                    {availableModels.map(model => (<option key={model.id} value={model.id}>{model.name}</option>))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Parameter</h3>
                            <div className="space-y-3">
                                <ModelSettingSlider label="Temperatur" tooltip="Steuert die Zufälligkeit. Niedrigere Werte machen die Antworten deterministischer, höhere Werte kreativer." value={localConfig.temperature} min={0} max={1} step={0.01} onChange={(val) => setLocalConfig(prev => ({...prev, temperature: val}))} />
                                <ModelSettingSlider label="Top-P" tooltip="Wählt aus den wahrscheinlichsten Wörtern, bis eine bestimmte Wahrscheinlichkeitsschwelle erreicht ist. Beeinflusst die Kreativität." value={localConfig.topP} min={0} max={1} step={0.01} onChange={(val) => setLocalConfig(prev => ({...prev, topP: val}))} />
                                <ModelSettingSlider label="Top-K" tooltip="Beschränkt die Auswahl der Wörter auf die K wahrscheinlichsten. Reduziert das Risiko von seltsamen Wörtern." value={localConfig.topK} min={1} max={100} step={1} onChange={(val) => setLocalConfig(prev => ({...prev, topK: val}))} />
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'personas' && (
                    <div className="space-y-8 animate-fade-in-fast">
                         <div className="space-y-4">
                             <div className="flex items-center justify-between">
                                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Aktuelle Anweisung</h3>
                                 <div className="group relative flex items-center">
                                     <HelpCircle className="w-4 h-4 text-slate-500 hover:text-indigo-400 transition-colors cursor-help" />
                                     <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                         Geben Sie der KI eine Persona oder spezifische Anweisungen, die sie während des gesamten Gesprächs befolgen soll.
                                         <div className="absolute -bottom-1.5 right-2 w-3 h-3 bg-slate-800 border-b border-r border-slate-700 transform rotate-45"></div>
                                     </div>
                                 </div>
                             </div>
                             
                            <div className="space-y-3">
                                <textarea 
                                    id="system-instruction" 
                                    rows={4} 
                                    value={localConfig.systemInstruction} 
                                    onChange={(e) => setLocalConfig(prev => ({...prev, systemInstruction: e.target.value}))} 
                                    className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm resize-none custom-scrollbar" 
                                    placeholder="z.B. Du bist ein hilfsbereiter Assistent, der komplexe Themen einfach erklärt..." 
                                />
                                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                    <div className="relative flex-grow">
                                        <select 
                                            id="persona-select" 
                                            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm appearance-none" 
                                            value={selectedPersona?.id || ''} 
                                            onChange={(e) => { 
                                                const newSelectedPersona = personas.find(p => p.id === e.target.value); 
                                                if (newSelectedPersona) { 
                                                    setLocalConfig(prev => ({...prev, systemInstruction: newSelectedPersona.instruction})); 
                                                }
                                            }}
                                        >
                                            <option value="" disabled>Gespeicherte Persona laden...</option>
                                            {personas.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSaveNewPersona} 
                                        className="flex-shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 hover:border-indigo-500/30 transition-all text-sm font-medium" 
                                        title="Aktuelle Anweisung als neue Persona speichern"
                                    >
                                        <Bookmark className="w-4 h-4" /> <span>Als neu speichern</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Gespeicherte Personas</h3>
                            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                {personas.map(p => (
                                    editingPersona?.id === p.id ? (
                                        <div key={p.id} className="bg-slate-800 p-4 rounded-xl border border-indigo-500/50 shadow-lg space-y-3 animate-fade-in-fast">
                                            <input 
                                                type="text" 
                                                value={editName} 
                                                onChange={e => setEditName(e.target.value)} 
                                                className="w-full text-sm font-semibold p-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-200" 
                                                placeholder="Name der Persona"
                                            />
                                            <textarea 
                                                rows={3} 
                                                value={editInstruction} 
                                                onChange={e => setEditInstruction(e.target.value)} 
                                                className="w-full text-sm p-2.5 rounded-lg bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-slate-300 resize-none custom-scrollbar" 
                                                placeholder="System-Anweisung..."
                                            />
                                            <div className="flex justify-end gap-2 pt-1">
                                                <button onClick={handleCancelEdit} className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors">Abbrechen</button>
                                                <button onClick={handleSaveEdit} className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-2">
                                                    <Check className="w-4 h-4" /> Speichern
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div key={p.id} className="group flex items-start justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 transition-all">
                                            <div className="flex gap-3 min-w-0 pr-4">
                                                <div className="mt-0.5 p-1.5 bg-slate-700/50 rounded-lg text-slate-400">
                                                    {p.isDefault ? <Bot className="w-4 h-4" /> : <UserCircle className="w-4 h-4" />}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-200 truncate">{p.name}</p>
                                                    <p className="text-sm text-slate-400 line-clamp-2 mt-1 leading-relaxed">{p.instruction}</p>
                                                </div>
                                            </div>
                                            {!p.isDefault && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                    <button onClick={() => handleStartEdit(p)} className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors" title="Bearbeiten">
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setPersonaToDelete(p)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors" title="Löschen">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}
               </div>

               <div className="flex items-center justify-end p-5 border-t border-slate-800 bg-slate-900/50 flex-shrink-0 gap-3">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 text-sm font-medium text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                        Abbrechen
                    </button>
                    <button 
                        onClick={handleSaveAndClose} 
                        className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-lg shadow-indigo-500/20"
                    >
                        Änderungen speichern
                    </button>
               </div>
            </div>
        </div>
        <ConfirmModal
            isOpen={!!personaToDelete}
            onClose={() => setPersonaToDelete(null)}
            onConfirm={handleConfirmDeletePersona}
            title="Persona löschen"
            message={<>Möchten Sie die Persona "<strong>{personaToDelete?.name}</strong>" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.</>}
        />
        </>
    );
};

export default SettingsModal;
