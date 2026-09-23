const fs = require('fs');
let tableContent = fs.readFileSync('src/components/operations/DistrictRiskTable.jsx', 'utf8');

const oldStr = `              );
            })}
          </div>
        </FadeIn>
  );
}`;

const newStr = `              );
            })}
          </div>
          </div>
        </FadeIn>
  );
}`;

tableContent = tableContent.replace(oldStr, newStr);

fs.writeFileSync('src/components/operations/DistrictRiskTable.jsx', tableContent);
