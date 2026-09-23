const fs = require('fs');
let tableContent = fs.readFileSync('src/components/operations/DistrictRiskTable.jsx', 'utf8');

tableContent = tableContent.replace(
  /          <\/div>\s*\n\s*\n\s*\n  \);\n\}/,
  `          </div>
        </FadeIn>
  );
}`
);

fs.writeFileSync('src/components/operations/DistrictRiskTable.jsx', tableContent);
