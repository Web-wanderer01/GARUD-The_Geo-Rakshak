const fs = require('fs');

function updateMargins(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/ mt-12 mb-12/g, '');
  content = content.replace(/ min-h-\[300px\]/g, ' h-[300px]');
  fs.writeFileSync(file, content);
}

updateMargins('src/components/demo/EvacuationSimulation.jsx');
updateMargins('src/components/demo/LogisticsDemo.jsx');
updateMargins('src/components/demo/MultiModalLogisticsDemo.jsx');
