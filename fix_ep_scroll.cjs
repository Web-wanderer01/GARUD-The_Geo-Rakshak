const fs = require('fs');
const file = 'src/components/operations/EmergencyPriority.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('max-h-[400px]', 'max-h-[550px]');

fs.writeFileSync(file, content);
