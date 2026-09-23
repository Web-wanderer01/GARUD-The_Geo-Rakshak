const fs = require('fs');
let content = fs.readFileSync('src/components/map/LocationSearch.jsx', 'utf8');
content = content.replace('export default function LocationSearch({ onLocationSelect }) {', 'export default function LocationSearch({ onLocationSelect, compact = false }) {');
content = content.replace('{selectedZone && !showDropdown && (', '{selectedZone && !showDropdown && !compact && (');
fs.writeFileSync('src/components/map/LocationSearch.jsx', content);

let content2 = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');
content2 = content2.replace('<LocationSearch ', '<LocationSearch compact={true} ');
fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content2);
