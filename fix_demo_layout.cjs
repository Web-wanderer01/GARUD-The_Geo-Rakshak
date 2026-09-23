const fs = require('fs');

function updateComponent(file) {
  let content = fs.readFileSync(file, 'utf8');
  // Make the inner layout single column (remove lg:grid-cols-X)
  content = content.replace(/grid grid-cols-1 lg:grid-cols-\d+ gap-8/, 'flex flex-col gap-8');
  // Make the header single column (remove md:flex-row)
  content = content.replace(/flex flex-col md:flex-row md:items-center justify-between/, 'flex flex-col gap-4');
  fs.writeFileSync(file, content);
}

updateComponent('src/components/demo/EvacuationSimulation.jsx');
updateComponent('src/components/demo/LogisticsDemo.jsx');
updateComponent('src/components/demo/MultiModalLogisticsDemo.jsx');
