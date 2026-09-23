const fs = require('fs');
const file = 'src/components/demo/Geological3DVisualizer.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/Geological Interface System & AI Dispatch Engine/, "Virtual 3D Scenario & AI Dispatch Engine");
fs.writeFileSync(file, content);
