const fs = require('fs');
const file = 'src/pages/DisasterDemoPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Import it at the top
content = content.replace(
  /import LogisticsDemo from '\.\.\/components\/demo\/LogisticsDemo';/,
  "import LogisticsDemo from '../components/demo/LogisticsDemo';\nimport MultiModalLogisticsDemo from '../components/demo/MultiModalLogisticsDemo';"
);

// 2. Add it below the LogisticsDemo
content = content.replace(
  /<LogisticsDemo \/>/,
  "<LogisticsDemo />\n      <MultiModalLogisticsDemo />"
);

fs.writeFileSync(file, content);
