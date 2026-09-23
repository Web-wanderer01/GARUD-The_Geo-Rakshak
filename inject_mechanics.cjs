const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

// Add import
content = content.replace(
  "import Geological3DVisualizer from '../components/demo/Geological3DVisualizer';",
  "import Geological3DVisualizer from '../components/demo/Geological3DVisualizer';\nimport LandslideMechanics3D from '../components/demo/LandslideMechanics3D';"
);

// Inject into render, above the Geological3DVisualizer
content = content.replace(
  "{/* 3D Geological Visualizer (Now below terminal) */}",
  `<LandslideMechanics3D isSimulating={isSimulating} />\n            {/* 3D Geological Visualizer (Now below terminal) */}`
);

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', content);
