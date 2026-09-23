const fs = require('fs');
const file = 'src/components/analytics/MultiParameterFramework.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldData = `const twentyYearData = [
    { year: '2004', rainfall: 2100, landslides: 45, seismic: 12 },
    { year: '2008', rainfall: 2350, landslides: 60, seismic: 18 },
    { year: '2012', rainfall: 2600, landslides: 75, seismic: 22 },
    { year: '2016', rainfall: 3100, landslides: 95, seismic: 30 },
    { year: '2020', rainfall: 3450, landslides: 120, seismic: 45 },
    { year: '2024', rainfall: 3900, landslides: 156, seismic: 65 },
  ];`;

const newData = `const twentyYearData = [
    { year: '2004', rainfall: 2100, landslides: 45, seismic: 12 },
    { year: '2008', rainfall: 2350, landslides: 60, seismic: 18 },
    { year: '2012', rainfall: 2600, landslides: 75, seismic: 22 },
    { year: '2016', rainfall: 3100, landslides: 95, seismic: 30 },
    { year: '2020', rainfall: 3450, landslides: 120, seismic: 45 },
    { year: '2024', rainfall: 3900, landslides: 156, seismic: 65 },
    // AI Predictions
    { year: '2028 (Pred)', rainfall: 4200, landslides: 180, seismic: 70, isPrediction: true },
    { year: '2032 (Pred)', rainfall: 4600, landslides: 210, seismic: 85, isPrediction: true },
  ];`;

content = content.replace(oldData, newData);

const oldHeader = `<p className="text-sm text-slate-500">Historical Comparison & Statistical Trends (2004 - 2024)</p>`;
const newHeader = `<p className="text-sm text-slate-500">Historical Comparison & AI Predictive Modeling (2004 - 2032)</p>`;
content = content.replace(oldHeader, newHeader);

const oldChart = `<Area type="monotone" dataKey="rainfall" name="Avg Annual Rainfall (mm)" fill="#bfdbfe" stroke="#3b82f6" strokeWidth={2} />`;
const newChart = `<Area type="monotone" dataKey="rainfall" name="Avg Annual Rainfall (mm)" fill="#bfdbfe" stroke="#3b82f6" strokeWidth={2} dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.isPrediction) {
                    return <circle cx={cx} cy={cy} r={4} fill="#f59e0b" stroke="#f59e0b" strokeWidth={2} />;
                  }
                  return <circle cx={cx} cy={cy} r={4} fill="#3b82f6" stroke="none" />;
                }} />`;
content = content.replace(oldChart, newChart);

const oldLine = `<Line type="monotone" yAxisId="right" dataKey="landslides" name="Reported Landslides" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />`;
const newLine = `<Line type="monotone" yAxisId="right" dataKey="landslides" name="Reported Landslides" stroke="#ef4444" strokeWidth={3} dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.isPrediction) {
                    return <circle cx={cx} cy={cy} r={5} fill="#ef4444" stroke="#fef08a" strokeWidth={2} strokeDasharray="3 3" />;
                  }
                  return <circle cx={cx} cy={cy} r={4} fill="#ef4444" stroke="none" />;
                }} activeDot={{ r: 6 }} />`;
content = content.replace(oldLine, newLine);

fs.writeFileSync(file, content);
