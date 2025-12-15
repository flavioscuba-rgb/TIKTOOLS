import React, { useState, useEffect } from 'react';
import { TranscriptionState } from '../types';
import { transcribeVideoUrl } from '../services/geminiService';

interface StageTwoProps {
  cleanUrl: string;
  onTranscriptionComplete: (text: string) => void;
  onBack: () => void;
}

const StageTwo: React.FC<StageTwoProps> = ({ cleanUrl, onTranscriptionComplete, onBack }) => {
  const [url, setUrl] = useState(cleanUrl);
  const [state, setState] = useState<TranscriptionState>({
    originalText: '',
    isTranscribing: false,
    error: null,
  });

  useEffect(() => {
    setUrl(cleanUrl);
  }, [cleanUrl]);

  const handleTranscribe = async () => {
    if (!url) return;

    setState(prev => ({ ...prev, isTranscribing: true, error: null, originalText: '' }));

    try {
      const text = await transcribeVideoUrl(url);
      setState(prev => ({ ...prev, originalText: text, isTranscribing: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isTranscribing: false, 
        error: error.message || "Falha na transcrição." 
      }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.originalText);
  };

  const clearResult = () => {
    setState({
        originalText: '',
        isTranscribing: false,
        error: null
    });
  };

  return (
    <div className="space-y-6 animate-fade-in w-full max-w-3xl mx-auto">
      {/* Container styled to look like the reference screenshot (dark mode) */}
      <div className="bg-black p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8 text-center">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-lime-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                </span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Transcrição de Áudio</h2>
            </div>
            <p className="text-slate-400 font-medium">Converta áudios e vídeos em texto automaticamente</p>
        </div>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/..."
                className="flex-1 bg-[#111] border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 transition-all placeholder-slate-600"
            />
            <button
                onClick={handleTranscribe}
                disabled={state.isTranscribing || !url}
                className={`px-8 py-3 rounded-lg font-bold text-black transition-all whitespace-nowrap ${
                    state.isTranscribing || !url
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    : 'bg-[#d9f99d] hover:bg-[#bef264] shadow-[0_0_15px_rgba(190,242,100,0.3)]'
                }`}
            >
                {state.isTranscribing ? 'Processando...' : 'Transcrever'}
            </button>
        </div>

        {/* Error Message */}
        {state.error && (
            <div className="bg-red-900/20 border border-red-900/50 text-red-400 p-4 rounded-lg mb-6 text-sm">
                {state.error}
            </div>
        )}

        {/* Result Section */}
        <div className="mb-2">
            <h3 className="text-white font-bold mb-3 text-lg">Resultado</h3>
            <div className="relative">
                <textarea
                    readOnly
                    value={state.originalText}
                    placeholder="A transcrição aparecerá aqui..."
                    className="w-full h-64 bg-[#111] border border-slate-800 rounded-xl p-5 text-slate-300 leading-relaxed resize-none focus:outline-none custom-scrollbar"
                />
            </div>
        </div>

        {/* Actions Footer */}
        <div className="flex flex-wrap gap-3 mt-4">
            <button
                onClick={copyToClipboard}
                disabled={!state.originalText}
                className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5" />
                </svg>
                Copiar
            </button>

            <button
                onClick={clearResult}
                disabled={!state.originalText}
                className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Limpar
            </button>
            
            <div className="flex-1"></div>

            <button
                onClick={() => onTranscriptionComplete(state.originalText)}
                disabled={!state.originalText}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
                Traduzir (PT-BR)
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
            </button>
        </div>
        
        {/* Back Link */}
        <div className="mt-6 text-center">
            <button onClick={onBack} className="text-slate-500 hover:text-slate-300 text-sm underline">
                Voltar para Link
            </button>
        </div>
      </div>
    </div>
  );
};

export default StageTwo;
