const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/Disaster Simulation & Alert Demo/, "Virtual Environment Simulation");
content = content.replace(/Live demonstration of the automated early-warning dispatch system./, "Immersive virtual simulation of the automated early-warning and AI dispatch system.");
content = content.replace(/simulate success for the demo/g, "simulate success for the virtual simulation");
fs.writeFileSync(file, content);
