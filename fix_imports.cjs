const fs = require('fs');
const file = 'src/pages/OperationsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import { Shield, Activity, Route, CloudRain, AlertTriangle, FileText, Radio, Server, Users } from 'lucide-react';`,
  `import { Shield, Activity, Route, CloudRain, AlertTriangle, FileText, Radio, Server, Users, MapPin } from 'lucide-react';`
);

fs.writeFileSync(file, content);
