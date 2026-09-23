const fs = require('fs');
const file = 'src/components/demo/MultiModalLogisticsDemo.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldDrone = `<div className="text-xs text-slate-600">Cargo: Anti-venom & Blood <br/>ETA: 12 Mins (Direct Flight)</div>`;
const newDrone = `<div className="text-xs text-slate-600 w-full">
                     <div className="flex justify-between mb-1"><span>Cargo: Anti-venom</span> <span>ETA: 12 Mins</span></div>
                     <div className="flex gap-2 w-full mt-2">
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">PAYLOAD</span><span className="font-mono text-blue-600">4.2/5kg</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">SPEED</span><span className="font-mono text-blue-600">65km/h</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">BATTERY</span><span className="font-mono text-blue-600">88%</span></div>
                     </div>
                   </div>`;
content = content.replace(oldDrone, newDrone);

const oldHeli = `<div className="text-xs text-slate-600">Cargo: NDRF Personnel & Tents <br/>ETA: 35 Mins (Direct Flight)</div>`;
const newHeli = `<div className="text-xs text-slate-600 w-full">
                     <div className="flex justify-between mb-1"><span>Cargo: Personnel & Tents</span> <span>ETA: 35 Mins</span></div>
                     <div className="flex gap-2 w-full mt-2">
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">PAYLOAD</span><span className="font-mono text-purple-600">800/1000kg</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">SPEED</span><span className="font-mono text-purple-600">220km/h</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">FUEL</span><span className="font-mono text-purple-600">65%</span></div>
                     </div>
                   </div>`;
content = content.replace(oldHeli, newHeli);

const oldTruck = `<div className="text-xs text-slate-600">Cargo: Excavators & Earth Movers <br/>ETA: 4 Hours (Road Route)</div>`;
const newTruck = `<div className="text-xs text-slate-600 w-full">
                     <div className="flex justify-between mb-1"><span>Cargo: Earth Movers</span> <span>ETA: 4 Hours</span></div>
                     <div className="flex gap-2 w-full mt-2">
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">PAYLOAD</span><span className="font-mono text-orange-600">12/15 Ton</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">SPEED</span><span className="font-mono text-orange-600">45km/h</span></div>
                       <div className="flex-1 bg-slate-100 rounded p-1 text-center"><span className="block text-[10px] text-slate-400">FUEL</span><span className="font-mono text-orange-600">90%</span></div>
                     </div>
                   </div>`;
content = content.replace(oldTruck, newTruck);

fs.writeFileSync(file, content);
