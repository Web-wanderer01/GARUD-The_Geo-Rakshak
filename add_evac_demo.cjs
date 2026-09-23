const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Import it at the top
content = content.replace(
  /import MultiModalLogisticsDemo from '\.\.\/components\/demo\/MultiModalLogisticsDemo';/,
  "import MultiModalLogisticsDemo from '../components/demo/MultiModalLogisticsDemo';\nimport EvacuationSimulation from '../components/demo/EvacuationSimulation';"
);

// Add it to the render block just above LogisticsDemo
content = content.replace(
  /<LogisticsDemo \/>/,
  "<EvacuationSimulation />\n      <LogisticsDemo />"
);

fs.writeFileSync(file, content);
