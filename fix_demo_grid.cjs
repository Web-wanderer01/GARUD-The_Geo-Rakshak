const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `<EvacuationSimulation />
      <LogisticsDemo />
      <MultiModalLogisticsDemo />`;

const newStr = `<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        <EvacuationSimulation />
        <LogisticsDemo />
        <MultiModalLogisticsDemo />
      </div>`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content);
