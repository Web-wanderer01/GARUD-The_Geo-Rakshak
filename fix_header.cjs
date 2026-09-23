const fs = require('fs');
const file = 'src/components/layout/Header.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/{ name: 'Simulation Demo', path: '\/demo' }/, "{ name: 'Virtual Simulations', path: '/demo' }");
fs.writeFileSync(file, content);
