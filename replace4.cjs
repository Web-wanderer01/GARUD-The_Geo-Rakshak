const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

// 1. Add import
content = content.replace("import { SurfaceDisplacement3D, SoilMoisture3D, Precipitation3D } from './Mini3DVisualizers';", 
"import { SurfaceDisplacement3D, SoilMoisture3D, Precipitation3D } from './Mini3DVisualizers';\nimport LocationSearch from '../map/LocationSearch';");

// 2. Replace the select dropdown
const oldSelect = `<select 
                  value={targetName} 
                  onChange={handleLocationChange} 
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={isScanning}
                >
                   {Object.entries(groupedZones).map(([stateName, stateZones]) => (
                      <optgroup key={stateName} label={stateName}>
                        {stateZones.map(z => (
                          <option key={z.id} value={z.name}>{z.name} ({z.district})</option>
                        ))}
                      </optgroup>
                   ))}
                </select>`;

const newSearch = `<div className="relative z-50">
                   <LocationSearch 
                     onLocationSelect={(z) => {
                        setSelectedZone(z);
                        setTargetName(z.name);
                        setTargetState(z.state);
                        setLat(z.lat);
                        setLng(z.lng);
                        executeScanPipeline(z);
                     }}
                   />
                </div>`;

// 3. Remove handleLocationChange if not used anymore, but it's fine to leave it.
// Replace the select
content = content.replace(oldSelect, newSearch);

fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
