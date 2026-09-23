const fs = require('fs');
const reactCode = `import React, { useState, useEffect } from 'react';
import { Plane, Battery, Wifi, Activity, Crosshair, Map, ShieldAlert, Cpu } from 'lucide-react';
import FadeIn from '../common/FadeIn';

export default function DroneSwarmSimulation({ isSimulating }) {
  const [drones, setDrones] = useState([
    { id: 'GARUD-A1', status: 'Standby', battery: 100, alt: 0, target: 'Sector 4', signal: 100 },
    { id: 'GARUD-B2', status: 'Standby', battery: 100, alt: 0, target: 'Sector 9', signal: 100 },
    { id: 'GARUD-C3', status: 'Maintenance', battery: 45, alt: 0, target: 'Base', signal: 0 }
  ]);

  const [scanData, setScanData] = useState([]);

  useEffect(() => {
    if (!isSimulating) {
      setDrones(prev => prev.map(d => d.id === 'GARUD-C3' ? d : { ...d, status: 'Standby', battery: 100, alt: 0, signal: 100 }));
      setScanData([]);
      return;
    }

    // Start simulation
    setDrones(prev => prev.map(d => d.id === 'GARUD-C3' ? d : { ...d, status: 'Deploying', alt: 50 }));
    
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      
      setDrones(prev => prev.map(d => {
        if (d.id === 'GARUD-C3') return d;
        
        let newStatus = 'Scanning';
        let newAlt = 400 + Math.sin(tick * 0.5) * 50;
        let newBat = Math.max(10, d.battery - 0.2);
        let newSig = 80 + Math.random() * 20;

        if (tick > 5 && Math.random() > 0.8) {
          newStatus = 'Subject Detected';
        }

        if (tick > 40) {
          newStatus = 'RTB (Low Bat)';
          newAlt = 200;
        }

        return { ...d, status: newStatus, battery: newBat, alt: newAlt, signal: newSig };
      }));

      if (tick > 5 && tick < 40 && Math.random() > 0.6) {
        setScanData(prev => [...prev.slice(-4), {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'Heat Signature' : 'Structural Damage',
          coords: \`26.\${Math.floor(100+Math.random()*900)}, 91.\${Math.floor(100+Math.random()*900)}\`,
          time: new Date().toISOString().substring(11, 19)
        }]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  return (
    <FadeIn>
      <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-white tracking-wide">AI DRONE SWARM CONTROL</h3>
          </div>
          <div className="flex items-center gap-2">
            <div className={\`w-2.5 h-2.5 rounded-full \${isSimulating ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}\`}></div>
            <span className="text-xs font-mono text-slate-400">{isSimulating ? 'LINK ACTIVE' : 'OFFLINE'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-800">
          
          {/* Drone Status Panel */}
          <div className="bg-slate-900 p-4 space-y-4">
            {drones.map(drone => (
              <div key={drone.id} className={\`p-3 rounded-lg border \${drone.status.includes('Subject') ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700'}\`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="font-mono text-sm font-bold text-slate-200">{drone.id}</div>
                  <div className={\`text-xs font-bold px-2 py-0.5 rounded \${
                    drone.status === 'Standby' ? 'bg-slate-700 text-slate-300' :
                    drone.status === 'Maintenance' ? 'bg-red-900/50 text-red-400' :
                    drone.status.includes('Subject') ? 'bg-amber-500 text-amber-950 animate-pulse' :
                    'bg-blue-900/50 text-blue-400'
                  }\`}>
                    {drone.status}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase"><Battery className="w-3 h-3" /> Bat</div>
                    <div className={\`text-xs font-mono \${drone.battery < 20 ? 'text-red-400' : 'text-emerald-400'}\`}>{drone.battery.toFixed(0)}%</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase"><Activity className="w-3 h-3" /> Alt</div>
                    <div className="text-xs font-mono text-blue-400">{drone.alt.toFixed(0)}m</div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-slate-400 text-[10px] uppercase"><Wifi className="w-3 h-3" /> Sig</div>
                    <div className="text-xs font-mono text-slate-300">{drone.signal.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Radar & Scan Output */}
          <div className="bg-slate-900 p-4 relative overflow-hidden flex flex-col min-h-[300px]">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-xs font-mono text-blue-400 flex items-center gap-2"><Cpu className="w-4 h-4"/> SENSOR TELEMETRY</span>
              <span className="text-[10px] text-slate-500 uppercase">{scanData.length} objects detected</span>
            </div>

            <div className="flex-1 space-y-2 relative z-10 font-mono text-xs overflow-hidden">
              {scanData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 mt-16">
                  <Crosshair className={\`w-8 h-8 mb-2 \${isSimulating ? 'animate-spin' : ''}\`} />
                  {isSimulating ? 'Scanning Sector...' : 'Awaiting Launch Order'}
                </div>
              ) : (
                scanData.map(scan => (
                  <div key={scan.id} className="bg-slate-950/80 border-l-2 border-amber-500 p-2 flex items-start justify-between">
                    <div>
                      <div className="text-amber-400 font-bold mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> {scan.type}
                      </div>
                      <div className="text-slate-400 flex items-center gap-1">
                        <Map className="w-3 h-3" /> {scan.coords}
                      </div>
                    </div>
                    <div className="text-slate-500">{scan.time}</div>
                  </div>
                ))
              )}
            </div>
            
            {isSimulating && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/30 rounded-full flex items-center justify-center pointer-events-none">
                <div className="w-full h-full border-t border-blue-500 rounded-full animate-[spin_2s_linear_infinite]"></div>
              </div>
            )}
          </div>

        </div>
      </div>
    </FadeIn>
  );
}`;

fs.writeFileSync('src/components/demo/DroneSwarmSimulation.jsx', reactCode);
