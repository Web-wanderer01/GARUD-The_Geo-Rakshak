const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

// 1. Add terminalContainerRef if not exists
if (!content.includes('terminalContainerRef')) {
  content = content.replace('const logsEndRef = useRef(null);', 'const logsEndRef = useRef(null);\n  const terminalContainerRef = useRef(null);');
}

// 2. Fix the useEffect using a Regex to handle any whitespace
content = content.replace(
  /useEffect\(\(\) => \{\s*logsEndRef\.current\?\.scrollIntoView\(\{ behavior: 'auto' \}\);\s*\}, \[logs\]\);/g,
  `useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [logs, progress]);`
);

// 3. Attach ref to container (use Regex to find the div)
if (!content.includes('ref={terminalContainerRef}')) {
  content = content.replace(
    /<div className="flex-1 p-6 overflow-y-auto text-sm">/g, 
    '<div ref={terminalContainerRef} className="flex-1 p-6 overflow-y-auto text-sm">'
  );
}

// 4. Inject the Side Column for the Terminal
const oldTerminalWrapper = `<div className="w-full mb-8">`;
const newTerminalWrapper = `<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mb-8">
        <div className="lg:col-span-2">`;

const sideColumnHtml = `
        </div>
        
        {/* Concept & Working Side Column */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
           <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
             <Activity className="w-5 h-5 text-blue-600" />
             How This Simulation Works
           </h3>
           <div className="space-y-4 text-sm text-slate-600 flex-1 overflow-y-auto pr-2">
             <p>
               <strong>Concept:</strong> The Virtual Environment Simulation is designed to demonstrate GARUD's automated capabilities during a high-stress emergency event, without waiting for a real disaster to occur.
             </p>
             <p>
               <strong>The AI Dispatcher:</strong> When you initiate the simulation, the system mocks live telemetry from IoT sensors across the selected zone. Once risk thresholds cross <span className="font-mono text-red-500 bg-red-50 px-1 rounded">90%</span>, the AI engine autonomously takes control.
             </p>
             <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2 text-xs">
                <ol className="list-decimal pl-4 space-y-2">
                  <li><strong>Detection:</strong> Predicts impending slope failure using meteorological spikes.</li>
                  <li><strong>Alerting:</strong> Sounds regional sirens and broadcasts automated SMS warnings to registered citizens.</li>
                  <li><strong>Mobilization:</strong> Dispatches NDRF/SDRF field units based on nearest geolocation.</li>
                </ol>
             </div>
             <p>
               <strong>Zero-Latency Action:</strong> Notice how the terminal streams commands in real-time. In a genuine deployment, this eliminates the critical "human deliberation" delay that often costs lives during sudden flash floods or night-time landslides.
             </p>
           </div>
        </div>
`;

// Wrap the terminal in the grid
content = content.replace(oldTerminalWrapper, newTerminalWrapper);

// Close the lg:col-span-2 and add the side column after the terminal
content = content.replace(
  /GARUD Intelligence Engine Online\. Monitoring live telemetry\.\.\.[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
  match => match + sideColumnHtml
);

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', content);
