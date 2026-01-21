
import React, { useState } from 'react';
import { getPortalExplanation } from '../services/geminiService';

interface AIPanelProps {
  activePortal: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ activePortal, isOpen, onClose }) => {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!activePortal) return;
    setLoading(true);
    const text = await getPortalExplanation(activePortal);
    setExplanation(text);
    setLoading(false);
  };

  React.useEffect(() => {
    if (activePortal) {
      handleExplain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePortal]);

  return (
    <aside 
      className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-slate-900/90 backdrop-blur-xl border-l border-white/10 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transform transition-transform duration-500 ease-in-out rounded-l-3xl overflow-hidden flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-xl border border-blue-500/20">
            <i className="fa-solid fa-microchip text-blue-400"></i>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Portal Inspector</h2>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-90"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!activePortal ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center border border-white/5 animate-pulse">
              <i className="fa-solid fa-wand-magic-sparkles text-3xl opacity-20"></i>
            </div>
            <p className="text-sm max-w-[200px]">Select a portal feature to analyze the system bridge.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-950/80 p-5 rounded-2xl border border-white/5 shadow-inner">
              <h3 className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Analyzing Bridge</h3>
              <p className="font-mono text-sm text-slate-100">{activePortal.toUpperCase()}</p>
            </div>
            
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/5 rounded-lg w-3/4"></div>
                <div className="h-4 bg-white/5 rounded-lg"></div>
                <div className="h-4 bg-white/5 rounded-lg w-5/6"></div>
                <div className="h-4 bg-white/5 rounded-lg w-2/3"></div>
              </div>
            ) : (
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-light">
                {explanation}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6 border-t border-white/5 bg-black/20">
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Security Protocol</h4>
        <div className="text-[11px] text-slate-400 bg-yellow-500/5 p-4 rounded-2xl border border-yellow-500/10 leading-relaxed shadow-lg">
          <i className="fa-solid fa-shield-halved text-yellow-500/50 mr-2"></i>
          Most system portals require <strong>Transient Activation</strong> to prevent unauthorized OS interface spam.
        </div>
      </div>
    </aside>
  );
};

export default AIPanel;
