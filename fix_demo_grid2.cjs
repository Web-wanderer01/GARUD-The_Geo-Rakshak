const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldGrid = `<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        <EvacuationSimulation />
        <LogisticsDemo />
        <MultiModalLogisticsDemo />
      </div>`;

const newGrid = `<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
        <EvacuationSimulation />
        <LogisticsDemo />
        <div className="xl:col-span-2">
          <MultiModalLogisticsDemo />
        </div>
      </div>`;

content = content.replace(oldGrid, newGrid);
fs.writeFileSync(file, content);
