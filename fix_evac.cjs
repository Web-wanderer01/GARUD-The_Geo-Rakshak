const fs = require('fs');
const file = 'src/components/demo/EvacuationSimulation.jsx';
let content = fs.readFileSync(file, 'utf8');

const newStats = `          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Evacuation Metrics</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Citizens Safely Evacuated</span>
              <span className="text-green-600 font-bold">{citizens.filter(c => c.evacuated).length} / {citizens.length}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4">
              <div className="bg-green-500 h-2 rounded-full transition-all duration-300" style={{ width: \`\${(citizens.filter(c => c.evacuated).length / citizens.length) * 100}%\` }}></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-700">At Risk (Red Zone)</span>
              <span className="text-red-600 font-bold">{citizens.filter(c => !c.evacuated).length}</span>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">`;

content = content.replace(/<div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">/, newStats);
fs.writeFileSync(file, content);
