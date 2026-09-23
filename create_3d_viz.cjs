const fs = require('fs');

const reactCode = `import React, { useState, useEffect } from 'react';
import { Satellite, Scan, Box, Activity } from 'lucide-react';

export default function Satellite3DVisualizer({ targetName, threatLevel, isScanning }) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isScanning) {
      setRotation(prev => prev + 180);
    }
  }, [isScanning]);

  const getThemeColor = () => {
    if (threatLevel === 'critical') return 'rgba(239, 68, 68, '; // Red
    if (threatLevel === 'warning') return 'rgba(249, 115, 22, '; // Orange
    return 'rgba(59, 130, 246, '; // Blue
  };
  
  const theme = getThemeColor();

  return (
    <div className="w-full h-72 md:h-80 bg-slate-950 rounded-xl overflow-hidden relative mb-6 border border-slate-800 shadow-inner group">
      
      {/* Top UI Overlay */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 text-white font-bold tracking-wider text-sm bg-black/50 px-3 py-1.5 rounded backdrop-blur-sm border border-slate-700">
            <Box className="w-4 h-4 text-blue-400" />
            3D TOPOGRAPHICAL ANALYSIS
          </div>
          <div className="text-slate-400 text-xs font-mono mt-2 bg-black/40 inline-block px-2 py-1 rounded">
            TARGET: {targetName.toUpperCase()}
          </div>
        </div>
        
        <div className="text-right bg-black/50 p-2 rounded backdrop-blur-sm border border-slate-700">
          <div className="text-[10px] text-slate-400 font-mono">ISRO/NRSC LIVE FEED</div>
          <div className="text-blue-400 font-bold flex items-center justify-end gap-1 text-xs mt-1">
            <Activity className="w-3 h-3" /> ORBITAL SYNC ACTIVE
          </div>
        </div>
      </div>

      {/* 3D Container */}
      <div className="absolute inset-0 flex items-center justify-center [perspective:1200px]">
        <div 
          className="relative w-64 h-64 md:w-80 md:h-80 transition-all duration-[3000ms] ease-in-out [transform-style:preserve-3d]"
          style={{ transform: \`rotateX(60deg) rotateZ(\${rotation + 45}deg)\` }}
        >
          {/* Base Grid */}
          <div 
            className="absolute inset-0 bg-slate-900 border-2 rounded-lg [transform-style:preserve-3d]"
            style={{ 
              borderColor: \`\${theme}0.4)\`,
              backgroundImage: \`linear-gradient(\${theme}0.2) 1px, transparent 1px), linear-gradient(90deg, \${theme}0.2) 1px, transparent 1px)\`, 
              backgroundSize: '20px 20px',
              boxShadow: \`0 0 50px \${theme}0.1) inset\`
            }}
          >
            
            {/* Terrain Layers (Mock 3D Elevation) */}
            <div className="absolute w-40 h-40 left-10 top-10 rounded-full blur-[2px] [transform:translateZ(10px)]" style={{ backgroundColor: \`\${theme}0.1)\`, border: \`1px solid \${theme}0.2)\` }}></div>
            <div className="absolute w-32 h-32 left-14 top-14 rounded-full blur-[1px] [transform:translateZ(25px)]" style={{ backgroundColor: \`\${theme}0.15)\`, border: \`1px solid \${theme}0.3)\` }}></div>
            <div className="absolute w-20 h-20 left-20 top-20 rounded-full [transform:translateZ(45px)]" style={{ backgroundColor: \`\${theme}0.2)\`, border: \`1px solid \${theme}0.5)\` }}></div>
            <div className="absolute w-10 h-10 left-24 top-24 rounded-full [transform:translateZ(65px)]" style={{ backgroundColor: \`\${theme}0.4)\`, border: \`2px solid \${theme}0.8)\` }}></div>
            
            <div className="absolute w-24 h-24 right-10 bottom-10 rounded-full blur-[2px] [transform:translateZ(15px)]" style={{ backgroundColor: \`\${theme}0.1)\`, border: \`1px solid \${theme}0.2)\` }}></div>
            <div className="absolute w-12 h-12 right-16 bottom-16 rounded-full [transform:translateZ(30px)]" style={{ backgroundColor: \`\${theme}0.2)\`, border: \`1px solid \${theme}0.4)\` }}></div>

            {/* Satellite Target Laser */}
            {isScanning && (
              <div className="absolute left-24 top-24 w-1 bg-white [transform:translateZ(65px)_rotateX(-90deg)] origin-bottom shadow-[0_0_20px_#fff]" style={{ height: '300px', boxShadow: \`0 0 20px 2px \${theme}1)\` }}></div>
            )}
            
            {/* Danger Markers */}
            {threatLevel === 'critical' && !isScanning && (
              <>
                <div className="absolute w-4 h-4 left-24 top-24 bg-red-500 rounded-full [transform:translateZ(70px)] animate-ping"></div>
                <div className="absolute w-4 h-4 left-24 top-24 bg-red-600 rounded-full [transform:translateZ(70px)] border-2 border-white"></div>
                
                {/* 3D Floating Alert Box */}
                <div className="absolute left-28 top-16 w-32 bg-red-950/80 border border-red-500 p-2 rounded backdrop-blur-sm [transform:translateZ(100px)_rotateX(-90deg)_rotateY(-45deg)]">
                  <div className="text-red-400 text-[10px] font-bold">STRUCTURAL INSTABILITY</div>
                  <div className="text-white text-[9px]">Slope failure imminent.</div>
                </div>
              </>
            )}

            {threatLevel === 'warning' && !isScanning && (
              <>
                <div className="absolute w-3 h-3 left-24 top-24 bg-orange-500 rounded-full [transform:translateZ(70px)] animate-ping"></div>
                <div className="absolute w-3 h-3 left-24 top-24 bg-orange-600 rounded-full [transform:translateZ(70px)] border border-white"></div>
              </>
            )}

            {/* Scanning Plane Effect */}
            {isScanning && (
              <div className="absolute top-0 left-0 w-full h-2 bg-blue-400/50 blur-[2px] shadow-[0_0_30px_#3b82f6] animate-[scan_2s_linear_infinite] [transform:translateZ(30px)]"></div>
            )}

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}} />
    </div>
  );
}`;

fs.writeFileSync('src/components/analytics/Satellite3DVisualizer.jsx', reactCode);
