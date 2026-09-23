const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Remove imports
content = content.replace(/import SOSButton from '\.\/components\/common\/SOSButton';\n/, '');
content = content.replace(/import AIAssistant from '\.\/components\/ai\/AIAssistant';\n/, '');

// Remove components
content = content.replace(/<SOSButton \/>/g, '');
content = content.replace(/<AIAssistant \/>/g, '');

fs.writeFileSync(file, content);
