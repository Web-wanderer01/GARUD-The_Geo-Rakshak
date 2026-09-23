const fs = require('fs');
const file = 'src/components/demo/LogisticsDemo.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/Smart Logistics & Auto-Rerouting Demo/, "Virtual Logistics & Auto-Rerouting Simulation");
content = content.replace(/Simulate how GARUD's AI Logistics Engine/, "Virtually simulate how GARUD's AI Logistics Engine");
fs.writeFileSync(file, content);
