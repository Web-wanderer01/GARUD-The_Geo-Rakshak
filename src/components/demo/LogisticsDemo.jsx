import React, { useState, useEffect } from 'react';
import { Truck, Route, AlertTriangle, Activity, MapPin } from 'lucide-react';

export default function LogisticsDemo() {
  const [step, setStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 1

  // Animation Loop
  useEffect(() => {
    let frameId;
    let currentProgress = progress;
    
    const animate = () => {
      if (step === 0) {
        // Normal operation: Truck drives along primary route
        currentProgress += 0.003;
        if (currentProgress >= 1) currentProgress = 0; // loop
        setProgress(currentProgress);
        frameId = requestAnimationFrame(animate);
      } else if (step === 1 || step === 2) {
        // Blocked/Calculating: Truck is stopped exactly at 0.5 (blockage)
        setProgress(0.5);
      } else if (step === 3) {
        // Rerouted: Truck drives from 0.5 to 1.0 along the new curve!
        currentProgress += 0.002;
        if (currentProgress >= 1) currentProgress = 1; // stop at destination
        setProgress(currentProgress);
        frameId = requestAnimationFrame(animate);
      }
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [step, progress]); // Rebind when state changes

  const startSimulation = () => {
    setIsSimulating(true);
    setStep(1); // Blocked
    setProgress(0.5); // Snap truck to blockage
    
    setTimeout(() => {
      setStep(2); // Calculating
      setTimeout(() => {
        setStep(3); // Optimized & Driving again
        setIsSimulating(false);
      }, 3000);
    }, 2000);
  };

  const resetSimulation = () => {
    setStep(0);
    setProgress(0);
    setIsSimulating(false);
  };

  // Calculate Truck Position based on step and progress
  // Viewbox: 0 0 1000 500
  // Start: (200, 400)
  // End: (800, 100)
  // Mid (Blockage): (500, 250)
  // Curve control point: (400, 100)
  
  let truckX = 200;
  let truckY = 400;

  if (step === 0 || step === 1 || step === 2) {
    // Linear interpolation from start to end
    truckX = 200 + (800 - 200) * progress;
    truckY = 400 + (100 - 400) * progress;
  } else if (step === 3) {
    // Quadratic Bezier interpolation from Mid to End using Control Point
    // Normal progress is 0.5 to 1.0. We normalize it to 0 to 1 for the curve
    const t = (progress - 0.5) * 2;
    if (t < 0) { truckX = 500; truckY = 250; }
    else if (t > 1) { truckX = 800; truckY = 100; }
    else {
      // P = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
      const invT = 1 - t;
      truckX = (invT * invT * 500) + (2 * invT * t * 400) + (t * t * 800);
      truckY = (invT * invT * 250) + (2 * invT * t * 50) + (t * t * 100);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-800 p-6 flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            Virtual Logistics & Auto-Rerouting Simulation
          </h2>
          <p className="text-slate-300 mt-1">
            Virtually simulate how GARUD's AI Logistics Engine automatically reacts to a suddenly blocked transport corridor.
          </p>
        </div>
        <div className="flex gap-2">
          {step === 3 && (
             <button onClick={resetSimulation} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors text-sm">
                Reset
             </button>
          )}
          <button 
            onClick={startSimulation}
            disabled={isSimulating || step === 3}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-bold rounded-lg transition-colors flex items-center gap-2 relative overflow-hidden group"
          >
            {isSimulating ? <Activity className="w-4 h-4 animate-spin" /> : <Route className="w-4 h-4" />}
            {isSimulating ? 'Simulating...' : step === 3 ? 'Demo Complete' : 'Trigger Road Blockage'}
            {step === 0 && !isSimulating && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-8 bg-slate-50">
        
        {/* Left Side: Status Cards */}
        <div className="space-y-6">
          <div className={`p-5 rounded-xl border-2 transition-all duration-500 ${step >= 1 ? 'border-red-300 bg-red-50 shadow-md shadow-red-100' : 'border-slate-200 bg-white'}`}>
            <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <AlertTriangle className={`w-5 h-5 ${step >= 1 ? 'text-red-600 animate-pulse' : 'text-slate-400'}`} />
                 Disruption Signal Received
               </h3>
               <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${step >= 1 ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'}`}>
                 {step >= 1 ? 'CRITICAL ALERT' : 'STANDBY'}
               </span>
            </div>
            {step >= 1 ? (
              <p className="text-sm text-red-700">
                <strong>NH-27 Blocked:</strong> Massive landslide detected via satellite radar near Lumding. Highway completely impassable. Supply Fleet SDRF-Alpha has automatically halted to prevent collision.
              </p>
            ) : (
              <p className="text-sm text-slate-500">Waiting for disruption signal from field sensors or citizens...</p>
            )}
          </div>

          <div className={`p-5 rounded-xl border-2 transition-all duration-500 ${step >= 2 ? (step === 3 ? 'border-green-300 bg-green-50 shadow-md shadow-green-100' : 'border-blue-300 bg-blue-50 shadow-md shadow-blue-100') : 'border-slate-200 bg-white'}`}>
            <div className="flex justify-between items-start mb-2">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Activity className={`w-5 h-5 ${step === 2 ? 'text-blue-600 animate-spin' : step === 3 ? 'text-green-600' : 'text-slate-400'}`} />
                 AI Route Optimizer
               </h3>
               <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${step === 2 ? 'bg-blue-600 text-white animate-pulse' : step === 3 ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                 {step === 2 ? 'CALCULATING' : step === 3 ? 'OPTIMIZED' : 'IDLE'}
               </span>
            </div>
            {step === 2 && (
              <div className="text-sm text-blue-700">
                <p className="animate-pulse mb-2">Analyzing alternate rural roads, factoring bridge load capacities, and checking live weather radar...</p>
                <div className="w-full bg-blue-200 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full animate-[progress_3s_ease-in-out_forwards]"></div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="text-sm text-green-800">
                <p className="mb-3 font-medium"><strong>New Route Found:</strong> Rerouting via Jowai-Badarpur bypass. Fleet SDRF-Alpha is moving again.</p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold text-green-900 border border-green-300 shadow-sm">+45 Mins Delay</span>
                  <span className="bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold text-green-900 border border-green-300 shadow-sm">Safety Score: 92%</span>
                  <span className="bg-green-200 px-3 py-1.5 rounded-md text-xs font-bold text-green-900 border border-green-300 shadow-sm">ETA: 14:30 HRS</span>
                </div>
              </div>
            )}
            {step < 2 && (
              <p className="text-sm text-slate-500">Optimizer engine idle.</p>
            )}
          </div>
        </div>

        {/* Right Side: Map UI Mock */}
        <div className="bg-white border-4 border-slate-200 rounded-xl overflow-hidden relative shadow-inner" style={{ aspectRatio: '16/9' }}>
           <div className="absolute inset-0 bg-slate-50">
             {/* Map Grid lines simulation */}
             <div className="w-full h-full border border-slate-300/30 relative" style={{ backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                
                <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full z-10" style={{ pointerEvents: 'none' }}>
                  {/* Primary Route (Blue initially, Red dash when blocked) */}
                  <line 
                    x1="200" y1="400" 
                    x2="800" y2="100" 
                    stroke={step >= 1 ? "#ef4444" : "#3b82f6"} 
                    strokeWidth="8" 
                    strokeDasharray={step >= 1 ? "15,15" : "none"} 
                    strokeLinecap="round"
                    className="opacity-60"
                  />
                  
                  {/* Alternate Route Generated */}
                  {step === 3 && (
                    <path 
                      d="M 500 250 Q 400 50 800 100" 
                      stroke="#10b981" 
                      strokeWidth="8" 
                      fill="none" 
                      strokeLinecap="round"
                      className="animate-[dash_1s_linear_infinite]"
                      strokeDasharray="20,10"
                    />
                  )}

                  {/* Blockage X */}
                  {step >= 1 && (
                    <g transform="translate(500, 250)">
                      <circle cx="0" cy="0" r="30" fill="#ef4444" className="animate-ping opacity-50" />
                      <circle cx="0" cy="0" r="15" fill="#ef4444" stroke="white" strokeWidth="3" />
                      <path d="M-6 -6 L6 6 M-6 6 L6 -6" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </g>
                  )}

                  {/* Destination */}
                  <g transform="translate(800, 100)">
                    <circle cx="0" cy="0" r="12" fill="#334155" />
                    <circle cx="0" cy="0" r="4" fill="white" />
                    <text x="0" y="30" fill="#334155" fontSize="16" fontWeight="bold" textAnchor="middle">Target</text>
                  </g>

                  {/* Live Fleet (Moving Truck) */}
                  <g transform={`translate(${truckX}, ${truckY})`} className="transition-transform duration-75">
                    {/* Radar ping from truck */}
                    {step === 0 && <circle cx="0" cy="0" r="40" fill="#3b82f6" className="animate-ping opacity-20" />}
                    
                    {/* Truck Icon Body */}
                    <rect x="-15" y="-10" width="30" height="20" rx="4" fill={step === 1 || step === 2 ? "#ef4444" : step === 3 ? "#10b981" : "#2563eb"} stroke="white" strokeWidth="2" shadow="lg" />
                    <rect x="5" y="-6" width="6" height="12" rx="1" fill="white" className="opacity-50" />
                    
                    {/* Label */}
                    <text x="0" y="28" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle" className="drop-shadow-md bg-white">
                      {step === 1 || step === 2 ? 'HALTED' : 'SDRF-Alpha'}
                    </text>
                  </g>
                </svg>

             </div>
           </div>
        </div>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes dash {
          to { stroke-dashoffset: -30; }
        }
      `}} />
    </div>
  );
}
