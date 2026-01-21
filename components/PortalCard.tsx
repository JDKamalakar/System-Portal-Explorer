
import React from 'react';
import { PortalFeature } from '../types';

interface PortalCardProps {
  feature: PortalFeature;
  onClick: () => void;
  status?: string;
}

const PortalCard: React.FC<PortalCardProps> = ({ feature, onClick, status }) => {
  return (
    <div 
      onClick={onClick}
      className={`group relative bg-slate-800/40 border border-white/5 p-6 rounded-3xl hover:border-blue-500/40 transition-all duration-500 cursor-pointer overflow-hidden shadow-lg hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-2 active:scale-95 ${
        status ? 'ring-2 ring-blue-500/50 border-blue-500/50' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 blur-3xl group-hover:opacity-15 transition-opacity duration-700 ${feature.color}`}></div>
      
      <div className="flex items-start justify-between mb-5 relative">
        <div className={`w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 text-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 ${feature.color.replace('bg-', 'text-')}`}>
          <i className={feature.icon}></i>
        </div>
        {status && (
          <span className="text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/20 animate-pulse">
            Active
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {feature.name}
      </h3>
      <p className="text-sm text-slate-400 leading-relaxed font-light">
        {feature.description}
      </p>

      <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-all">
        <span className="mr-2 h-px w-6 bg-slate-700 group-hover:w-10 group-hover:bg-blue-500 transition-all"></span>
        Bridge OS
        <i className="fa-solid fa-chevron-right ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"></i>
      </div>
    </div>
  );
};

export default PortalCard;
