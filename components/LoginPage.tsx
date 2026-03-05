
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bot, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';

const LoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(password);
    };

    return (
        <div className="min-h-screen flex flex-col p-4 bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-grow flex items-center justify-center relative z-10">
                <div className="w-full max-w-md animate-fade-in-slide-up">
                    <div className="glass-pane rounded-3xl p-8 sm:p-10 text-center">
                        <div className="flex justify-center mb-6">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 shadow-xl transform group-hover:scale-105 transition-transform duration-500">
                                   <Bot className="w-12 h-12 text-white" />
                                </div>
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-3 tracking-tight">
                           Bubinger-AI
                        </h1>
                        <p className="text-slate-400 mb-8 text-sm">
                            Bitte geben Sie Ihr Passwort ein, um fortzufahren.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="relative">
                                <label
                                    htmlFor="password"
                                    className="sr-only"
                                >
                                    Passwort
                                </label>
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Passwort eingeben..."
                                    className={cn(
                                        "w-full bg-slate-950/50 text-slate-200 rounded-xl pl-11 pr-4 py-3.5",
                                        "border border-slate-800 focus:border-indigo-500/50",
                                        "focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                                        "transition-all duration-200 placeholder:text-slate-600",
                                        "disabled:opacity-50 disabled:cursor-not-allowed"
                                    )}
                                    disabled={isLoading}
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg animate-fade-in-fast">
                                    <p className="text-sm text-rose-400 text-center font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading || !password}
                                className={cn(
                                    "w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-medium text-white transition-all duration-200",
                                    isLoading || !password
                                        ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]"
                                )}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Anmelden...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Anmelden</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <footer className="relative z-10 flex-shrink-0 py-6 text-center text-sm font-medium text-slate-500">
                Entwickelt von <span className="text-slate-400">ch.8uechner</span>
            </footer>
        </div>
    );
};

export default LoginPage;