const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Update Title and Subtitle
content = content.replace(/GARUD Live Disaster Simulation Engine/, "GARUD Virtual Simulations Hub");
content = content.replace(/Interactive demonstration of how the system triggers/, "Run hyper-realistic virtual scenarios to train the AI engine, simulate");

fs.writeFileSync(file, content);
