const fs = require('fs');
const file = 'src/pages/OperationsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `import DistrictRiskTable from '../components/operations/DistrictRiskTable';`,
  `import DistrictRiskTable from '../components/operations/DistrictRiskTable';
import RiskScoreChart from '../components/operations/RiskScoreChart';`
);

const oldLayout = `          <FadeIn>
            <WeatherForecast />
          </FadeIn>`;

const newLayout = `          <FadeIn>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[550px]">
              <div className="h-full">
                <RiskScoreChart />
              </div>
              <div className="h-full">
                <WeatherForecast />
              </div>
            </div>
          </FadeIn>`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync(file, content);
