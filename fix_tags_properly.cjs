const fs = require('fs');
let tableContent = fs.readFileSync('src/components/operations/DistrictRiskTable.jsx', 'utf8');

tableContent = tableContent.replace(
  /            <\/div>\n          <\/FadeIn>\n    \);\n  \}/,
  `            </div>
          </div>
        </FadeIn>
  );
}`
);

fs.writeFileSync('src/components/operations/DistrictRiskTable.jsx', tableContent);
