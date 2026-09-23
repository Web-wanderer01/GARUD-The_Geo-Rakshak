const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

// Add import
content = content.replace(
  "import EvacuationSimulation from '../components/demo/EvacuationSimulation';",
  "import EvacuationSimulation from '../components/demo/EvacuationSimulation';\nimport DroneSwarmSimulation from '../components/demo/DroneSwarmSimulation';"
);

// Inject component into grid
content = content.replace(
  `<EvacuationSimulation />
          <LogisticsDemo />`,
  `<EvacuationSimulation />
          <DroneSwarmSimulation isSimulating={isSimulating} />
          <LogisticsDemo />`
);

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', content);
