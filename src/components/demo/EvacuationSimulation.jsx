import React, { useState, useEffect } from 'react';
import { Users, CloudRain, AlertTriangle, ShieldCheck, Activity, MapPin, Zap, ArrowRight } from 'lucide-react';

export default function EvacuationSimulation() {
  const [step, setStep] = useState(0); 
  // 0: Normal, 1: Rain/Warning, 2: Evacuating, 3: Safe
  const [rainLevel, setRainLevel] = useState(10);
  const [soilMoisture, setSoilMoisture] = useState(35);
  const [citizens, setCitizens] = useState(
    Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: 20 + Math.random() * 40, // High risk zone (left side)
      y: 20 + Math.random() * 60,
      evacuated: false
    }))
  );

  useEffect(() => {
    let interval;
    if (step === 1) {
      // Simulate worsening weather
      interval = setInterval(() => {
        setRainLevel(prev => Math.min(prev + 5, 120));
        setSoilMoisture(prev => Math.min(prev + 2, 95));
        
        if (soilMoisture > 85) {
          setStep(2); // Auto trigger evacuation
        }
      }, 300);
    } else if (step === 2) {
      // Animate citizens moving to safe zone (right side)
      interval = setInterval(() => {
        setCitizens(prev => {
          let allSafe = true;
          const updated = prev.map(c => {
            if (c.x < 80) {
              allSafe = false;
              return {
                ...c,
                x: c.x + (Math.random() * 3 + 1),
                y: c.y + (Math.random() * 2 - 1)
              };
            }
            return { ...c, evacuated: true };
          });
          if (allSafe) setStep(3);
          return updated;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [step, soilMoisture]);

  const startSimulation = () => {
    setStep(1);
    setRainLevel(10);
    setSoilMoisture(35);
    setCitizens(Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 30,
      y: 20 + Math.random() * 60,
      evacuated: false
    })));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-6 flex flex-col gap-4 border-b-4 border-indigo-500">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            AI Mass Evacuation Routing
          </h2>
          <p className="text-slate-400 mt-1">
            Simulate how GARUD predicts critical soil saturation and autonomously guides citizens to safe zones via SMS.
          </p>
        </div>
        <div>
          <button 
            onClick={startSimulation}
            disabled={step === 1 || step === 2}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            {step === 1 ? <CloudRain className="w-4 h-4 animate-bounce" /> : step === 2 ? <Activity className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {step === 0 ? 'Start Weather Event' : step === 1 ? 'Monitoring Sensors...' : step === 2 ? 'Evacuating...' : 'Reset Scenario'}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50">
        
        {/* Left Stats Panel */}
        <div className="space-y-4 lg:col-span-1">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Evacuation Metrics</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Citizens Safely Evacuated</span>
              <span className="text-green-600 font-bold">{citizens.filter(c => c.evacuated).length} / {citizens.length}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(citizens.filter(c => c.evacuated).length / citizens.length) * 100}%` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">At Risk (Red Zone)</span>
              <span className="text-red-600 font-bold">{citizens.filter(c => !c.evacuated).length}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Telemetry Feed</h3>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Rainfall (mm/hr)</span>
                <span className="text-blue-600 font-bold">{rainLevel} mm</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${Math.min((rainLevel/150)*100, 100)}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold text-slate-700">Soil Saturation</span>
                <span className={`${soilMoisture > 80 ? 'text-red-600 animate-pulse' : 'text-amber-600'} font-bold`}>{Math.round(soilMoisture)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className={`h-2 rounded-full transition-all duration-300 ${soilMoisture > 80 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${soilMoisture}%` }}></div>
              </div>
            </div>
          </div>

          <div className={`p-4 rounded-xl border-2 transition-colors duration-500 ${step === 0 ? 'border-slate-200 bg-slate-100' : step === 1 ? 'border-amber-400 bg-amber-50' : step === 2 ? 'border-red-500 bg-red-50 animate-pulse' : 'border-green-400 bg-green-50'}`}>
            <h3 className="font-bold mb-2 flex items-center gap-2 text-slate-800">
              {step === 0 && <ShieldCheck className="w-5 h-5 text-slate-500" />}
              {step === 1 && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {step === 2 && <AlertTriangle className="w-5 h-5 text-red-600" />}
              {step === 3 && <ShieldCheck className="w-5 h-5 text-green-600" />}
              System Status
            </h3>
            <p className="text-sm text-slate-600">
              {step === 0 && "Sensors nominal. No threats detected."}
              {step === 1 && "Heavy rainfall detected. Soil saturation rising rapidly."}
              {step === 2 && "CRITICAL SATURATION. AI issuing automated SMS evacuation routes to all devices in the red zone."}
              {step === 3 && "Evacuation complete. All citizens successfully routed to safe zones."}
            </p>
          </div>
        </div>

        {/* Right Map Panel */}
        <div className="lg:col-span-2 relative bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 h-[350px]">
          {/* Background Map Visual */}
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          {/* Risk Zone (Left) */}
          <div className={`absolute top-0 left-0 bottom-0 w-[40%] transition-colors duration-1000 ${step >= 2 ? 'bg-red-500/20 border-r-2 border-red-500/50' : 'bg-amber-500/10 border-r-2 border-amber-500/30'}`}>
             <div className="absolute top-4 left-4 font-bold text-slate-700 flex items-center gap-1 opacity-60">
               <AlertTriangle className="w-4 h-4" /> High Risk Valley
             </div>
             {/* Rain effect */}
             {step >= 1 && step < 3 && (
               <div className="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
                 {Array.from({length: 20}).map((_, i) => (
                   <div key={i} className="absolute w-0.5 h-10 bg-blue-400/50" 
                        style={{ left: `${Math.random()*100}%`, top: `-20px`, animation: `rain ${0.5 + Math.random()*0.5}s linear infinite` }}></div>
                 ))}
               </div>
             )}
          </div>

          {/* Safe Zone (Right) */}
          <div className="absolute top-0 right-0 bottom-0 w-[30%] bg-green-500/10 border-l-2 border-green-500/30">
             <div className="absolute top-4 right-4 font-bold text-green-700 flex items-center gap-1 opacity-80">
               <ShieldCheck className="w-4 h-4" /> Elevated Relief Camp
             </div>
          </div>

          {/* Path Arrows */}
          {step === 2 && (
             <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <ArrowRight className="w-24 h-24 text-blue-600 animate-pulse" />
             </div>
          )}

          {/* Citizens */}
          <div className="absolute inset-0">
            {citizens.map(c => (
              <div 
                key={c.id} 
                className={`absolute w-2.5 h-2.5 rounded-full transition-all duration-300 ${c.evacuated ? 'bg-green-600 shadow-[0_0_8px_#16a34a]' : step >= 2 ? 'bg-blue-600 shadow-[0_0_8px_#2563eb]' : 'bg-slate-600'}`}
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              ></div>
            ))}
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes rain {
              0% { transform: translateY(-20px); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: translateY(350px); opacity: 0; }
            }
          `}} />
        </div>

      </div>
    </div>
  );
}
