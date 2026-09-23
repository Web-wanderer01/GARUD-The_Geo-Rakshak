const fs = require('fs');
const file = 'src/components/logistics/AIRouteOptimizer.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldDispatch = `dispatchFleet({
          id: 'NDRF-' + Math.floor(Math.random() * 900 + 100),
          category: 'medicine',
          cargo: cargo,
          origin: origin,
          destination: destination,
          status: 'on-time',`;

const newDispatch = `dispatchFleet({
          id: (transportMode === 'helicopter' ? 'HELI-' : transportMode === 'drone' ? 'DRN-' : 'TRK-') + Math.floor(Math.random() * 900 + 100),
          category: 'medicine',
          transportMode: transportMode,
          cargo: cargo,
          origin: origin,
          destination: destination,
          status: 'on-time',`;

content = content.replace(oldDispatch, newDispatch);
fs.writeFileSync(file, content);
