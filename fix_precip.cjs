const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

// Replace Precipitation Density block
const precipOld = `<div className="absolute inset-0 bg-slate-800 overflow-hidden">
                       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.2)_0%,transparent_100%)]"></div>
                       
                       <div className="absolute top-0 left-0 w-[200%] h-full flex opacity-60 animate-[slide_20s_linear_infinite]" style={{ animationName: 'slide' }}>
                         <div className="w-1/2 h-full flex items-center justify-center">
                            <div className="w-32 h-32 bg-white/30 rounded-full filter blur-[20px]"></div>
                            <div className="w-48 h-48 bg-blue-400/20 rounded-full filter blur-[25px] -ml-10 mt-10"></div>
                         </div>
                         <div className="w-1/2 h-full flex items-center justify-center">
                            <div className="w-32 h-32 bg-white/30 rounded-full filter blur-[20px]"></div>
                            <div className="w-48 h-48 bg-blue-400/20 rounded-full filter blur-[25px] -ml-10 mt-10"></div>
                         </div>
                       </div>
                       
                       <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-indigo-500/50 rounded-full filter blur-[15px] animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
                    </div>`;

content = content.replace(precipOld, `<Precipitation3D intensity={scanData.intensity} isScanning={isScanning} />`);

fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
