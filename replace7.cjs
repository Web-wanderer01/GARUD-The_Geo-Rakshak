const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

const aiGuidanceHtml = `
          {/* AI GUIDANCE PANEL */}
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 mb-6 shadow-lg">
             <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-3">
               <Activity className="w-5 h-5 text-blue-400" />
               <h3 className="text-white font-bold text-sm">GARUD AI GUIDANCE & PREDICTIONS</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <h4 className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">PREDICTION</h4>
                   <p className="text-sm text-slate-300">
                     {riskAssessment.riskLevel === 'critical' ? 'High probability of slope failure within 48 hours. Soil saturation reaching critical thresholds alongside active displacement.' :
                      riskAssessment.riskLevel === 'warning' ? 'Elevated risk of localized landslides. Monitoring surface displacement and incoming precipitation fronts.' :
                      'Terrain stable. Normal seasonal variations detected. No immediate risk of widespread slope failure.'}
                   </p>
                </div>
                <div>
                   <h4 className="text-[10px] text-slate-500 font-bold tracking-wider mb-1">RECOMMENDED ACTION</h4>
                   <div className={\`text-sm font-medium \${riskAssessment.riskLevel === 'critical' ? 'text-red-400' : riskAssessment.riskLevel === 'warning' ? 'text-orange-400' : 'text-emerald-400'}\`}>
                     {riskAssessment.riskLevel === 'critical' ? 'Initiate early warning protocols. Halt rail traffic in affected sectors.' :
                      riskAssessment.riskLevel === 'warning' ? 'Increase monitoring frequency. Alert local maintenance crews.' :
                      'Maintain standard operational procedures.'}
                   </div>
                </div>
             </div>
          </div>
`;

content = content.replace('{/* MAIN 3D VIEWER */}', aiGuidanceHtml + '\n          {/* MAIN 3D VIEWER */}');

fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
