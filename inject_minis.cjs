const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

// Add import
if (!content.includes('SurfaceDisplacement3D')) {
  content = content.replace(
    "import Satellite3DVisualizer from './Satellite3DVisualizer';",
    "import Satellite3DVisualizer from './Satellite3DVisualizer';\nimport { SurfaceDisplacement3D, SoilMoisture3D, Precipitation3D } from './Mini3DVisualizers';"
  );
}

// 1. Replace SAR animation
content = content.replace(
  /<div className="absolute inset-0 border border-green-500\/30 rounded-lg overflow-hidden">[\s\S]*?<div className="absolute top-1\/2 right-1\/4 w-1\.5 h-1\.5 bg-green-500 rounded-full"><\/div>\n\s*<\/div>/,
  `<SurfaceDisplacement3D displacement={scanData.displacement} isScanning={isScanning} />`
);

// 2. Replace Thermal animation
content = content.replace(
  /<div className="absolute inset-0 bg-slate-800">[\s\S]*?<\/svg>/,
  `<SoilMoisture3D saturation={scanData.saturation} isScanning={isScanning} />`
);

// 3. Replace Precipitation animation
content = content.replace(
  /<div className="absolute inset-0 bg-\[radial-gradient\(circle_at_center,var\(--tw-gradient-stops\)\)\] from-slate-800 to-slate-900">[\s\S]*?<div className="absolute top-1\/2 left-1\/2 w-16 h-16 bg-indigo-500\/50 rounded-full filter blur-\[15px\] animate-pulse -translate-x-1\/2 -translate-y-1\/2"><\/div>\n\s*<\/div>/,
  `<Precipitation3D intensity={scanData.intensity} isScanning={isScanning} />`
);

fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
