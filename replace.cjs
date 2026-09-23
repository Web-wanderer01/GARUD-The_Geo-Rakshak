const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');
content = content.replace('SAT ID: <span className="text-slate-600">INSAT-3DR / RISAT-1A</span>', 'DATA SOURCE: <span className="text-slate-600">OPEN-METEO API</span>');
fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
