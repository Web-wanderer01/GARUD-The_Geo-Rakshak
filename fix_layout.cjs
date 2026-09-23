const fs = require('fs');
const file = 'src/pages/OperationsPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldGrid = `<FadeIn>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <EmergencyPriority />
              <WeatherForecast />
            </div>
          </FadeIn>`;

const newGrid = `<FadeIn>
            <EmergencyPriority />
          </FadeIn>
          <FadeIn>
            <WeatherForecast />
          </FadeIn>`;

content = content.replace(oldGrid, newGrid);
fs.writeFileSync(file, content);
