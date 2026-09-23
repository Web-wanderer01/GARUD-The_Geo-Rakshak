const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

// Add import
content = content.replace(
  "import { Satellite, Scan, Activity, Target, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Droplets } from 'lucide-react';",
  "import { Satellite, Scan, Activity, Target, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Droplets } from 'lucide-react';\nimport Satellite3DVisualizer from './Satellite3DVisualizer';"
);

// Inject 3D visualizer above the 3 visual cards
content = content.replace(
  "{/* 3 Visual Cards */}",
  `<Satellite3DVisualizer targetName={targetName} threatLevel={scanData.threatLevel} isScanning={isScanning} />\n\n            {/* 3 Visual Cards */}`
);

fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
