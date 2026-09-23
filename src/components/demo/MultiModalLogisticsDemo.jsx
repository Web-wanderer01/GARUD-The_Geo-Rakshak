import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Plane, Activity, CheckCircle2, Zap, Package, MapPin } from 'lucide-react';

export default function MultiModalLogisticsDemo() {
  const [step, setStep] = useState(0); // 0: Idle, 1: AI Analyzing, 2: Dispatched/In-Transit, 3: Arrived
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId;
    if (step === 2) {
      const animate = () => {
        setProgress(p => {
          if (p >= 1) {
            setStep(3);
            return 1;
          }
          return p + 0.003; // Base speed
        });
        frameId = requestAnimationFrame(animate);
      };
      frameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frameId);
  }, [step]);

  const startSimulation = () => {
    setStep(1);
    setProgress(0);
    setTimeout(() => {
      setStep(2);
    }, 2000);
  };

  const resetSimulation = () => {
    setStep(0);
    setProgress(0);
  };

  // Positions based on progress
  const startX = 150;
  const startY = 300;
  const targetX = 800;
  const targetY = 100;

  // Drone: Fastest, direct line
  const droneProgress = Math.min(progress * 2.5, 1);
  const droneX = startX + (targetX - startX) * droneProgress;
  const droneY = startY + (targetY - startY) * droneProgress;

  // Heli: Medium, direct line
  const heliProgress = Math.min(progress * 1.5, 1);
  const heliX = startX + (targetX - startX) * heliProgress;
  const heliY = startY + (targetY - startY) * heliProgress;

  // Truck: Slowest, curved path
  const truckProgress = Math.min(progress * 0.8, 1);
  const t = truckProgress;
  const invT = 1 - t;
  // Control point for truck curve
  const cx = 600;
  const cy = 450;
  const truckX = (invT * invT * startX) + (2 * invT * t * cx) + (t * t * targetX);
  const truckY = (invT * invT * startY) + (2 * invT * t * cy) + (t * t * targetY);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-indigo-950 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-400" />
            AI Multi-Modal Swarm Dispatch Simulation
          </h2>
          <p className="text-indigo-200 mt-1">
            Simulate how the AI autonomously orchestrates drones, helicopters, and trucks to rescue a completely cut-off zone.
          </p>
        </div>
        <div className="flex gap-2">
          {step === 3 && (
             <button onClick={resetSimulation} className="px-4 py-2 bg-indigo-800 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-sm">
                Reset
             </button>
          )}
          <button 
            onClick={startSimulation}
            disabled={step === 1 || step === 2 || step === 3}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 relative overflow-hidden group"
          >
            {step === 1 ? <Activity className="w-4 h-4 animate-spin" /> : <Package className="w-4 h-4" />}
            {step === 1 ? 'AI Planning...' : step === 2 ? 'In Transit...' : step === 3 ? 'Mission Complete' : 'Trigger AI Swarm Dispatch'}
          </button>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-slate-50">
        
        {/* Left Side: Status Cards */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl border-2 border-indigo-200 bg-indigo-50 shadow-sm">
            <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
               <Activity className="w-5 h-5 text-indigo-600" />
               Situation: Bridge Collapse at Cherrapunji
            </h3>
            <p className="text-sm text-indigo-800">
               Total isolation detected. Immediate medical supplies needed in 15 mins. Heavy earth movers needed to clear debris (ETA flexible).
            </p>
          </div>

          <div className="space-y-3">
             {/* Drone Card */}
             <div className={`p-4 rounded-xl border transition-all ${droneProgress >= 1 ? 'bg-green-50 border-green-200' : step >= 1 ? 'bg-white border-blue-200 shadow-sm' : 'bg-white border-slate-200 opacity-60'}`}>
                <div className="flex justify-between items-center mb-1">
                   <div className="font-bold flex items-center gap-2 text-sm text-slate-800">
                      <Navigation className="w-4 h-4 text-blue-500" /> Drone Swarm Alpha
                   </div>
                   <span className="text-xs font-bold text-slate-500">{Math.round(droneProgress * 100)}%</span>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-xs text-slate-600 w-full">
                     <div className="flex justify-between mb-1"><span>Cargo: Anti-venom</span> <span>ETA: 12 Mins</span></div>
                     <div className="flex gap-2 w-full mt-2">
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">PAYLOAD</span><span className="font-mono text-blue-600">4.2/5kg</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">SPEED</span><span className="font-mono text-blue-600">65km/h</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">BATTERY</span><span className="font-mono text-blue-600">88%</span></div>
                     </div>
                   </div>
                   {droneProgress >= 1 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
             </div>

             {/* Heli Card */}
             <div className={`p-4 rounded-xl border transition-all ${heliProgress >= 1 ? 'bg-green-50 border-green-200' : step >= 1 ? 'bg-white border-purple-200 shadow-sm' : 'bg-white border-slate-200 opacity-60'}`}>
                <div className="flex justify-between items-center mb-1">
                   <div className="font-bold flex items-center gap-2 text-sm text-slate-800">
                      <Plane className="w-4 h-4 text-purple-600" /> NDRF Heli-Squadron
                   </div>
                   <span className="text-xs font-bold text-slate-500">{Math.round(heliProgress * 100)}%</span>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-xs text-slate-600">Cargo: Rations, Water, Tents <br/>ETA: 45 Mins (Direct Flight)</div>
                   {heliProgress >= 1 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
             </div>

             {/* Truck Card */}
             <div className={`p-4 rounded-xl border transition-all ${truckProgress >= 1 ? 'bg-green-50 border-green-200' : step >= 1 ? 'bg-white border-orange-200 shadow-sm' : 'bg-white border-slate-200 opacity-60'}`}>
                <div className="flex justify-between items-center mb-1">
                   <div className="font-bold flex items-center gap-2 text-sm text-slate-800">
                      <Truck className="w-4 h-4 text-orange-500" /> Ground Convoy Heavy
                   </div>
                   <span className="text-xs font-bold text-slate-500">{Math.round(truckProgress * 100)}%</span>
                </div>
                <div className="flex justify-between items-end">
                   <div className="text-xs text-slate-600">Cargo: Earth Movers, Bridging Eq.<br/>ETA: 6 Hours (Mountain Roads)</div>
                   {truckProgress >= 1 && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Map Visualization */}
        <div className="bg-slate-800 rounded-xl overflow-hidden relative shadow-inner border-2 border-slate-700 h-[300px] flex items-center justify-center">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20"
               style={{ backgroundImage: 'linear-gradient(#475569 1px, transparent 1px), linear-gradient(90deg, #475569 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          </div>

          <svg viewBox="0 0 1000 500" className="w-full h-full relative z-10" preserveAspectRatio="xMidYMid slice">
            <defs>
               <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                     <feMergeNode in="coloredBlur"/>
                     <feMergeNode in="SourceGraphic"/>
                  </feMerge>
               </filter>
            </defs>

            {/* Topography aesthetic */}
            <path d="M 0,200 Q 200,300 400,200 T 800,300 T 1000,100" fill="none" stroke="#334155" strokeWidth="2" opacity="0.5"/>
            <path d="M 0,300 Q 200,400 400,300 T 800,400 T 1000,200" fill="none" stroke="#334155" strokeWidth="2" opacity="0.3"/>
            <path d="M 0,400 Q 200,500 400,400 T 800,500 T 1000,300" fill="none" stroke="#334155" strokeWidth="2" opacity="0.1"/>

            {/* Drone/Heli Air Path (Straight Line) */}
            <line x1={startX} y1={startY} x2={targetX} y2={targetY} stroke="#475569" strokeWidth="2" strokeDasharray="5,10" />
            
            {/* Truck Ground Path (Curve) */}
            <path d={`M ${startX} ${startY} Q ${cx} ${cy} ${targetX} ${targetY}`} fill="none" stroke="#475569" strokeWidth="3" strokeDasharray="8,8" />

            {/* Base / Origin */}
            <circle cx={startX} cy={startY} r="12" fill="#1e293b" stroke="#cbd5e1" strokeWidth="3" />
            <text x={startX - 15} y={startY + 30} fill="#cbd5e1" fontSize="14" fontWeight="bold">HQ Depot</text>

            {/* Destination / Target */}
            <circle cx={targetX} cy={targetY} r="16" fill="#ef4444" stroke="#f87171" strokeWidth="4" filter="url(#glow)" className="animate-pulse" />
            <text x={targetX - 25} y={targetY + 35} fill="#fca5a5" fontSize="14" fontWeight="bold">Ground Zero</text>

            {/* Live Trackers */}
            {step >= 2 && (
              <>
                {/* Truck */}
                <g transform={`translate(${truckX}, ${truckY})`}>
                  <circle cx="0" cy="0" r="10" fill="#f97316" filter="url(#glow)" />
                  <text x="-6" y="4" fill="white" fontSize="10">T</text>
                </g>
                
                {/* Heli */}
                <g transform={`translate(${heliX}, ${heliY - 15})`}>
                  <circle cx="0" cy="0" r="8" fill="#9333ea" filter="url(#glow)" />
                  <text x="-4" y="3" fill="white" fontSize="8">H</text>
                </g>
                
                {/* Drone */}
                <g transform={`translate(${droneX}, ${droneY - 30})`}>
                  <circle cx="0" cy="0" r="6" fill="#3b82f6" filter="url(#glow)" />
                  <text x="-3" y="2" fill="white" fontSize="6">D</text>
                </g>
              </>
            )}
          </svg>
        </div>

      </div>
    </div>
  );
}
