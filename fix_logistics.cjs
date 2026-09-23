const fs = require('fs');
const file = 'src/components/logistics/AIRouteOptimizer.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add cargo state
content = content.replace(
  /const \[destination, setDestination\] = useState\(''\);/,
  "const [destination, setDestination] = useState('');\n  const [cargo, setCargo] = useState('');"
);

// 2. Replace the form completely
const oldFormRegex = /<form onSubmit=\{handleOptimize\}([\s\S]*?)<\/form>/;
const newForm = `<form onSubmit={handleOptimize} className="flex flex-col gap-3 mb-6 w-full">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input 
            type="text"
            placeholder="Enter Dispatch Base (Origin)..."
            value={origin}
            onChange={e => setOrigin(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
          <ArrowRight className="w-5 h-5 text-slate-400 self-center hidden sm:block transform rotate-90 sm:rotate-0" />
          <input 
            type="text"
            placeholder="Enter Impact Zone (Destination)..."
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <input 
            type="text"
            placeholder="Enter Cargo Details (e.g. Medical Supplies, Tents)..."
            value={cargo}
            onChange={e => setCargo(e.target.value)}
            className="flex-[2] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
          <button 
            type="button"
            onClick={() => {
              setOrigin("Guwahati Supply Depot");
              setDestination("Dima Hasao (Landslide Zone)");
              setCargo("3x Earth Movers, 200 Emergency Medical Kits, 500 Tents");
            }}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
          >
            <Activity className="w-4 h-4" /> AI Suggest
          </button>
          <button 
            type="submit"
            disabled={isCalculating || !origin || !destination || !cargo}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isCalculating ? <Activity className="w-4 h-4 animate-spin" /> : 'Dispatch Fleet'}
          </button>
        </div>
      </form>`;
content = content.replace(oldFormRegex, newForm);

// 3. Display cargo in the fleet tracking panel
content = content.replace(
  /<span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">/,
  `<div className="text-xs font-medium text-slate-600 mb-1 line-clamp-1 border-b border-slate-100 pb-2">?? {cargo}</div>\n                    <span className="text-xs font-bold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase tracking-wider">`
);

// 4. Update the Moving Truck Marker to show cargo
content = content.replace(
  /<Popup><div className="font-bold text-blue-700">Target Fleet<\/div><div className="text-xs">Speed: 60 km\/h<\/div><\/Popup>/,
  `<Popup><div className="font-bold text-blue-700">Target Fleet</div><div className="text-xs font-medium mt-1">?? {cargo}</div><div className="text-xs text-slate-500 mt-1">Speed: 60 km/h</div></Popup>`
);

// 5. Replace dispatchFleet call to pass cargo
content = content.replace(
  /cargo: 'Emergency Supplies',/,
  "cargo: cargo,"
);

fs.writeFileSync(file, content);
