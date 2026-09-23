const fs = require('fs');
const file = 'src/pages/HomePage.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/a\.translations\.en\.title/g, "a.message");
fs.writeFileSync(file, content);
