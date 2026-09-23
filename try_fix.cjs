const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

content = content.replace(
  '    </div>\n  );\n}',
  '      </div>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', content);
