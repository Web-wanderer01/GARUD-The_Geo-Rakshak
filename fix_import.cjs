const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

if (!content.includes('import Satellite3DVisualizer')) {
  content = content.replace(
    "import { zones } from '../../data/zones';",
    "import { zones } from '../../data/zones';\nimport Satellite3DVisualizer from './Satellite3DVisualizer';"
  );
  fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
}
