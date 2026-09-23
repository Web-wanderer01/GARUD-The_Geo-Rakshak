const fs = require('fs');
const file = 'src/components/logistics/AIRouteOptimizer.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /<Marker position={getTruckPosition\(\)} icon={TruckIcon}>/,
  "<Marker position={getTruckPosition()} icon={transportMode === 'helicopter' ? HeliIcon : transportMode === 'drone' ? DroneIcon : TruckIcon}>"
);

fs.writeFileSync(file, content);
