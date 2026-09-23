import React, { useState, useEffect } from 'react';
import { Brain, Activity, Database, Radar, CheckCircle2 } from 'lucide-react';

export default function ModelStatusPanel() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 flex-1 flex flex-col justify-end min-h-[220px]">
      <h3 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-3">
        <Brain className="w-4 h-4 text-purple-600" />
        AI Prediction Engine
      </h3>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-200 transition-colors">
          <Activity className={`w-4 h-4 mb-1 ${pulse ? 'text-blue-500' : 'text-blue-300'} transition-colors duration-500`} />
          <span className="font-bold text-slate-700">Real-time Sync</span>
          <span className="text-[9px] text-emerald-600 flex items-center gap-0.5"><CheckCircle2 className="w-3 h-3" /> Active</span>
        </div>
        
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-purple-200 transition-colors">
          <Database className="w-4 h-4 text-purple-500 mb-1" />
          <span className="font-bold text-slate-700">Data Sources</span>
          <span className="text-[9px] text-slate-500">IMD, ISRO, USGS</span>
        </div>
        
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-emerald-200 transition-colors">
          <Radar className={`w-4 h-4 text-emerald-500 mb-1 ${pulse ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
          <span className="font-bold text-slate-700">Spatial Analysis</span>
          <span className="text-[9px] text-slate-500">Topography + Terrain</span>
        </div>
        
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden group hover:border-amber-200 transition-colors">
          <div className="w-4 h-4 font-black text-amber-500 mb-1 text-center leading-none">ML</div>
          <span className="font-bold text-slate-700">Risk Calculation</span>
          <span className="text-[9px] text-slate-500">Multi-factor model</span>
        </div>
      </div>
      
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-2 rounded text-[10px] text-blue-800 leading-tight">
        <strong>Model Status:</strong> Actively monitoring zones. The predictive model dynamically combines 24h rainfall, soil saturation, and local seismic activity to generate live risk scores and evaluate road safety.
      </div>
    </div>
  );
}
