const fs = require('fs');
const file = 'src/pages/OperationsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldLayout = `          <FadeIn>
            <EmergencyPriority />
          </FadeIn>
          <FadeIn>
            <WeatherForecast />
          </FadeIn>

          <FadeIn>
            <DistrictRiskTable />
          </FadeIn>`;

const newLayout = `          <FadeIn>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <DistrictRiskTable />
              <EmergencyPriority />
            </div>
          </FadeIn>
          
          <FadeIn>
            <WeatherForecast />
          </FadeIn>`;

content = content.replace(oldLayout, newLayout);
fs.writeFileSync(file, content);
