const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

// The file is a mess of strings. Let's just use string replacement carefully.
// 1. We need to extract the Terminal block.
const terminalRegex = /\{\/\* System Terminal Log \*\/\}[\s\S]*?<div ref=\{logsEndRef\} \/>\s*<\/div>\s*<\/div>/;
const terminalMatch = content.match(terminalRegex);
const terminalCode = terminalMatch ? terminalMatch[0] : '';

// 2. We need to extract the Concept Column block.
const conceptRegex = /\{\/\* Concept & Working Side Column \*\/\}[\s\S]*?<\/ol>\s*<\/div>\s*<p>[\s\S]*?<\/p>\s*<\/div>\s*<\/div>/;
const conceptMatch = content.match(conceptRegex);
const conceptCode = conceptMatch ? conceptMatch[0] : '';

// 3. We need to extract the Control Panel.
const controlPanelRegex = /\{\/\* Control Panel \*\/\}[\s\S]*?(?=\{\/\* Right Col: 3D Visualizer \*\/\}|<!-- Right Col)/;
const controlPanelMatch = content.match(controlPanelRegex);
const controlPanelCode = controlPanelMatch ? controlPanelMatch[0] : '';

// 4. We need to extract the 3D Visualizers.
const visualizersRegex = /<LandslideMechanics3D isSimulating=\{isSimulating\} \/>[\s\S]*?<Geological3DVisualizer isSimulating=\{isSimulating\} dispatchTarget=\{dispatchTarget\} \/>/;
const visualizersMatch = content.match(visualizersRegex);
const visualizersCode = visualizersMatch ? visualizersMatch[0] : '';

// 5. We need to extract the Dispatch Approval popup.
const dispatchRegex = /\{\/\* Dispatch Approval Pop-up \*\/\}[\s\S]*?\}\)/;
const dispatchMatch = content.match(dispatchRegex);
const dispatchCode = dispatchMatch ? dispatchMatch[0] : '';

// 6. We need to extract the Bottom Row.
const bottomRowRegex = /<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">[\s\S]*?<\/div>\s*<\/div>\s*\);\s*\}/;
const bottomRowMatch = content.match(bottomRowRegex);
const bottomRowCode = bottomRowMatch ? bottomRowMatch[0] : '';

// Now let's assemble the new return block.
const newReturn = `  return (
    <div className="page-enter max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Virtual Environment Simulation</h1>
            <p className="text-slate-500">Immersive virtual simulation of the automated early-warning and AI dispatch system.</p>
          </div>
        </div>
        {isSirenPlaying && (
          <button 
            onClick={stopSiren}
            className="animate-pulse bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2"
          >
            <AlertTriangle className="w-5 h-5" />
            STOP SIREN
          </button>
        )}
      </div>

      {/* Row 1: Control Panel and Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1 space-y-6">
          ${controlPanelCode.replace(/<div className="lg:col-span-1 space-y-6">/, '').trim().replace(/<\/div>$/, '')}
        </div>
        <div className="lg:col-span-2 h-[600px]">
          ${terminalCode.replace('h-[400px]', 'h-full')}
        </div>
      </div>

      ${dispatchCode}

      {/* Row 2: 3D Scenarios and Concept */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 w-full">
        <div className="lg:col-span-2 space-y-6">
          ${visualizersCode}
        </div>
        <div className="lg:col-span-1 h-full">
          ${conceptCode}
        </div>
      </div>

      ${bottomRowCode}
`;

// Replace everything from `return (` to the end of the file
const fileContent = content.substring(0, content.indexOf('  return (')) + newReturn;

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', fileContent);
