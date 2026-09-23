const fs = require('fs');
const file = 'src/components/logistics/AIRouteOptimizer.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import Plane and Navigation
content = content.replace(
  /import { GitMerge, Route, AlertOctagon, CheckCircle2, ArrowRight, Activity, Map as MapIcon, Clock, Truck, List } from 'lucide-react';/,
  "import { GitMerge, Route, AlertOctagon, CheckCircle2, ArrowRight, Activity, Map as MapIcon, Clock, Truck, List, Plane, Navigation } from 'lucide-react';"
);

// 2. Add Helicopter and Drone Icons
const customIcons = `
const HeliIcon = L.divIcon({
  html: \`<div class="bg-purple-600 text-white p-1.5 rounded-full border-2 border-white shadow-lg shadow-purple-500/50 flex items-center justify-center animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2 16 11l-3.5-3.5C11.6 6.6 10.4 6 9 6c-2.3 0-3.6 1.8-3.1 4l1.2 5 2.1 4.2c.4.7 1.1 1.2 1.9 1.4.8.1 1.6-.1 2.3-.5l4.4-2.9z"/><path d="M22 6h-6"/><path d="M20 9V3"/><path d="M2 19h10"/></svg></div>\`,
  className: 'custom-heli-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});

const DroneIcon = L.divIcon({
  html: \`<div class="bg-blue-400 text-white p-1.5 rounded-full border-2 border-white shadow-lg shadow-blue-400/50 flex items-center justify-center animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg></div>\`,
  className: 'custom-drone-icon',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15]
});
`;
content = content.replace(/const TruckIcon = L\.divIcon\(\{[\s\S]*?\}\);/, `$&` + "\n" + customIcons);

// 3. Add transportMode state
content = content.replace(
  /const \[cargo, setCargo\] = useState\(''\);/,
  "const [cargo, setCargo] = useState('');\n  const [transportMode, setTransportMode] = useState('truck');"
);

// 4. Update the form to include the dropdown and update the AI Suggest button
const oldFormGroup = `<input 
            type="text"
            placeholder="Enter Cargo Details (e.g. Medical Supplies, Tents)..."
            value={cargo}
            onChange={e => setCargo(e.target.value)}
            className="flex-\\[2\\] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
          <button 
            type="button"
            onClick={() => {
              setOrigin("Guwahati Supply Depot");
              setDestination("Dima Hasao (Landslide Zone)");
              setCargo("3x Earth Movers, 200 Emergency Medical Kits, 500 Tents");
            }}`;

const newFormGroup = `<select 
            value={transportMode}
            onChange={e => setTransportMode(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          >
            <option value="truck">?? Truck</option>
            <option value="helicopter">?? Heli</option>
            <option value="drone">?? Drone</option>
          </select>
          <input 
            type="text"
            placeholder="Enter Cargo Details..."
            value={cargo}
            onChange={e => setCargo(e.target.value)}
            className="flex-[2] bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
          />
          <button 
            type="button"
            onClick={() => {
              const r = Math.random();
              if (r < 0.33) {
                 setOrigin("Shillong Airbase");
                 setDestination("Cherrapunji (Isolated)");
                 setCargo("Anti-Venom & Urgent Blood Plasma");
                 setTransportMode("drone");
              } else if (r < 0.66) {
                 setOrigin("Tezpur NDRF Depot");
                 setDestination("Tawang");
                 setCargo("Food Rations, Water, Tents");
                 setTransportMode("helicopter");
              } else {
                 setOrigin("Guwahati Supply Depot");
                 setDestination("Dima Hasao (Landslide Zone)");
                 setCargo("3x Earth Movers, 200 Emergency Medical Kits, 500 Tents");
                 setTransportMode("truck");
              }
            }}`;

content = content.replace(oldFormGroup, newFormGroup);

// 5. Update the live tracking marker to use the correct icon based on transportMode
content = content.replace(
  /<Marker position={\[liveLat, liveLng\]} icon={TruckIcon}>/,
  "<Marker position={[liveLat, liveLng]} icon={transportMode === 'helicopter' ? HeliIcon : transportMode === 'drone' ? DroneIcon : TruckIcon}>"
);

fs.writeFileSync(file, content);
