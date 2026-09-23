const fs = require('fs');

function fixHeader(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/flex flex-col gap-4 gap-4/, 'flex flex-col gap-4');
  fs.writeFileSync(file, content);
}

fixHeader('src/components/demo/EvacuationSimulation.jsx');
fixHeader('src/components/demo/LogisticsDemo.jsx');
