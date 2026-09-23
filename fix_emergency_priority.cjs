const fs = require('fs');
const file = 'src/components/operations/EmergencyPriority.jsx';
let content = fs.readFileSync(file, 'utf8');

const newReturn = `  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden transition-shadow hover:shadow-lg">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Emergency Prioritization List
            <InfoTooltip content="Priority Score = Risk Score A- Population Factor A- Infrastructure Factor. Highlights zones requiring immediate administrative focus." />
          </h2>
          <SimulatedDataBadge />
        </div>

        <div className="overflow-x-auto overflow-y-auto max-h-[550px] custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 relative">
            <thead className="text-slate-700 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="bg-slate-50 px-6 py-4 font-semibold text-center w-16 shadow-sm">Rank</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold shadow-sm">Zone</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold text-right shadow-sm">Risk Score</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold text-right shadow-sm">Priority Score</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold shadow-sm">Population / Infra</th>
                <th className="bg-slate-50 px-6 py-4 font-semibold shadow-sm">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {priorityZones.map((zone, idx) => {
                const rLevel = getRiskLevel(zone.riskScore);
                const rConfig = RISK_LEVELS[rLevel];
                return (
                  <tr key={zone.id} className={idx < 3 ? 'bg-red-50/30' : 'hover:bg-slate-50'}>
                    <td className="px-6 py-4 text-center font-bold text-slate-500">#{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{zone.name}</div>
                      <div className="text-xs text-slate-500">{zone.state}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2 py-1 rounded font-bold text-xs" style={{ backgroundColor: rConfig.color + '20', color: rConfig.color }}>
                        {zone.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                      {zone.priorityScore.toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div>{((zone.population || 250000) / 1000).toFixed(0)}k</div>
                      <div className="capitalize text-slate-500">{(zone.infrastructureLevel || 'medium')}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-xs text-slate-600">
                      {getAction(zone.riskScore)}
                    </td>
                  </tr>
                );
              })}
              {priorityZones.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">
                    No high-risk zones currently.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}`;

content = content.replace(/return \([\s\S]*\}\;/m, newReturn);
fs.writeFileSync(file, content);
