const fs = require('fs');
let content = fs.readFileSync('src/components/operations/RiskScoreChart.jsx', 'utf8');

// Slice the top 15 zones to prevent chart overflow
content = content.replace('const sortedZones = [...liveZones].sort((a, b) => b.riskScore - a.riskScore);', 'const sortedZones = [...liveZones].sort((a, b) => b.riskScore - a.riskScore).slice(0, 15);');

// Change the title to indicate it's the Top 15
content = content.replace('<h3 className="text-base font-semibold text-slate-800 mb-6">Risk Scores by Zone</h3>', '<h3 className="text-base font-semibold text-slate-800 mb-6">Top 15 Highest Risk Zones</h3>');

fs.writeFileSync('src/components/operations/RiskScoreChart.jsx', content);
